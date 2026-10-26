# Repository instructions

Read `DESIGN.md` and the current user-approved task for active product scope. Ignored `ImplementationPlan.md`, `ProjectTimeline.md`, and `ImplementationStatus.md` are historical context/release evidence only; their leading supersession notes govern conflicts. They are local-only and must never be added to Git. Treat ignored `private/` as confidential.

## Product and visual contract

- One canonical Arifian Design System: **Terracotta Minimalist Brutalism**. The current visual identity is approved. Preserve its exact palette, Lexend Deca / Inclusive Sans typography, zero-radius structural geometry, warm parchment and ivory surfaces, restrained terracotta, thin borders, editorial composition, and light/dark language. Do not introduce additional visual families or design switching.
- This Astro + React + TypeScript / Bun site is a static component showcase. External interaction references must be normalized into the existing visual language.
- The catalog counts canonical families, with explicit kind, origin and maturity. Variants and states do not become extra entries. Originals is a curated provenance view of the same catalog.
- Use synthetic projects, people, conversations, metrics and fixtures in all public examples. Do not import private source documents, normalized records, QA materials, source-derived metadata or backend implementation into static code, output, telemetry or logs.
- Private agent/source retrieval is a separate backend concern. Do not infer its API or deploy it as part of a frontend release. The public code repository grants no publication permission for private materials.

## Engineering and release

- Keep the frontend statically buildable for Netlify. No credentials in client code, `PUBLIC_*` values, committed files, artifacts or logs. Internal plans/status/timeline, `.env*`, local skills, caches, source snapshots, QA and `dist/` stay ignored.
- Reuse reviewed local shadcn/Base UI primitives and semantic tokens. Pin dependencies and CLI versions; inspect code and exact licenses before adding any source or package. No blanket registry installation or public registry onboarding.
- Use Motion for meaningful, bounded transitions with a complete reduced-motion/static mode. Never capture or replace native scrolling.
- Use test-first vertical slices. Run typecheck, unit tests, public build/privacy audit and diff checks. Browser review must cover keyboard/focus, responsive layout, contrast, reduced motion, themes and axe. Never claim a browser check without running it.
- Review the exact diff and publication paths before release. Follow the current session's authorization and release ownership. GitHub/Netlify updates are limited to the scoped site; DNS, Bookshelf and VPS mutations require separate authorization. Preserve unrelated local changes.
