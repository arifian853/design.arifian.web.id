# React Bits — Cinematic Reference Shortlist

**Retrieved:** 24 October 2026. This is an external-reference list, not source-code inspection, product endorsement, or accessibility/performance certification.

React Bits describes 217 free animated React components across five categories: Text Animations (33), Animations (38), Components (48), Micro (35), and Backgrounds (63).[7] Its install guide distributes source into an application, and its MCP setup registers the `@react-bits` registry with the shadcn MCP.[8][9]

## Shortlist for original experiments

| Reference | What it suggests | Fit for this product | Required adaptation / QA |
|---|---|---|---|
| [Scroll Expand](https://reactbits.dev/animations/scroll-expand) | A media frame expands with scroll | Optional editorial storytelling recipe | Build an original bounded `useScroll` effect; static/reduced-motion version; no scroll hijack |
| [Animated Content](https://reactbits.dev/animations/animated-content) | A reusable reveal wrapper and stagger | Direction-specific content reveal | Prefer one intentional reveal, not every section; respects reduced motion and dynamic content |
| [Fade Content](https://reactbits.dev/animations/fade-content) | A simpler scroll-triggered entrance | Low-risk fallback candidate | Content visible without animation; no blurring text during reading |
| [Glow Cursor](https://reactbits.dev/animations/glow-cursor) | Pointer-following light | Optional desktop-only material demo | Disable on touch/reduced-motion; avoid frame-heavy filters and keep contrast |
| [Soft Aurora](https://reactbits.dev/backgrounds/soft-aurora) | Animated shader background | Inspiration only for a carefully limited hero | Do not use as default shell; static poster fallback, low-motion mode, measured GPU/bundle cost |
| [Line Waves](https://reactbits.dev/backgrounds/line-waves) | Fine-line motion and drifting light | Could inform an original profile transition | Preserve readability; no continuous motion by default |
| [Radar](https://reactbits.dev/backgrounds/radar) | Sweep and contact marks | Could inform a functional status/data specimen | Only use if it communicates actual changing data; avoid decorative noise |

The references above are candidates discovered from public category pages, not code that was installed or tested.[41][42][43] The official page groups examples into broad families; the full registry list and exact source/dependency/licensing metadata still require per-item inspection before recommending any installation.

## License and distribution boundary

The current React Bits repository uses an MIT + Commons Clause license. The license permits use in an application, website, or product with its notices, but separately forbids selling, sublicensing, or redistributing the components themselves—alone, bundled, or ported. It also restricts redistribution of exported media as stand-alone products/packs.[10]

Because this project's source repository is public and the website itself curates reusable components, the implementation will **not copy, port, bundle, or publish React Bits source or exported assets** in the app or registry. React Bits can be linked as an external reference; cinematic components in this project should be original implementations based on the user's brief and Motion's public APIs. Any later licensed integration requires a separate license/redistribution review and approval.

“Premium custom” here means original, carefully tested work—not relabelling the free React Bits library or using its Pro registry without a valid license. No Pro code or assets were accessed.

## Sources

[7] https://reactbits.dev/get-started/introduction — reactbits.dev
[8] https://reactbits.dev/get-started/installation — reactbits.dev
[9] https://reactbits.dev/get-started/mcp — reactbits.dev
[10] https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md — github.com
[41] https://reactbits.dev/c/animations — React Bits animations catalog
[42] https://reactbits.dev/c/backgrounds — React Bits backgrounds catalog
[43] https://reactbits.dev/c/text-animations — React Bits text animations catalog
