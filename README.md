# design.arifian.web.id

A personal design-system library and live workbench for comparing complete visual directions, component patterns, and page recipes.

Planned frontend: Astro + React + TypeScript, Tailwind CSS, shadcn/ui source components, and Motion for React. A separately gated ElysiaJS/Bun service is planned for access-controlled catalog data and future agent integrations.

The workbench is intended to apply the selected design profile across its overall composition and components—not only its palette. It currently covers two distinct families: Material 3 Subtle variants and a warm Terracotta / Minimalist Brutalism direction.

## Privacy

This public repository contains application code only. Private Bookshelf design documents, original token values, credentials, internal project notes, and any unapproved source material must not be committed or included in static build output. Access to private designs requires a separately authorized backend boundary. Do not place credentials in client-side environment variables or repository history.

## Development

The project uses Bun. Install dependencies with `bun install`; run scripts defined in `package.json`. Never run a deploy from this repository without release approval.
