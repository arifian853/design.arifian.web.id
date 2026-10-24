# Local specimen workbench

Astro 7.4.2, React, Tailwind 4.3.3 and Bun. Dependencies and the shadcn CLI are pinned in package.json and bun.lock.

Use Node 22.23.4 for Astro; Bun manages packages:

```sh
export PATH=/home/arifian/.local/opt/node-v22.23.4/bin:$PATH
bun install --frozen-lockfile
bun test tests
bun run typecheck
bun run build
```

The production build displays a locked collection. It contains no design profiles and provides no document API. Local preview needs an existing, separately authorized normalized specimen file under ignored `private/`, with mode `0600`.

```sh
DESIGN_PRIVATE_PREVIEW=1 bun run dev -- --background --host 127.0.0.1
bun run astro -- dev status
bun run astro -- dev stop
```

The loader runs only in development with explicit opt-in, an exact loopback bind and same-origin read-only requests. It serves two schema-validated profiles from one fixed file, never Markdown or caller-supplied paths. The Vite filesystem boundary denies private files. No preview data is cached or persisted.

The workbench changes composition, fonts, scale, corners, borders, elevation, spacing and motion in a single selection update. Sample content stays the same. Source fonts use installed fonts and system fallbacks; the specimen does not download fonts.

Browser checks require a local Chromium installation. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if Playwright's default browser is unavailable. With the preview running:

```sh
SPECIMEN_BASE_URL=http://127.0.0.1:4321 bun run test:browser
```

Browser screenshots and failure artifacts stay under ignored `private/qa/`. Tests cover desktop/mobile, computed non-color styles, keyboard selection/focus, reduced motion, axe contrast/accessibility and the local request boundary. Test fixtures are invented independently of private documents.

The shadcn 4.22.1 CLI accepts the baseline as `--base base --preset nova` and resolves it to `base-nova`. Only Button and Input were generated; their styling was replaced with dynamic semantic variables. See THIRD_PARTY_NOTICES.md for review and license details. Catalog expansion and release remain separate work.
