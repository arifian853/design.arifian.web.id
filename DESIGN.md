---
name: Arifian Design System — Terracotta Minimalist Brutalism
colors:
  background: '#f5f4ed'
  foreground: '#141413'
  card: '#faf9f5'
  secondary: '#e8e6dc'
  secondary-foreground: '#4d4c48'
  muted-foreground: '#5e5d59'
  border: '#f0eee6'
  ring: '#d1cfc5'
  destructive: '#b53333'
  brand-50: '#faf5f2'
  brand-200: '#e9c6b9'
  brand-400: '#d97757'
  brand-500: '#c96442'
  brand-600: '#be5c3a'
  brand-700: '#b55333'
  brand-800: '#964225'
  brand-950: '#3f1b10'
  dark-background: '#141413'
  dark-foreground: '#faf9f5'
  dark-card: '#30302e'
  dark-muted-foreground: '#b0aea5'
  dark-accent: '#3d3d3a'
typography:
  display:
    fontFamily: Lexend Deca
    fontSize: 44–72px
    fontWeight: '500'
    lineHeight: '1.12'
    letterSpacing: '-0.06em'
  heading:
    fontFamily: Lexend Deca
    fontSize: 28–40px
    fontWeight: '500'
    lineHeight: '1.25'
    letterSpacing: '-0.04em'
  body:
    fontFamily: Inclusive Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
rounded:
  structural: 0px
  functional-circle: 50%
spacing:
  unit: 4px
  small: 8px
  control-gap: 12px
  grid-gap: 16px
  card: 24px
  panel: 32px
  section: 96px
---

# Design System: Arifian Design System

## 1. Visual Theme & Atmosphere

Warm parchment, ivory surfaces and near-black text give this system a quiet reading rhythm. Sharp edges and fine borders keep interfaces precise. Terracotta provides emphasis in small amounts: a marker, a heading fragment, a hover border or a focused control.

The composition is editorial and asymmetrical. Large headings sit beside compact working interfaces; bento groups vary in span and density. The showcase expands the portfolio’s language into reusable examples with synthetic content.

### Extraction evidence

Extracted from the actual React/Next.js portfolio implementation, rather than its older design document. The inspected files in `arifian853/arifian853.github.io` include:

- `app/globals.css` and `app/layout.tsx`: exact neutral and brand tokens, semantic roles, Lexend Deca and Inclusive Sans.
- `app/_home_components/Hero.tsx`: left-aligned display hierarchy, tight tracking, short accent rules, generous breathing room, square action treatments and the easing curve.
- `app/_home_components/About.tsx`: one/three/four-column responsive bento, 16px gaps, square cards, 24px internal spacing and terracotta hover boundaries.
- `components/layout/Navbar.tsx` and `Footer.tsx`: restrained header, active indicator, collapsed mobile navigation, dashed footer separation and CRT detail.
- `components/ui/button.tsx`, `input.tsx` and `shimmer-card.tsx`: control anatomy and bounded pointer highlights.
- `components/ui/project-list-item.tsx` and `project-image-carousel.tsx`: typographic rows, fine borders, sharp media, thumbnail selection and full-size inspection.
- `app/ai/AIContent.tsx` and `app/message/MessageContent.tsx`: labeled composers, structured messages, reply/feedback states and compact surfaces. Only visual anatomy informs the showcase; service behavior and application data are excluded.

The portfolio’s root radius variable is rounded, but the actual structural components explicitly use square geometry. This contract follows those component usages and the redesign brief. Its body defaults and supporting chart colors also contain incidental choices; the showcase normalizes those into the roles below. Browser comparison with the portfolio is still a host QA gate.

## 2. Color Palette & Roles

### Primary Foundation

