# Cinematic direction for the design.arifian.web.id homepage

**Retrieved 2026-10-24.** This note records the research, revised art direction, and local implementation. The page is not deployed.

## Why the first result missed

The first preview was a useful token-switching test, but its top-level composition was a conventional workbench: controls, intro copy, and three content panels. That made the page read as a dashboard/editorial demo, not as a designed entrance into a visual archive. The missing work was art direction and narrative sequencing—not another palette pass.

## Research distilled

- Motion distinguishes scroll-triggered reveals from scroll-linked motion; the latter can communicate progress or guide interactive storytelling. Its React API can use native ScrollTimeline when available, with observer-backed triggers.[1]
- Motion recommends replacing large spatial movement with less spatially intense changes for people who request reduced motion; its `reducedMotion="user"` path disables transform/layout motion while preserving suitable values such as opacity.[2]
- W3C explains that non-essential motion initiated by interaction should be disableable; scroll-linked parallax is specifically named as a possible vestibular trigger.[3]
- Chrome's NRK case study shows a stronger storytelling reason for motion: it can mark narrative beats, clarify emphasis, create pauses, and make information easier to follow. NRK also keeps all story content available under reduced motion and uses fallback behavior when newer scroll APIs are unavailable.[4]
- Chrome's performance case study explains why scroll-event JavaScript can become janky and why declarative scroll-driven timelines may avoid main-thread work where supported.[5]
- WebKit breaks a scroll-driven effect into target, keyframes, and timeline, recommends a restrained animation range so large content settles and remains readable, and advises a reduced-motion alternative for larger field-of-view effects.[6]
- Awwwards' inspected references demonstrate multiple cinematic patterns—not a template to copy: an episodic scroll narrative with particles/cursor moments (Atmospherik) and video-led film-production stories (Working Stiff Films).[7][8]
- Separate gallery entries show full-screen/sticky case-study panels (MANET and Noxediem).[9][10] These award-gallery descriptions are inspiration evidence, not independent accessibility or performance audits.

## Art direction and implemented composition

**Primary surface: Explore. Secondary surface: Decide/Learn.** The homepage opens like a small screening room for design systems, then turns into a readable atlas. It does not lead with a stats dashboard or a three-equal-card feature grid.

1. **Opening frame:** a near-full viewport, cinematic typographic statement, clear scroll cue, and original abstract “proof sheet” stage. It is assembled from CSS typography, grid fragments, crop marks and layered planes; no stock imagery, private source values, copied React Bits, or external media/font dependencies.
2. **Scroll chapter:** the proof-sheet planes assemble into one coherent specimen as the reader scrolls. One transform-only sequence, a small persistent progress signal, and a bounded sticky interval. Explanatory copy stays outside the moving plane so it remains stable and readable.
3. **Archive threshold:** a clear transition into the live specimen/workbench. Once a source profile is selected, that preview owns its own palette, typography, shape, spacing and composition; the cinematic entrance does not flatten or blend the source-specific design grammar.
4. **Privacy state:** the production build contains no private profile data and remains locked until an authorized access boundary exists. Local development may show only the two already-approved local preview profiles through the existing loopback-only, opt-in adapter.

## Motion and accessibility contract

- Original Motion-for-React effects only; no React Bits source or export reuse.
- Scroll is never hijacked. Content and navigation work without animation; all moving transforms settle, remain interruptible, and have a manual motion-off control.
- `prefers-reduced-motion` turns off parallax/large transforms and sticky motion, retaining a static composed scene and every piece of content. Provide a visible setting for users to disable the cinematic motion even when their OS preference allows it.
- Prefer transform/opacity and short, bounded ranges; avoid continuous loops, forced smooth scrolling, large blur/filter animation, and animation that continues while a section is not meaningfully visible.
- Validate keyboard/skip navigation, screen-reader order, 390px mobile, 1440px desktop, reduced motion, overflow, focus and browser console. Test the production artifact separately for absence of private data and preview endpoint code.

## Acceptance for the redesign

1. The opening screen reads as an art-directed, cinematic design archive—not as a dashboard after recoloring.
2. A single scroll-driven visual tells one understandable “layers become a system” story and does not obscure reading.
3. The transition reaches the existing workbench and preserves the selected specimen's complete profile.
4. Static/reduced-motion mode retains the same hierarchy and information; keyboard-only navigation can reach all controls.
5. Desktop and mobile layouts have intentional distinct choreography without horizontal overflow.
6. Public production output contains no private profiles, source tokens, document copy, or local-preview endpoint.

## Local implementation and verification — 2026-10-24

- Built the cinematic entry in `frontend/src/components/CinematicHome.tsx`, with original CSS-only proof-sheet planes, oversized editorial type, one bounded sticky scroll chapter, and a scroll progress line. No private source values, external imagery/fonts, or React Bits code are used.
- Kept the local specimen/workbench below the entry as a separate visual surface; production retains its private-library lock state.
- Added manual motion control, an SSR-safe system reduced-motion subscription, static fallback, keyboard-visible focus, and bounded transform motion. Scroll is not hijacked and no animation runs continuously.
- Verified: TypeScript passes; static Astro build passes; 6 unit tests / 81 assertions pass; 9 browser tests pass at 1440px and 390px; axe WCAG 2.0/2.1/2.2 A/AA pass on the cinematic homepage. Tests cover the browser console/hydration in both normal and reduced-motion contexts.
- Production output scan passes: no local-preview endpoint, normalized private profile, or private source path marker. No deployment or DNS change was made.
- Local screenshots are owner-only QA artifacts; they are excluded from the source repository and production build.

## Sources

[1] https://motion.dev/docs/react-scroll-animations — Motion React scroll animations
[2] https://motion.dev/docs/react-accessibility — Motion accessibility and reduced motion
[3] https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html — W3C WCAG 2.3.3 animation from interactions
[4] https://developer.chrome.com/blog/nrk-casestudy — Chrome for Developers: NRK scroll storytelling case study
[5] https://developer.chrome.com/blog/scroll-animation-performance-case-study — Chrome for Developers: scroll animation performance case study
[6] https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css — WebKit: CSS scroll-driven animations guide
[7] https://www.awwwards.com/sites/atmospherik — Awwwards: Atmospherik
[8] https://www.awwwards.com/sites/working-stiff-films — Awwwards: Working Stiff Films
[9] https://www.awwwards.com/inspiration/scroll-driven-case-study-system-with-cinematic-panels-manet-1 — Awwwards: MANET cinematic scroll panels
[10] https://www.awwwards.com/inspiration/fullscreen-case-studies-sticky-scroll-animation-noxediem-creative-production — Awwwards: Noxediem sticky-scroll case studies
