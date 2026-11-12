import { after as afterAll, before as beforeAll, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { fileURLToPath } from 'node:url';
import type { CatalogEntry, Category } from '../src/lib/catalog';
const { catalog, categories }: { catalog: CatalogEntry[]; categories: { slug: Category; name: string; summary: string }[] } = JSON.parse((await promisify(execFile)('bun', ['-e', 'import {catalog,categories} from "./src/lib/catalog.ts"; console.log(JSON.stringify({catalog,categories}))'], { cwd: fileURLToPath(new URL('../', import.meta.url)), encoding: 'utf8' })).stdout);

const root = fileURLToPath(new URL('../', import.meta.url));
const entry = fileURLToPath(new URL('../scripts/catalog-mcp.ts', import.meta.url));
const fields = ['slug', 'name', 'summary', 'category', 'kind', 'origin', 'maturity', 'states', 'aliases'];
const toolNames = ['list_categories', 'list_catalog', 'get_catalog_entry'];
const client = new Client({ name: 'catalog-boundary-test', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: 'bun', args: ['run', entry], cwd: `${root}tests`, stderr: 'pipe',
});
let stderr = '';
transport.stderr?.on('data', chunk => { stderr += String(chunk); });
beforeAll(async () => {
  try { await client.connect(transport); }
  catch (error) { throw new Error(`MCP startup failed: ${stderr}`, { cause: error }); }
}, { timeout: 10000 });
afterAll(async () => { await client.close(); });

async function call(name: string, args: Record<string, unknown> = {}) {
  const result = await client.callTool({ name, arguments: args });
  assert.notStrictEqual(result.isError, true);
  assert.deepEqual(result.content, [{ type: 'text', text: JSON.stringify(result.structuredContent) }]);
  return result.structuredContent as Record<string, any>;
}

test('stdio initializes with only the three read-only, closed-world tools', async () => {
  assert.deepEqual(client.getServerVersion(), { name: 'arifian-design-catalog', version: '1.0.0' });
  assert.deepEqual(client.getServerCapabilities(), { tools: {} });
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map(tool => tool.name), toolNames);
  for (const tool of tools) {
    assert.deepEqual(tool.annotations, { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false });
    assert.strictEqual(tool.inputSchema.additionalProperties, false);
  }
  assert.deepEqual(tools.map(tool => Object.keys(tool.inputSchema.properties ?? {})), [[], ['category', 'kind', 'query'], ['slug']]);
  assert.strictEqual(stderr, '');
});

test('all family results contain exactly the public allowlist, including normalized aliases', async () => {
  const result = await call('list_catalog');
  assert.deepEqual(Object.keys(result).sort(), ['count', 'entries']);
  assert.strictEqual(result.count, catalog.length);
  assert.strictEqual((result.entries).length, catalog.length);
  for (const [index, entry] of result.entries.entries()) {
    assert.deepEqual(Object.keys(entry).sort(), [...fields].sort());
    const original = catalog[index]!;
    for (const field of fields) {
      assert.deepEqual(entry[field], field === 'aliases' ? original.aliases ?? [] : original[field as keyof typeof original]);
    }
  }
});

test('category counts count canonical families of every kind exactly once', async () => {
  const result = await call('list_categories');
  assert.deepEqual(Object.keys(result).sort(), ['categories', 'count']);
  assert.strictEqual(result.count, catalog.length);
  assert.deepEqual(result.categories, categories.map(category => ({
    slug: category.slug, name: category.name, summary: category.summary,
    counts: {
      components: catalog.filter(entry => entry.category === category.slug && entry.kind === 'component').length,
      patterns: catalog.filter(entry => entry.category === category.slug && entry.kind === 'pattern').length,
      motion: catalog.filter(entry => entry.category === category.slug && entry.kind === 'motion').length,
    },
  })));
  assert.strictEqual(result.categories.reduce((sum: number, category: { counts: Record<string, number> }) => sum + Object.values(category.counts).reduce((subtotal, count) => subtotal + count, 0), 0), catalog.length);
});

