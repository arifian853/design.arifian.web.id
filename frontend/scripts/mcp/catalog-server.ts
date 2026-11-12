import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, type Tool } from '@modelcontextprotocol/sdk/types.js';
import { catalog, categories, type CatalogEntry } from '../../src/lib/catalog';

// Deliberate projection: new catalog properties never become MCP output implicitly.
function publicComponent(entry: CatalogEntry) {
  return {
    slug: entry.slug, name: entry.name, summary: entry.summary, category: entry.category,
    kind: entry.kind, origin: entry.origin, maturity: entry.maturity,
    states: [...entry.states], aliases: [...(entry.aliases ?? [])],
  };
}

const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const kinds = ['component', 'pattern', 'motion'] as const;
const tools: Tool[] = [
  {
    name: 'list_categories', description: 'List public design categories, summaries and canonical counts split into component, pattern and motion kinds.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations,
  },
  {
    name: 'list_catalog', description: 'List canonical catalog entries, optionally filtering by category, kind and a public name, slug, summary or alias. Supply public search terms only.',
    inputSchema: {
      type: 'object', properties: {
        category: { type: 'string', enum: categories.map(category => category.slug) },
        kind: { type: 'string', enum: [...kinds] },
        query: { type: 'string', maxLength: 120, description: 'Public catalog search terms only; never supply secrets.' },
      }, additionalProperties: false,
    }, annotations,
  },
  {
    name: 'get_catalog_entry', description: 'Get allowlisted public metadata for one exact canonical catalog slug; returns null when absent.',
    inputSchema: {
      type: 'object', properties: { slug: { type: 'string', maxLength: 80, pattern: '^[a-z][a-z0-9-]*$' } },
      required: ['slug'], additionalProperties: false,
    }, annotations,
  },
];

function invalid(): never { throw new McpError(ErrorCode.InvalidParams, 'Invalid catalog request.'); }
function argumentsOnly(value: Record<string, unknown> | undefined, allowed: string[]) {
  const args = value ?? {};
  if (Object.keys(args).some(key => !allowed.includes(key))) invalid();
  return args;
}
function result(structuredContent: Record<string, unknown>) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(structuredContent) }], structuredContent };
}

/** Fixed public catalog only. No filesystem, environment, network or client-root retrieval. */
export function createCatalogServer() {
  const server = new Server({ name: 'arifian-design-catalog', version: '1.0.0' }, {
    capabilities: { tools: {} },
    instructions: 'Read-only public design catalog metadata. No source contents, private documents, credentials or write operations. Use public search terms only. Local stdio; hosted HTTP access is not yet available.',
  });
  server.setRequestHandler(ListToolsRequestSchema, () => ({ tools }));
  server.setRequestHandler(CallToolRequestSchema, request => {
    switch (request.params.name) {
      case 'list_categories': {
        argumentsOnly(request.params.arguments, []);
        return result({ categories: categories.map(category => ({
          slug: category.slug, name: category.name, summary: category.summary,
          counts: {
            components: catalog.filter(entry => entry.category === category.slug && entry.kind === 'component').length,
            patterns: catalog.filter(entry => entry.category === category.slug && entry.kind === 'pattern').length,
            motion: catalog.filter(entry => entry.category === category.slug && entry.kind === 'motion').length,
          },
        })), count: catalog.length });
      }
      case 'list_catalog': {
        const { category, kind, query } = argumentsOnly(request.params.arguments, ['category', 'kind', 'query']);
        if (category !== undefined && !categories.some(item => item.slug === category)) invalid();
        if (kind !== undefined && !(kinds as readonly unknown[]).includes(kind)) invalid();
        if (query !== undefined && (typeof query !== 'string' || query.length > 120)) invalid();
        const term = typeof query === 'string' ? query.trim().toLowerCase() : '';
        const entries = catalog.map(publicComponent).filter(entry =>
          (category === undefined || entry.category === category) &&
          (kind === undefined || entry.kind === kind) &&
          [entry.slug, entry.name, entry.summary, ...entry.aliases].some(value => value.toLowerCase().includes(term)),
        );
        return result({ entries, count: entries.length });
      }
      case 'get_catalog_entry': {
        const { slug } = argumentsOnly(request.params.arguments, ['slug']);
        if (typeof slug !== 'string' || slug.length > 80 || !/^[a-z][a-z0-9-]*$/.test(slug)) invalid();
        const entry = catalog.find(item => item.slug === slug);
        return result({ entry: entry ? publicComponent(entry) : null });
      }
      default: return invalid();
    }
  });
  return server;
}
