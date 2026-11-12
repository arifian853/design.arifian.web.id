import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

test('About documents local-only agent access, its boundary and official setup references', () => {
  const html = readFileSync('dist/about/index.html', 'utf8');
  for (const text of [
    'id="agent-access"', 'Agent Access', 'Hosted HTTP access is not yet available',
    'list_categories', 'list_catalog', 'get_catalog_entry', 'No source file contents',
    'bun install --frozen-lockfile', 'bun run --silent mcp', 'test -f scripts/catalog-mcp.ts',
    'codex mcp add arifian-design -- bun run', 'claude mcp add --transport stdio --scope local arifian-design -- bun run',
    'https://ts.sdk.modelcontextprotocol.io/', 'https://developers.openai.com/codex/mcp/',
    'https://code.claude.com/docs/en/mcp', 'https://github.com/modelcontextprotocol/typescript-sdk',
    'git clone --branch redesign/arifian-design-system-2026-10-26',
  ]) expect(html.includes(text), text).toBe(true);
  expect(html).not.toContain('be-design.arifian.web.id');
  expect(html).not.toContain('--transport http');
});
