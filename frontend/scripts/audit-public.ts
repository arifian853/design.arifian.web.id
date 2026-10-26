import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Fixed public roots only. This audit never opens a private corpus for comparison.
const frontend = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rules: [string, RegExp][] = [
  ['private retrieval', /\/__local\/specimens|be-design\.arifian\.web\.id|\/api\/|ELARA[_/.-]/i],
  ['private material', /private[\\/](?:design-docs|normalized|qa)|normalized[\\/]specimens|sourceText|bookshelf|DESIGN_PRIVATE_PREVIEW/i],
  ['profile payload', /design-specimens\.json|rosewood|material\s*3|sky\s*night|forest\s*subtle|profile family/i],
  ['credential', /(?:sk-(?:proj-)?[a-z\d_-]{16,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:api[_-]?key|access[_-]?token)\s*[:=]\s*["'][a-z\d_-]{16,})/i],
];
export function inspectPublicText(text: string): string[] {
  return rules.filter(([, pattern]) => pattern.test(text)).map(([reason]) => reason);
}
const textExtensions = new Set(['.html','.js','.mjs','.css','.json','.svg','.txt','.xml','.webmanifest']);
export function auditPublic(): number {
  let count = 0;
  function scan(directory: string) {
    if (!existsSync(directory)) throw new Error('Required public build root is missing');
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (lstatSync(path).isSymbolicLink()) throw new Error('Public tree contains a symbolic link');
      if (entry.isDirectory()) { scan(path); continue; }
      if (/\.map$|specimens.*\.json$|^\.env|Implementation(?:Plan|Status)|ProjectTimeline/i.test(entry.name)) throw new Error('Forbidden public artifact');
      if (!textExtensions.has(extname(entry.name))) continue;
      const issues = inspectPublicText(readFileSync(path, 'utf8'));
      if (issues.length) throw new Error(`Public artifact audit failed: ${issues.join(', ')}`);
      count++;
    }
  }
  scan(join(frontend, 'public'));
  scan(join(frontend, 'dist'));
  return count;
}
if (import.meta.main) console.log(`Public artifact audit passed (${auditPublic()} text files; fixed public roots only).`);
