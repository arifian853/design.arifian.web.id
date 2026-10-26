# Showcase catalog

The public catalog is static display metadata for live synthetic specimens. It has no backend or source-retrieval contract. The approved Terracotta Minimalist Brutalism tokens and homepage hero are preserved.

## Information architecture

The wordmark links home. Primary navigation is Foundations, Components, Patterns, Motion, followed by the theme control. About and the Arifian Originals collection are secondary/footer destinations. `/workbench/` redirects to `/components/`; the former data-display and layout category URLs redirect to Data and Surfaces.

| Category | Scope |
| --- | --- |
| Actions | Button states, related actions, segmented choices and clipboard behavior |
| Forms | Fields, selections, composers, date selection and local file handling |
| Navigation | Navbar, paths, menus, tabs, commands, sidebar and movement |
| Feedback | Notices, status, progress, recovery and reusable message anatomy |
| Overlays | Dialog, sheet, drawer, contextual menus and project inspection |
| Data | Records, chart variants, timelines, response structure and code |
| Media | Carousel/lightbox, comparison, avatars, ratio and framed media |
| Surfaces | Cards, editorial headings, disclosures and resizable layouts |

Originals is a view of the same canonical catalog, selecting `portfolio-derived` and `arifian-original` entries across kinds. Its total overlaps the component/motion/pattern totals. It is never an additional kind or a parallel inventory.

## Metadata

`frontend/src/lib/catalog.ts` owns the canonical families and derived totals. `specimen-ids.ts` declares renderer identifiers; tests enforce exact parity with the renderer registry and generated destinations.

| Field | Meaning |
| --- | --- |
| `slug`, `name`, `summary` | Stable anchor and authored display description |
| `kind` | `component`, `motion`, or `pattern` |
| `category` | One of the eight categories above |
| `origin` | `portfolio-derived`, `arifian-original`, `shadcn-adapted`, or `external-inspired` |
| `maturity` | `stable`, `beta`, or `experimental`; independent of QA evidence |
| `family` | Optional canonical family identifier; duplicate families are rejected |
| `aliases` | Searchable alternate names and covered variants |
| `reference` | Optional HTTPS public reference; required for external inspiration |
| `license` | Exact source/implementation terms; no blanket MIT claim for authored work |
| `tags`, `states`, `motion` | Searchable behavior, relevant states and static-fallback notes |

Validation rejects unknown fields, unsafe slugs, duplicate slugs/families, unsupported origins/maturity, unsafe references and unrenderable entries. No source files, private identifiers, revisions, credentials or agent hints belong in this projection.

## Filtering and counts

The component index intersects category, origin and search independently. Search covers name, aliases, purpose, tags, states and motion/behavior notes. Query parameters are `category`, `origin`, and `q`; reload and history navigation restore them. Invalid category/origin values resolve to All. Clearing resets all three filters. Counts derive from canonical entries and never from variants or the number of preview cards on a page.

The deduplication rules are explicit:

- Loading belongs to Button. Clipboard actions remain a separate family; response/code copying reuse that behavior.
- Chart includes bar, line, area, donut, radial, radar and compact variants with exact data alternatives.
- Reveal includes fade, slide, blur, stagger and split variants.
- Spotlight Card owns pointer spotlight; Motion also shows that same canonical specimen without another count.
- Form validation and About Bento belong to Patterns.
- Message Item, Reply and Composer compose the Message Board pattern. AI families compose the scripted Chat pattern.
- Date range belongs to Date Picker; multiple selection belongs to Combobox. Dropzone upgrades File Selection.

## Portfolio parity

The current implementation is based on inspected portfolio components and CSS, with synthetic projects, people and conversations. Navigation, editorial hero anatomy, project list/meta/preview, carousel/lightbox, reusable AI/message families, About Bento and footer/CRT details have specimens. Small pieces such as project icons/tech items, character counts, accent rules, CTA groups and scroll hints are demonstrated inside their reusable family rather than counted individually.

Project Popover retains the two-second pointer dwell and 300ms transfer grace. An explicit button supports keyboard/touch. Native popover top-layer rendering and CSS anchor positioning have a measured, viewport-clamped fallback. Escape closes and returns focus; a specimen control forces the fallback for QA. Carousel arrow handling is scoped to the gallery and its titled lightbox. Kanban adds drag/drop to its existing keyboard move controls; File Tree adds selected-file feedback to native folder disclosures.

The response fixture demonstrates prose, lists, links, a semantic table and code; it does not claim a general Markdown parser or syntax highlighter. Chat uses suggestions, multiline/keyboard submit, pending feedback and local retry. No service call, upload or shell command is made. Theme Toggle shares the existing light/dark preference; a System setting is not claimed.

## Curated references

New Base UI specimens reuse the installed, reviewed MIT foundation and existing shadcn primitives. Native calendar/resizing/ratio utilities are locally authored and are labeled accordingly. No registry install, package addition, supplier code copy or Pro source is included.

Original Chroma Project Grid, text/reveal studies, terminal, scroll progress, marquee, dropzone and tags record their public inspiration. The original implementations retain this system's tokens, geometry, focus and motion language. React Bits is **MIT + Commons Clause**, allowing use in an app/site while restricting redistribution of its components; this showcase does not repackage its source. Supplier terms and links are recorded in [third-party notices](../frontend/THIRD_PARTY_NOTICES.md).

Image crop, a rich editor, Gantt, shader effects and Scroll Stack are not added speculatively. Image zoom is already represented by the canonical lightbox. No second spotlight, ticker, tree, composer or board is added to inflate totals.

## Review and release

Category pages preserve SpecimenCard and introduce signature full-width specimens, medium cards and compact utilities. All entries remain `beta` pending the parent's browser and visual QA; maturity is not a passed-test badge.

Required source gates are typecheck, unit tests, public static build/privacy audit and diff checks. Parent-owned browser QA covers interactions, active underline geometry, focus return, desktop/mobile layouts, both themes, reduced motion, axe, console/network failures and screenshots. Browser discovery is not browser execution. QA artifacts, internal plans, source snapshots, skills, caches and build output remain outside source publication. The scoped GitHub/Netlify release is already user-authorized after QA and remains parent-owned. The site remains `noindex`.

Private backend inspection, authentication, API/MCP and source retrieval are separate work. No backend behavior is inferred from this metadata.
