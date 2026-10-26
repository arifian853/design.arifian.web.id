# Motion, Layout, Icons, and Accessible Data Visualization

**Research snapshot:** 24 October 2026. This is a source-backed review rubric for the workbench and specimens, not a claim that the application has passed browser QA.

## Responsive composition

Material 3 treats breakpoints as moments when the composition should change to fit the available window; layouts may use one to three panes, with navigation and content adapting as space permits. The breakpoints describe available window width rather than device labels.[34][35]

**Apply to this project:**

- Do not simply shrink the desktop workbench. At compact widths, move document/profile switching into a reachable top or bottom control, turn inspectors into a drawer/section, and keep the active specimen as the primary reading surface.
- At medium widths, collapse secondary panels before compressing specimen content. At expanded/large widths, use the workspace panes that the selected design grammar calls for.
- Preserve each design's own composition while adapting it: a layout may reflow, but must not become a generic one-card grid. Test viewport widths just around actual layout changes.
- Use grouping, alignment, type scale, and whitespace to communicate hierarchy. Components and borders should encode relationships rather than decorate every box.

## Icons and action labels

Lucide marks its icons decorative to screen readers by default; interactive icons need an accessible name. Its guidance prefers visible text labels, reserving icon-only controls for familiar, space-constrained actions and pairing the icon with a clear label when meaning may be ambiguous.[14][37]

**Apply to this project:**

- Use one icon family per specimen and consistent optical size/stroke; select icons by meaning, not ornament.
- Keep visible labels on navigation and high-value actions. A standalone icon button needs an accessible name, a visible focus indicator, a usable target, and a tooltip only as supplemental help.
- Do not use color or an icon alone to express selected, error, or status state; pair with shape, text, or another visual cue.[38]

## Motion and reduced motion

Motion for React distinguishes scroll-triggered effects (`whileInView`) from scroll-linked effects driven by scroll position (`useScroll`), suitable for progress or restrained parallax. The documented implementation can use browser ScrollTimeline when supported and IntersectionObserver for triggers.[11][12] Motion's accessibility guidance recommends adapting or disabling effects under the OS reduced-motion preference; specifically replace large transform motion with less spatially intense alternatives and disable parallax.[13]

**Apply to this project:**

- Use motion to explain state change or focus, not to animate every card on entry.
- Cinematic scroll-linked work is an opt-in specimen, never a scroll hijack. Use bounded transform/opacity, honor `prefers-reduced-motion`, and provide a static equivalent that preserves content and hierarchy.
- Avoid continuous shader, cursor, or background animation by default. Include pause/disable controls for persistent ambient animation, and test touch, keyboard, low-power devices, resize, and dynamic content.
- A reduced-motion test must verify the actual animation is removed/replaced, not only that an accessibility toggle changes its label.

## Charts and data display

WAI notes that color should not be the only way information is distinguished. Provide accessible names/descriptions and non-color encodings where practical; include a readable data/table alternative for charts so the values are available outside a visual mark.[38] WCAG 2.2 explains that interaction-triggered motion should be disableable when it is not essential; this is Level AAA, and remains a strong design safeguard for the cinematic demos.[40]

**Chart review checklist:**

- Title plus one-sentence purpose; explicit units and time window; honest scale and baseline.
- Legend/series distinguishable by label, marker, line style, or pattern—not only hue.
- Keyboard/screen-reader path and concise accessible description; a tabular or downloadable data alternative.
- Loading, empty, error, and small-screen states; no tooltip required to discover the only copy of a value.
- Preserve source content and chart provenance; do not invent summaries or derived data.

## Product-specific acceptance tests

1. Selecting another design changes computed type, shape/radius, border/surface, density, motion, and at least one layout/composition rule—not only color.
2. Mobile layouts preserve reading order, access to the selector, and keyboard-operable controls; no horizontal overflow.
3. Icon-only functional buttons are labelled; decorative icons are hidden from assistive technology; focus remains visible.
4. System reduced-motion preference removes parallax/large spatial motion, while all content and controls remain available.
5. Color is not the sole state cue, and chart information has a non-visual route.
6. Automated checks are followed by rendered browser screenshots at desktop and narrow mobile; the rubric itself is not evidence that checks passed.

## Sources

[11] https://motion.dev/docs/react-scroll-animations — motion.dev
[12] https://motion.dev/docs/react-use-scroll — motion.dev
[13] https://motion.dev/docs/react-accessibility — motion.dev
[14] https://lucide.dev/how-to/accessibility — lucide.dev
[34] https://m3.material.io/foundations/layout/understanding-layout/overview — Material 3 layout overview
[35] https://m3.material.io/foundations/layout/breakpoints — Material 3 breakpoints
[37] https://lucide.dev/how-to/icon-guide — Lucide icon guide
[38] https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html — WCAG use of color
[40] https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html — WCAG animation from interactions
