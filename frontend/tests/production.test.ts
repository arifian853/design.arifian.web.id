import { expect, test } from 'bun:test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const built = existsSync('dist/index.html');
test.skipIf(!built)('static output is locked and has no private loader or endpoint reference', () => {
  const html = readFileSync('dist/index.html','utf8');
  expect(html.includes('Collection locked')).toBe(true);
  expect(html.includes('noindex, nofollow')).toBe(true);
  expect(html.includes('astro-island')).toBe(false);
  function scan(dir: string): void {
    for (const entry of readdirSync(dir, {withFileTypes:true})) {
      const path = join(dir,entry.name);
      if (entry.isDirectory()) { scan(path); continue; }
      const text = readFileSync(path,'utf8');
      for (const forbidden of ['/__local/specimens','normalized/specimens.json','DESIGN_PRIVATE_PREVIEW','private/design-docs']) expect(text.includes(forbidden)).toBe(false);
      expect(path.endsWith('.map')).toBe(false);
    }
  }
  scan('dist');
});
