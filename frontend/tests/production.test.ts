import { expect, test } from 'bun:test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const built = existsSync('dist/index.html');
test.skipIf(!built)('static output keeps the design library private and excludes synthetic substitute profiles', () => {
  const html = readFileSync('dist/index.html','utf8');
  expect(html.includes('Collection locked')).toBe(false);
  expect(html.includes('/specimens.json')).toBe(false);
  expect(existsSync('dist/specimens.json')).toBe(false);
  const bundles = readdirSync('dist/_astro').filter((name: string) => name.endsWith('.js')).map((name: string) => readFileSync(join('dist/_astro',name),'utf8')).join('');
  expect(bundles.includes('Paper Current')).toBe(false);
  expect(bundles.includes('Studio Ember')).toBe(false);
  expect(bundles.includes('Public workbench demo')).toBe(false);
  expect(html.includes('/__local/specimens')).toBe(false);
  expect(html.includes('See the design<br/>before you build it.')).toBe(true);
  expect(html.includes('noindex, nofollow')).toBe(true);
  expect(html.includes('astro-island')).toBe(true);
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