test('search uses public names, summaries, slugs and aliases; categories compose with search', async () => {
  assert.deepEqual((await call('list_catalog', { query: 'LOADING BUTTON' })).entries.map((item: { slug: string }) => item.slug), ['button']);
  assert.deepEqual((await call('list_catalog', { query: 'loading button', category: 'forms' })).entries, []);
  assert.strictEqual((await call('list_catalog', { query: 'no-such-public-family' })).count, 0);
  for (const kind of ['component', 'pattern', 'motion']) {
    const result = await call('list_catalog', { kind });
    assert.strictEqual(result.count, catalog.filter(entry => entry.kind === kind).length);
    assert.ok(result.entries.every((entry: { kind: string }) => entry.kind === kind));
  }
  for (const category of categories) {
    const result = await call('list_catalog', { category: category.slug });
    assert.strictEqual(result.count, catalog.filter(item => item.category === category.slug).length);
    assert.strictEqual(result.entries.every((item: { category: string }) => item.category === category.slug), true);
  }
  // References and implementation hints are excluded even from searchable fields.
  assert.strictEqual((await call('list_catalog', { query: 'https://' })).count, 0);
  assert.deepEqual(await call('get_catalog_entry', { slug: 'button' }), { entry: (await call('list_catalog', { query: 'loading button' })).entries[0] });
  assert.deepEqual(await call('get_catalog_entry', { slug: 'unknown-family' }), { entry: null });
});

test('invalid arguments, extra fields and unknown tools are rejected without reflecting inputs', async () => {
  const marker = 'synthetic-sensitive-input';
  const cases: [string, Record<string, unknown>][] = [
    ['list_categories', { path: marker }], ['list_catalog', { source: marker }],
    ['get_catalog_entry', { slug: 'button', credential: marker }],
    ['list_catalog', { category: marker }], ['list_catalog', { kind: marker }], ['list_catalog', { query: 42 }],
    ['list_catalog', { query: marker.repeat(20) }], ['get_catalog_entry', {}],
    ['get_catalog_entry', { slug: `../../${marker}` }], ['get_catalog_entry', { slug: [marker] }],
    ['get_catalog_entry', { slug: 'x'.repeat(81) }], ['list_catalog', { query: { path: marker } }],
    ['list_catalog', { write: marker }], [marker, {}],
  ];
  for (const [name, args] of cases) {
    try {
      await client.callTool({ name, arguments: args });
      throw new Error('Expected rejection');
    } catch (error) {
      assert.ok(error instanceof McpError);
      assert.strictEqual((error as McpError).code, ErrorCode.InvalidParams);
      assert.ok(!((error as Error).message).includes(marker));
      assert.ok(((error as Error).message).includes('Invalid catalog request.'));
    }
  }
  // The SDK sanitizes prototype keys before dispatch; they cannot affect the inventory.
  assert.deepEqual(
    await call('list_catalog', JSON.parse('{"__proto__":{"catalog":"synthetic-sensitive-input"}}')),
    await call('list_catalog'),
  );
  assert.strictEqual((await call('get_catalog_entry', { slug: 'button' })).entry.slug, 'button');
  assert.strictEqual(stderr, '');
});

test('no resources, templates, prompts or write tools can be discovered or called', async () => {
  for (const request of [
    () => client.listResources(), () => client.listResourceTemplates(), () => client.listPrompts(),
    () => client.readResource({ uri: 'file:///synthetic-denied' }),
    () => client.getPrompt({ name: 'synthetic-denied' }),
  ]) await assert.rejects(request, error => error instanceof McpError && error.code === ErrorCode.MethodNotFound);
  assert.deepEqual((await client.listTools()).tools.map(tool => tool.name), toolNames);
});

test('the package script also starts a real protocol server without a site build', { timeout: 10000 }, async () => {
  const scripted = new Client({ name: 'catalog-script-test', version: '1.0.0' });
  const child = new StdioClientTransport({ command: 'bun', args: ['run', '--silent', '--cwd', root, 'mcp'], cwd: `${root}tests`, stderr: 'pipe' });
  try {
    await scripted.connect(child);
    assert.deepEqual((await scripted.listTools()).tools.map(tool => tool.name), toolNames);
    await scripted.ping();
  } finally { await scripted.close(); }
});

test('npm can launch the same stdio script with Bun on PATH', { timeout: 10000 }, async () => {
  const scripted = new Client({ name: 'catalog-npm-test', version: '1.0.0' });
  const child = new StdioClientTransport({ command: 'npm', args: ['--prefix', root, 'run', '--silent', 'mcp'], cwd: `${root}tests`, stderr: 'pipe' });
  try {
    await scripted.connect(child);
    assert.deepEqual((await scripted.listTools()).tools.map(tool => tool.name), toolNames);
    await scripted.ping();
  } finally { await scripted.close(); }
});
