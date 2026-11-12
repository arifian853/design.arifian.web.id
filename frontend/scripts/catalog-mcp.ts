import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createCatalogServer } from './mcp/catalog-server';

// stdout belongs exclusively to MCP JSON-RPC. No HTTP listener or build step.
const server = createCatalogServer();
const close = () => { void server.close(); };
process.stdin.once('end', close);
process.once('SIGINT', close);
process.once('SIGTERM', close);
try {
  await server.connect(new StdioServerTransport(process.stdin, process.stdout, { maxBufferSize: 16 * 1024 }));
} catch {
  console.error('Public catalog MCP could not start.');
  process.exitCode = 1;
}
