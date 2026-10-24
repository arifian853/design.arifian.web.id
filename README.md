# design.arifian.web.id

A personal design-system library and live workbench for comparing complete visual directions, component patterns, and page recipes.

Planned frontend: Astro + React + TypeScript, Tailwind CSS, shadcn/ui source components, and Motion for React. A separately gated ElysiaJS/Bun service is planned for access-controlled catalog data and future agent integrations.

The workbench is intended to apply the selected design profile across its overall composition and components—not only its palette. It currently covers two distinct families: Material 3 Subtle variants and a warm Terracotta / Minimalist Brutalism direction.

## Privacy and explicitly public specimen data

The deployed site intentionally exposes exactly two curated runtime profiles: **Rosewood / Subtle** and **Terracotta**. Their design-profile fields (palette, typography, shape, density, composition recipe, and motion) are public and downloadable at `/design-specimens.json`; this is required for the interactive preview. The original Markdown, full source documents, remaining Subtle profiles, normalized source snapshots, credentials, and internal project notes remain private and are not in the repository or deployed artifact.

`frontend/scripts/export-public-specimens.ts` projects only the two approved runtime profiles from the owner-local mode-0600 normalized input into `dist/`. It does not copy source prose or other designs. The generated public payload is an ignored build artifact and must not be committed. For a release, run `bun run build:public`, inspect `dist/design-specimens.json` and scan the remaining artifact, then deploy that exact `dist/` output. The public repository contains the exporter and app code, not the private input or generated profile payload.

## Development

The project uses Bun. Install dependencies with `bun install`; run scripts defined in `package.json`. Never run a deploy from this repository without release approval.