| Role | Light | Dark | Purpose |
| --- | --- | --- | --- |
| Parchment / near-black canvas | #f5f4ed | #141413 | Page background |
| Near-black / ivory ink | #141413 | #faf9f5 | Primary text |
| Ivory / warm charcoal | #faf9f5 | #30302e | Card and overlay surface |
| Warm sand / charcoal | #e8e6dc | #30302e | Secondary, muted and input surfaces |
| Secondary ink | #4d4c48 | #faf9f5 | Secondary controls |
| Quiet ink | #5e5d59 | #b0aea5 | Supporting text |
| Cream / charcoal border | #f0eee6 | #30302e | Subtle surface grouping |
| Warm focus role | #d1cfc5 | #b0aea5 | Source ring token |
| Warm accent surface | #e8e6dc | #3d3d3a | Hover and active backgrounds |

Card and popover foregrounds follow the primary ink role. Primary actions invert foreground and background: near-black on light pages, ivory on dark pages. Dark secondary, muted, border and input roles all use warm charcoal.

### Accent & Interactive

| Step | Descriptive name | Hex | Intended role |
| --- | --- | --- | --- |
| 50 | Blushed ivory | #faf5f2 | Very light accent surface |
| 200 | Pale clay | #e9c6b9 | Soft accent, selection |
| 400 | Coral clay | #d97757 | Dark-mode emphasis |
| 500 | Terracotta | #c96442 | Brand marker and media accent |
| 600 | Fired clay | #be5c3a | Accent state |
| 700 | Deep terracotta | #b55333 | Chart and strong accent |
| 800 | Rust ink | #964225 | Light-mode small accent text and focus |
| 950 | Earthen black | #3f1b10 | Ink on pale clay |

### Typography & Text Hierarchy

Primary text uses the ink role; descriptions use quiet ink. Brand 400/500 are unsuitable as ordinary small text on the light canvas. Use rust ink there; pale clay provides small-text emphasis on dark cards; coral clay remains suitable for large headings and graphic accents. A readable control boundary uses an additional semantic token, #85837a in both appearances. Panel boundaries use #d1cfc5 / #52514c. These are explicit showcase accessibility adaptations; the exact source border and ring roles remain intact.

### Functional States

