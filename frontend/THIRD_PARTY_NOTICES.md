# Third-party notices

## shadcn/ui and Base UI

The locally owned UI primitives retain shadcn/ui provenance and use the existing Base UI foundation. Their final appearance is customized through semantic Terracotta tokens, sharp geometry, typography, readable boundaries, and focus states. Existing local components were inspected rather than installed again; no registry item or dependency was added for this redesign.

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
| Recharts 3.8.0 | MIT | Existing chart foundation |
| Zod 4.6.7 | MIT | Existing schema-validation dependency |

## Fonts

The frontend self-hosts Latin WOFF2 subsets of Inclusive Sans and Lexend Deca. Both are licensed under SIL Open Font License 1.1. Complete notices accompany the fonts:

- [Inclusive Sans notice](public/fonts/OFL-Inclusive-Sans.txt): copyright 2022 The Inclusive Sans Project Authors. Source: https://github.com/google/fonts/tree/main/ofl/inclusivesans.
- [Lexend Deca notice](public/fonts/OFL-Lexend-Deca.txt): copyright 2018 The Lexend Project Authors. Source: https://github.com/google/fonts/tree/main/ofl/lexenddeca.

## Portfolio reference and original specimens

The portfolio’s actual frontend supplies the visual reference for palette, type, sharp surfaces, bento composition, navigation, and restrained interactions. This showcase uses independently authored synthetic content and removes portfolio-specific network behavior, personal records, and service configuration.

“Arifian Original” identifies the system’s own design language. “Original composition” identifies authored specimen compositions. “shadcn / Base UI” identifies specimens composed from those primitives. These labels describe provenance, not the outcome of browser accessibility testing.

## Excluded supplier source

No React Bits component source is retained in the redesigned frontend. The prior copied animation files have been replaced with small, independently authored Motion wrappers. Their license restricts component-library redistribution, so a notice is not treated as permission to repackage them. New motion specimens are authored against Motion and platform APIs.

No premium component source, public registry distribution, or source-download interface is part of this showcase. Any future supplier addition requires its own source, license, dependency, accessibility, and normalization review.
