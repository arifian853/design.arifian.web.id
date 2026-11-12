# Arifian Design System frontend

Astro + React + TypeScript, Tailwind CSS, shadcn Base UI, and Motion. The frontend statically renders a single Terracotta Minimalist Brutalism design system with light and dark appearances.

Use the existing pinned toolchain and lockfile. Astro requires Node 22.23.4 or a supported newer runtime; Bun manages the project scripts. The local catalog MCP pins the already locked SDK and its validation peer as explicit dependencies.

## Structure

Astro pages own routing and the shared shell. React islands own local specimen interactions. Semantic CSS variables define surfaces, text, borders, states, and focus; structural surfaces have sharp corners. Locally hosted Lexend Deca and Inclusive Sans fonts include their OFL notices.

Public catalog metadata contains display information and specimen identifiers. Counts and category totals come from that metadata. Examples use synthetic data and keep form, chat, and message interactions in memory. No private source is imported into the static build.

## Checks

The package scripts provide typecheck, unit, static build, and Playwright checks. Read the root [design contract](../DESIGN.md) and [catalog documentation](../docs/component-catalog.md) before changing specimens. Keep screenshots and browser artifacts in ignored QA storage, never in public assets.

When a session authorizes a development server, follow the frontend repository instructions and bind it to loopback. The current implementation session leaves server and browser execution to the parent. Browser verification needs permission to create local sockets and launch Chromium. If those capabilities are unavailable, typecheck, unit tests, build, and artifact audits can still run; browser accessibility, visual, responsive, and reduced-motion behavior remain unverified until a browser run succeeds.

## Boundaries

The frontend has no profile selector, source viewer, registry, public source retrieval, or backend dependency. The legacy workbench route permanently redirects to the component showcase. Every route stays `noindex` pending separate approval.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for provenance. No commit, push, deployment, infrastructure change, or backend modification is implied by local development or a successful build.

## Current verification workflow

From `frontend/`, run `bun run typecheck`, `bun --bun run build:public`, then `bun test tests`. The Bun-runtime build works with the installed Bun toolchain when the shell’s default Node is below Astro’s required version. The regular build also runs the artifact audit; `build:public` is its alias. The audit reads only the fixed public asset and generated output trees, never private inputs.

`bun run test:browser` discovers the current redesign, catalog update, interaction and endpoint-boundary suites. `bun run test:browser --list` only lists tests; it does not launch Chromium or establish browser/axe results. The parent owns the current browser, visual and production QA. This implementation leaves the tree uncommitted.

The index combines category, origin and text filters in the URL. Category pages retain the specimen-card structure with signature wide examples and compact utilities. See the catalog documentation for family deduplication and provenance rules.

## Local agent access

The public catalog has a local STDIO MCP server, separate from the static site. Hosted HTTP access is not available; there is no HTTP transport, credential setup or Astro server requirement. Use the release branch for the MCP implementation:

On a machine with Git, Bun 1.4.2, supported Node (see `engines`), and enough disk space:

```sh
git clone --branch redesign/arifian-design-system-2026-10-26 https://github.com/arifian853/design.arifian.web.id.git
cd design.arifian.web.id/frontend
test -f scripts/catalog-mcp.ts
bun install --frozen-lockfile
bun run test:mcp
bun run --silent mcp
```

Skip installation when using this checkout's existing pinned dependencies. Installation and fresh cloning were not run for this task because disk space is constrained. The repository URL matches the configured origin; script paths, installed versions, lock records and local protocol startup are checked without an install. `npm run --silent mcp` is an alternative launcher when Bun is on PATH. Standalone startup waits for JSON-RPC on stdin with no banner; Ctrl+C stops it. A client launches the process itself, so no standalone server needs to remain running.

From `frontend/`, configure the desired installed client (these commands change that client's settings):

```sh
codex mcp add arifian-design -- bun run "$PWD/scripts/catalog-mcp.ts"
codex mcp list

claude mcp add --transport stdio --scope local arifian-design -- bun run "$PWD/scripts/catalog-mcp.ts"
claude mcp get arifian-design
```

The shell resolves the absolute entry path at registration; the server is independent of the client's working directory. Bun must be on the client's PATH. Use `/mcp` in Claude Code to check the connection. No client settings are modified by building or testing this repository.

| Tool | Accepted inputs | Output |
| --- | --- | --- |
| `list_categories` | Empty object | Category slug, name, summary and separate component, pattern and motion counts; total count |
| `list_catalog` | Optional category enum, kind (`component`, `pattern` or `motion`), and public query of at most 120 characters | Matching canonical entries and count |
| `get_catalog_entry` | Canonical slug, at most 80 characters | One catalog entry, or null for an unknown slug |

Only `slug`, `name`, `summary`, `category`, `kind`, `origin`, `maturity`, `states` and `aliases` from `src/lib/catalog.ts` can leave the server as family metadata. Absent aliases become an empty array. Category counts are split by kind and computed from the same canonical catalog; variants and states do not create extra entries. Results include matching text and structured JSON. Searching uses only public slug, name, summary and aliases, combined with optional kind/category filters.

The implementation explicitly projects these fields rather than serializing entire catalog entries. It exposes no source file contents, private documents/IDs, references, licenses, tags, implementation/motion hints, arbitrary file access, environment values or write operations. It advertises only three read-only tools and no resources, resource templates, prompts, HTTP, logging, elicitation or secret input fields. Unknown tools, extra argument fields and invalid inputs are rejected with a fixed message without reflecting their values. Keep queries public; free text is never a place to supply credentials. The STDIO receive buffer is bounded to 16 KiB.

`bun run test:mcp` uses the official SDK's `Client` and `StdioClientTransport` under Node against the actual Bun entry and package launcher, including startup from another directory. Node runs the protocol suite directly to avoid restricted child-process pipe I/O in the local Bun test runtime. This is separate from `bun test tests`; run both. No new downloads or emitted server build are needed.

Official references: [MCP TypeScript SDK source](https://github.com/modelcontextprotocol/typescript-sdk), [SDK v1 docs](https://ts.sdk.modelcontextprotocol.io/), [STDIO guide](https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/docs/server.md#stdio), [Codex MCP](https://developers.openai.com/codex/mcp/), and [Claude Code MCP](https://code.claude.com/docs/en/mcp). The npm package name for the official TypeScript SDK's installed v1 line is `@modelcontextprotocol/sdk`, pinned here to 1.32.2. Its required Zod peer is pinned to the existing 4.6.7 record. Only the dependency manifests and lockfile workspace entries change; package resolution/integrity records stay intact. See the local third-party notices for licenses.