Error crimson (#b53333) marks destructive actions with ivory text. Status meaning always includes words or an icon. Success does not require a foreign green palette. Charts use terracotta, ink, quiet ink and pale clay, with readable labels and exact data alternatives. Browser contrast checks remain required in both appearances, including disabled controls and open portals.

## 3. Typography Rules

### Hierarchy & Weights

Lexend Deca is the geometric display and heading face; Inclusive Sans is the open, humanist body and control face. Both are self-hosted with OFL notices and `font-display: swap`. System monospace appears only where code or technical metadata benefits from alignment.

| Use | Size | Weight | Line height | Tracking |
| --- | --- | --- | --- | --- |
| Hero | 44–72px | 500 | 1.12 | -0.06em |
| Page title | 40–72px | 500 | 1.12 | -0.06em |
| Section | 28–40px | 500 | 1.25 | -0.04em |
| Component | 20–24px | 500 | 1.3 | -0.04em |
| Body | 16px | 400 | 1.6–1.8 | Normal |
| Control / supporting copy | 12–14px | 400–500 | 1.4–1.7 | Normal |
| Eyebrow | 10–12px | 500 | 1.5 | 0.15em |

The portfolio configures 400-weight fonts while some components request heavier headings. This showcase deliberately normalizes the display weight to 500. Compact illustrative hero metadata may be smaller; form controls and reading text must remain usable on narrow viewports.

### Spacing Principles

Tightly tracked headings contrast with calm body copy. Limit line length, balance headings and let paragraphs wrap naturally. Use tabular numerals in metrics and data. Avoid decorative serif faces and extra font families.

## 4. Component Stylings

### Buttons

Square, at least 44px tall in the showcase, with a strong primary fill or readable outlined secondary treatment. Use explicit hover borders and a two-pixel focus outline with four-pixel offset. Loading prevents duplicate actions and reports progress; disabled state remains visibly distinct.

### Cards & Bento Containers

Ivory or warm charcoal, zero radius, one-pixel boundaries, 24–32px padding, no ordinary shadow. A larger tile earns its span through content. A pointer spotlight is confined to its surface and adds no tilt. Focus offers an equivalent boundary cue. No glass or perspective chrome.

### Navigation

A sticky header contains the wordmark and a small terracotta dot. Text links are compact and calm, with an active underline. Mobile navigation is an explicit, touch-operable disclosure. Category and section indexes wrap naturally. Never hide required actions behind hover.

### Inputs & Forms

Labels sit above square fields with useful hints. Match the heights of adjacent controls. Invalid fields expose both visible errors and programmatic associations; submit focuses the field needing attention. Radio and switch geometry stays functional. No example sends a request.

### Media, Messages & Overlays

Sharp media frames retain aspect ratio; thumbnails and next/previous controls work without hover. Full-size views use titled, dismissible dialogs. Conversations have a speaker label and structured text; replies use an indented accent rule. Overlays inherit the global theme tokens and may use a restrained detached shadow.

## 5. Layout Principles

### Grid & Structure

A 1280px content container echoes the portfolio’s `max-w-7xl` layout. The hero pairs editorial copy with an actual interface composition. Catalog indexes use three columns, specimen pages two, and complex application patterns span the full grid. The desktop homepage bento gives Actions a wider opening tile.

### Whitespace Strategy

Use a four-pixel base and the scale 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96. Section spacing grows to 112–128px where the homepage needs a pause. Page gutters are 48px on broad screens, 32px on smaller desktops and 20px on phones.

### Alignment & Visual Balance

Left-align the reading axis. Let compact controls balance display type without becoming floating ornaments. Accent fills occupy small areas. Use short rules, lines and type hierarchy to establish order.

### Responsive Behavior & Touch

The inspected portfolio uses familiar 768px and 1024px composition changes. This showcase adapts at 1100px, 800px and 520px for its denser header and specimens. At 800px the hero stacks and navigation collapses. At 520px catalogs become a single column and stats become two columns. Test immediately above and below these boundaries as well as phone/tablet/desktop sizes. Required touch controls target 44px; tables may scroll within their own frame.

## 6. Design System Notes for Stitch Generation

### Language to Use

Warm editorial utility, parchment and ivory, geometric sans headings, sharp borders, asymmetrical bento, restrained terracotta emphasis, generous reading space.

### Color References

Start with parchment #f5f4ed, ink #141413 and ivory #faf9f5. Add terracotta #c96442 sparingly. Use rust #964225 for small accent text in light mode. Dark surfaces are warm charcoal #30302e.

### Component Prompts

- Compose a large left-aligned heading beside a sharp, working collection interface with one labeled input, a button, a short table and a metric. Give it quiet one-pixel divisions and warm neutral surfaces.
- Arrange an editorial profile, reading metric and project preview into an asymmetric bento. Use square geometry and let typography establish emphasis.
- Build a calm settings form with visible labels, square controls, a strong focus outline and concise local-save feedback.

### Incremental Iteration

Check geometry and typographic hierarchy before adding accent. Compare components across light/dark and narrow/wide layouts. Motion should explain a state change: 150–300ms feedback, 400–700ms reveal, easing [0.25, 0.46, 0.45, 0.94], low travel and no autoplay loop. Reduced motion removes travel; content is readable before animation or hydration. No scroll hijacking.

## Known Gaps & Acceptance

The static showcase is implemented locally. Catalog maturity remains `beta`: browser keyboard, focus return, responsive rendering, contrast, reduced motion, hydration errors, screenshots and owner visual approval are pending host QA. Backend source was unavailable; no API or source-retrieval contract is inferred. The current scoped GitHub/Netlify release follows the user-authorized parent QA workflow. Indexing and component distribution remain separately scoped.
