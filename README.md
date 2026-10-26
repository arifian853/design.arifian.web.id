# Arifian Design System

A static showcase of **Terracotta Minimalist Brutalism**: warm parchment and ivory surfaces, near-black text, terracotta accents, sharp geometry, and editorial bento layouts. Lexend Deca sets the headings; Inclusive Sans carries body text and controls.

The visual language is extracted from the portfolio’s current frontend implementation. The showcase uses synthetic projects, messages, people, and metrics to demonstrate reusable interface behavior.

## Explore

- `/` — an introduction with working interface specimens and metadata-derived catalog counts.
- `/foundations/` — color roles, typography, spacing, geometry, borders, focus, and motion.
- `/components/` — canonical component families with independent category, origin and search filters; category routes cover Actions, Forms, Navigation, Feedback, Overlays, Data, Media and Surfaces.
- `/originals/` — a curated secondary collection from the same canonical catalog.
- `/motion/` — bounded, replayable interaction studies with a static reduced-motion alternative.
- `/patterns/` — composed application, messaging, AI, and editorial examples.
- `/about/` — purpose, design principles, and provenance.
- `/workbench/` — a permanent redirect to the component showcase.

Primary navigation is Foundations, Components, Patterns and Motion. The wordmark links home; About and Originals are secondary/footer destinations. Provenance uses explicit origins rather than a boolean. Variants stay inside their canonical family.

## Implementation

Astro renders static pages. React and TypeScript provide interactive specimens, Tailwind supplies semantic styling, locally owned shadcn Base UI primitives provide accessible control anatomy, and Motion handles purposeful transitions. The cleanup removes unused legacy dependencies, keeps retained versions pinned, and adds no package or framework. New interaction specimens reuse the installed Base UI foundation or native platform controls.

The project design contract is in [DESIGN.md](DESIGN.md). The [catalog documentation](docs/component-catalog.md) explains metadata, taxonomy, and how counts are derived. [Third-party notices](frontend/THIRD_PARTY_NOTICES.md) cover retained attribution and font licenses.

## Local verification

The existing frontend scripts cover typechecking, unit tests, static builds, privacy checks, and Playwright browser tests. Browser tests require a working local Chromium and permission to run a loopback preview. Screenshots and failure artifacts belong only in ignored local QA storage.

Automated accessibility results do not replace keyboard, responsive, reduced-motion, and visual review. A blocked browser run must be reported as blocked rather than passed.

## Content and release boundary

The public frontend uses static showcase metadata and synthetic examples. It does not retrieve private documents, design profiles, source files, or backend catalog data. There is no public registry or component distribution workflow. No backend implementation was available for inspection, so this repository makes no claims about backend routes or an agent integration contract.

The site remains `noindex`. Local implementation is not evidence of a production release. The current scoped GitHub/Netlify update is user-authorized after QA; final review, browser verification, commit, push, deploy and production checks remain parent-owned. Indexing and any future authenticated catalog remain separate decisions.
