import { expect, test } from 'bun:test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const built = existsSync('dist/index.html');
test.skipIf(!built)('static output exposes only the authored public demo, never private specimen data', () => {
  const html = readFileSync('dist/index.html','utf8');
  expect(html.includes('Collection locked')).toBe(false);
  const workbenchBundle = readdirSync('dist/_astro').filter((name: string) => name.startsWith('Workbench.') && name.endsWith('.js')).map((name: string) => readFileSync(join('dist/_astro',name),'utf8')).join('');
  expect(workbenchBundle.includes('Public workbench demo')).toBe(true);
  expect(readFileSync('dist/index.html','utf8').includes('/specimens.json')).toBe(true);
  expect(existsSync('dist/specimens.json')).toBe(true);
  const publicProfiles = JSON.parse(readFileSync('dist/specimens.json','utf8'));
  expect(publicProfiles).toHaveLength(2);
  expect(publicProfiles.map((profile: {label: string}) => profile.label)).toEqual(['Paper Current','Studio Ember']);
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
