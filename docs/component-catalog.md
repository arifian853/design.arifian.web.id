# Showcase catalog

The public catalog describes live interface specimens. It is static display metadata and has no backend or source-retrieval contract.

## Taxonomy

| Category | Scope |
| --- | --- |
| Actions | Buttons, grouped actions, selection, copy, and pending feedback |
| Forms | Labeled fields, validation, selections, local file input, and composition |
| Navigation | Tabs, paths, disclosure, command search, pagination, and steps |
| Feedback | Alerts, status, progress, placeholders, recovery, and replies |
| Overlays | Dialogs, sheets, tooltips, and project inspection |
| Data display | Records, charts, timelines, and hierarchical data |
| Media | Galleries, comparison, avatars, and framed specimens |
| Cards & layout | Editorial headings, surfaces, grids, metrics, and bento compositions |

Entries also have a kind: component, motion, or pattern. Originals are a provenance subset and may overlap a kind; the homepage’s original count is not an additional mutually exclusive category.

## Public fields

The canonical frontend catalog lives in `frontend/src/lib/catalog.ts`.

| Field | Meaning |
| --- | --- |
| `slug` | Unique, stable showcase identifier and specimen anchor |
| `name`, `summary` | Display name and concise behavior description |
| `category` | One category from the frontend taxonomy |
| `kind` | Component, motion, or pattern |
| `original` | Membership in the system’s original-design collection |
| `origin`, `license` | Safe provenance labels and license metadata |
| `status` | Implementation lifecycle label, independent of QA evidence |
| `tags` | Searchable behavior and context labels |
| `states` | Relevant specimen states |
| `motion` | Bounded animation and static fallback notes |

This projection deliberately contains no implementation file contents, private document identifiers, credentials, revision records, infrastructure paths, agent configuration, or source retrieval payloads.

## Counts and filtering

Homepage totals derive from the catalog’s kinds and original membership. Category totals derive from entry categories. Search matches display names, descriptions, and tags. Do not type independent numeric totals into headings, cards, or documentation; catalog changes should propagate automatically.

Only add an entry when it has a corresponding real specimen. Variants belong under the same entry when they demonstrate the same component anatomy. Avoid counting decorative duplicates as separate components.

## Specimen behavior

Examples use synthetic content. Chat replies are scripted local demonstrations, message submissions are temporary local state, and file selection displays file metadata without uploading. Charts expose exact values as a semantic data alternative. Overlays use the retained accessible primitives with titles and dismissal controls. Motion is bounded and has a reduced-motion fallback.

No specimen contacts a backend, retrieves a private profile, or exposes component source. Large composed patterns live on dedicated pages rather than mounting the entire catalog on the homepage.

## Acceptance and evidence

A lifecycle label does not establish browser verification. Each change needs focused test-first behavior coverage, typecheck, unit tests, static build, an artifact privacy audit, and rendered review. Browser coverage must include navigation, keyboard/focus, overlays, light/dark, narrow and wide layouts, reduced motion, and axe checks.

Screenshots belong in ignored local QA storage. Report actual passed checks and any environmental blockers separately. Owner visual review and production approval remain separate from automated verification.

## Backend boundary

No backend implementation was available for inspection. No API paths, authentication scheme, catalog endpoints, or agent retrieval examples are specified here. A future authenticated catalog requires inspection of its actual implementation and a separately approved contract.

## Rendered implementation and review status

`Specimens.tsx` supplies the typed renderer registry; `specimen-ids.ts` is its allowed identifier set. Tests enforce parity between metadata and renderers and verify every specimen’s generated destination and anchor. Category pages render component entries, Motion renders motion entries, and Patterns renders compositions. Originals is an overlapping view of original authorship. Specimens are server-rendered for readability and hydrate as they become visible.

The previous supplier animation files now contain independent Motion implementations. Static showcase output has no profile manifest, alternate-profile selector or service request. The retired exporter fails immediately and is disconnected from build scripts. The artifact audit traverses only the public asset and generated output trees, refusing symlinks, private markers, profile payloads, credential-shaped values and source maps.

Current source validation does not promote entries out of `preview`. Host browser QA must verify the current contract, inspect actual screenshots, and review all categories in both appearances. No backend schema or API documentation is generated from frontend assumptions.
