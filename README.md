# Arifian Design System

A static showcase of **Terracotta Minimalist Brutalism**: warm parchment and ivory surfaces, near-black text, terracotta accents, sharp geometry, and editorial bento layouts. Lexend Deca sets the headings; Inclusive Sans carries body text and controls.

The visual language is extracted from the portfolio’s current frontend implementation. The showcase uses synthetic projects, messages, people, and metrics to demonstrate reusable interface behavior.

## Explore

- `/` — an introduction with working interface specimens and metadata-derived catalog counts.
- `/foundations/` — color roles, typography, spacing, geometry, borders, focus, and motion.
- `/components/` — searchable components, with dedicated category routes for actions, forms, navigation, feedback, overlays, data display, media, and cards/layout.
- `/originals/` — portfolio-derived interface language and original compositions.
- `/motion/` — bounded, replayable interaction studies with a static reduced-motion alternative.
- `/patterns/` — composed application, messaging, AI, and editorial examples.
- `/about/` — purpose, design principles, and provenance.
- `/workbench/` — a clearly labeled link to the component showcase.

## Implementation

Astro renders static pages. React and TypeScript provide interactive specimens, Tailwind supplies semantic styling, locally owned shadcn Base UI primitives provide accessible control anatomy, and Motion handles purposeful transitions. Dependencies remain in the existing lockfile; this redesign does not introduce a framework or install dependencies.

The project design contract is in [DESIGN.md](DESIGN.md). The [catalog documentation](docs/component-catalog.md) explains metadata, taxonomy, and how counts are derived. [Third-party notices](frontend/THIRD_PARTY_NOTICES.md) cover retained attribution and font licenses.

## Local verification

The existing frontend scripts cover typechecking, unit tests, static builds, privacy checks, and Playwright browser tests. Browser tests require a working local Chromium and permission to run a loopback preview. Screenshots and failure artifacts belong only in ignored local QA storage.

Automated accessibility results do not replace keyboard, responsive, reduced-motion, and visual review. A blocked browser run must be reported as blocked rather than passed.

## Content and release boundary

The public frontend uses static showcase metadata and synthetic examples. It does not retrieve private documents, design profiles, source files, or backend catalog data. There is no public registry or component distribution workflow. No backend implementation was available for inspection, so this repository makes no claims about backend routes or an agent integration contract.

The site remains `noindex`. This redesign is local and uncommitted; the README does not assert that these changes are live. Source publication, website publication, indexing, and any future authenticated catalog are separate decisions. A production release requires completed QA and explicit approval.
