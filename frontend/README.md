# Arifian Design System frontend

Astro + React + TypeScript, Tailwind CSS, shadcn Base UI, and Motion. The frontend statically renders a single Terracotta Minimalist Brutalism design system with light and dark appearances.

Use the existing pinned toolchain and lockfile. Astro requires Node 22.23.4 or a supported newer runtime; Bun manages the project scripts. No package is added by this cleanup; unused legacy dependencies are removed after an import/build audit.

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
