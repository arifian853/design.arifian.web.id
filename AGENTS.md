# Repository instructions

Read the ignored internal `ImplementationPlan.md`, `ProjectTimeline.md`, and `ImplementationStatus.md` for full scope. They are local-only and must never be added to Git. Treat everything under ignored `private/` as confidential.

## Product and visual contract

- This is a design-system library/workbench built with Astro + React + TypeScript and Bun.
- The selected design document controls the workbench's whole visual profile: composition, typography, density, shape, borders/surfaces, palette, and motion. A selection change must cause structural visual changes, not only color changes.
- Keep Material 3 Subtle profiles distinct from Parchment/Terracotta Brutalism. Do not blend design rules.
- Use synthetic fixture profiles for tests and any public/demo content. Until separate publication permission exists, do not copy private Bookshelf document text, source-derived tokens, colors, IDs, revision metadata, headings, or screenshots into tracked files, browser bundles, `dist/`, public API/MCP responses, telemetry, or logs.
- `private/` is a local audit/preview source only and is intentionally Git-ignored. Never import it into static build code. Any local-only inspection path must be loopback-bound, development-only, read-only, and fail closed in production.
- The public GitHub repository is for app code only. The public repository does not make the website or the private source documents public.

## Engineering and security

- Keep the frontend statically buildable for Netlify. The separate ElysiaJS/Bun backend is not authorized for production deployment until per-document access and owner authentication are designed and tested.
- Do not expose credentials in client code, `PUBLIC_*` values, committed files, artifacts, screenshots, logs, or agent outputs. `.env*`, internal plans, source snapshots, and local agent skills stay ignored.
- Use shadcn/ui primitives with customized, semantically tokenized styling; pin CLI/dependency versions. Review every installed registry item and its license before adding it.
- Use Motion for meaningful animation, with a complete reduced-motion/static mode. Never hijack scroll.
- Use test-first vertical slices. Verify keyboard/focus, responsive behavior, contrast, and reduced motion. Don't claim browser/accessibility verification without running it.
- No GitHub push, Netlify linking/deploy, DNS, Bookshelf mutation, or VPS mutation without passing the corresponding internal plan gate. Production deployment still requires explicit post-QA approval.
