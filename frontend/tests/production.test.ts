import { expect, test } from 'bun:test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const built = existsSync('dist/index.html');
test.skipIf(!built)('public build exports only the explicitly approved live specimens', () => {
  const html = readFileSync('dist/index.html','utf8');
  const bundles = readdirSync('dist/_astro').filter((name: string) => name.endsWith('.js')).map((name: string) => readFileSync(join('dist/_astro',name),'utf8')).join('');
  const payloadPath = 'dist/design-specimens.json';
  expect(existsSync(payloadPath)).toBe(true);
  const profiles = JSON.parse(readFileSync(payloadPath,'utf8'));
  expect(profiles).toHaveLength(2);
  expect(profiles.map((profile: {label:string}) => profile.label)).toEqual(['Rosewood / Subtle','Terracotta']);
  expect(profiles.map((profile: {key:string}) => profile.key)).toEqual(['rosewood-subtle','terracotta']);
  const approvedKeys = ['colors','density','key','label','motion','recipe','shape','typography'];
  for (const profile of profiles) expect(Object.keys(profile).sort()).toEqual([...approvedKeys].sort());
  expect(html.includes('/design-specimens.json')).toBe(true);
  expect(bundles.includes('Private design profiles are not available from this public page')).toBe(false);
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
