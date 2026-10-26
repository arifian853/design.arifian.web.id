# Arifian Design System frontend

Astro + React + TypeScript, Tailwind CSS, shadcn Base UI, and Motion. The frontend statically renders a single Terracotta Minimalist Brutalism design system with light and dark appearances.

Use the existing pinned toolchain and lockfile. Astro requires Node 22.23.4 or a supported newer runtime; Bun manages the project scripts. No dependency installation is part of this redesign.

## Structure

Astro pages own routing and the shared shell. React islands own local specimen interactions. Semantic CSS variables define surfaces, text, borders, states, and focus; structural surfaces have sharp corners. Locally hosted Lexend Deca and Inclusive Sans fonts include their OFL notices.

Public catalog metadata contains display information and specimen identifiers. Counts and category totals come from that metadata. Examples use synthetic data and keep form, chat, and message interactions in memory. No private source is imported into the static build.

## Checks

The package scripts provide typecheck, unit, static build, and Playwright checks. Read the root [design contract](../DESIGN.md) and [catalog documentation](../docs/component-catalog.md) before changing specimens. Keep screenshots and browser artifacts in ignored QA storage, never in public assets.

Run the development server in Astro background mode bound to loopback, as required by the frontend repository instructions. Browser verification needs permission to create local sockets and launch Chromium. If those capabilities are unavailable, typecheck, unit tests, build, and artifact audits can still run; browser accessibility, visual, responsive, and reduced-motion behavior remain unverified until a browser run succeeds.

## Boundaries

The frontend has no profile selector, source viewer, registry, public source retrieval, or backend dependency. The legacy workbench route clearly links to the component showcase. Every route stays `noindex` pending separate approval.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for provenance. No commit, push, deployment, infrastructure change, or backend modification is implied by local development or a successful build.

## Current verification workflow

From `frontend/`, run `bun run typecheck`, `bun --bun run build:public`, then `bun test tests`. The Bun-runtime build works with the installed Bun toolchain when the shell’s default Node is below Astro’s required version. The regular build also runs the artifact audit; `build:public` is its alias. The audit reads only the fixed public asset and generated output trees, never private inputs.

`bun run test:browser` selects the current redesign contract and static endpoint-boundary tests. Other browser files are retained historical coverage for the replaced UI kit; their fixed counts, profile exports and copied supplier demos describe the retired product. The new contract covers the current requirements without those obsolete assumptions. Browser test discovery (`--list`) can run without starting a server; execution, screenshots and axe remain host QA gates.
