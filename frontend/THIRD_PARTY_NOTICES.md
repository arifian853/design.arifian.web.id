# Third-party notices

## shadcn/ui and Base UI

The locally owned UI primitives retain shadcn/ui provenance and use the existing Base UI foundation. Their final appearance is customized through semantic Terracotta tokens, sharp geometry, typography, readable boundaries, and focus states. Existing local components were inspected rather than installed again; no registry item or dependency was added for this update. New primitives are locally authored compositions against the installed Base UI 1.9.0 APIs and public documentation.

The shadcn CLI is pinned to 4.22.1 and Base UI to 1.9.0 in the existing project. Package license files were inspected locally. Both are MIT licensed.

- shadcn/ui: https://github.com/shadcn-ui/ui
- shadcn license: https://github.com/shadcn-ui/ui/blob/main/LICENSE.md
- Base UI: https://github.com/mui/base-ui

MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Other retained dependencies

The installed packages retain their respective distributed license notices. This list describes dependencies available to the frontend; a package being installed does not imply every route bundles it.

| Package | Reviewed license | Role |
| --- | --- | --- |
| React / React DOM | MIT | Interactive specimens |
| Motion 14.6.0 | MIT | Bounded transitions and reduced-motion behavior |
| Tailwind CSS 4.3.3 | MIT | Semantic styling |
| Lucide React | ISC | Interface icons |
| class-variance-authority 0.7.1 | Apache-2.0 | Primitive variants |
| cn 0.5.0 | MIT | Class composition |

## Fonts

The frontend self-hosts Latin WOFF2 subsets of Inclusive Sans and Lexend Deca. Both are licensed under SIL Open Font License 1.1. Complete notices accompany the fonts:

- [Inclusive Sans notice](public/fonts/OFL-Inclusive-Sans.txt): copyright 2022 The Inclusive Sans Project Authors. Source: https://github.com/google/fonts/tree/main/ofl/inclusivesans.
- [Lexend Deca notice](public/fonts/OFL-Lexend-Deca.txt): copyright 2018 The Lexend Project Authors. Source: https://github.com/google/fonts/tree/main/ofl/lexenddeca.

## Portfolio reference and original specimens

The portfolio’s actual frontend supplies the visual reference for palette, type, sharp surfaces, bento composition, navigation, and restrained interactions. This showcase uses independently authored synthetic content and removes portfolio-specific network behavior, personal records, and service configuration.

`portfolio-derived` identifies owner-authored normalization of inspected portfolio behavior. The inspected portfolio repository declares no upstream license file; its code is not assigned MIT by this catalog. All specimen content is independently authored and synthetic. `arifian-original` identifies new local families. `shadcn-adapted` identifies reviewed primitive compositions; the retained MIT foundation does not automatically license unrelated authored work. `external-inspired` records a public interaction reference, with an original implementation and source-specific terms.

## Excluded supplier source

No React Bits component source is retained in the redesigned frontend. The prior copied animation files have been replaced with small, independently authored Motion wrappers. Their license restricts component-library redistribution, so a notice is not treated as permission to repackage them. New motion specimens are authored against Motion and platform APIs.

No premium component source, public registry distribution, or source-download interface is part of this showcase. Any future supplier addition requires its own source, license, dependency, accessibility, and normalization review.

## Curated interaction references — 26 October 2026

No component code or Pro source was copied from these references. They inform interaction vocabulary only; implementations use existing Motion, Base UI, Lucide and platform APIs. Catalog license notes distinguish the original implementation from the reference's terms.

| Reference | Reviewed terms | Used for |
| --- | --- | --- |
| [React Bits license](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md) | MIT + Commons Clause License Condition v1.0, copyright 2026 David Haz | Chroma grid, restrained blur/split reveal and short typing ideas |
| [Magic UI license](https://github.com/magicuidesign/magicui/blob/main/LICENSE.md) | MIT, copyright Magic UI | Scripted terminal, local reading progress, pausable marquee and code comparison ideas |
| [Kibo UI license](https://github.com/shadcnblocks/kibo/blob/main/license.md) | MIT terms, copyright 2023–present shadcnblocks | Local dropzone and removable tags behavior |

React Bits permits use within applications, websites and products under its notice conditions, but restricts selling, sublicensing or redistributing its components, including bundled or ported versions. Its tools/exports have additional restrictions in the same license. This app-code repository does not redistribute React Bits component source, ports, tools or Pro code as a kit. Treat a notice as attribution, not a substitute for permission.

The [Animate UI primitives catalog](https://animate-ui.com/docs/primitives) was reviewed as a motion reference; no Animate UI source, package, code adaptation or license claim is included. Existing canonical primitives receive short transitions rather than separate animated catalog entries. No Cult UI or Pro code is included.

## Dependency cleanup

Import and build-script inspection found no active consumers for the retired profile/private-preview/export path, placeholder cinematic/workbench files, legacy styles, or unused chart/command/OTP/toast wrappers. Their unused direct packages were removed: GSAP and its React adapter, Material Color Utilities, next-themes, Zod, Sonner, cmdk, input-otp and Recharts. Native SVG charts retain exact data alternatives. Transitive tools may still use their own copies of a removed direct dependency. Retained dependency versions were not upgraded.
