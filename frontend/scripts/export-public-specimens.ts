import { chmod, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseProfiles, type DesignProfile } from '../src/lib/profile';

const sourcePath = fileURLToPath(new URL('../../private/normalized/specimens.json', import.meta.url));
const outputPath = resolve('dist/design-specimens.json');
const approved = [
  { sourceLabel: 'Rosewood / Subtle', key: 'rosewood-subtle', label: 'Rosewood / Subtle' },
  { sourceLabel: 'Terracotta', key: 'terracotta', label: 'Terracotta' },
] as const;

export async function createPublicSpecimens(source: unknown): Promise<DesignProfile[]> {
  const profiles = parseProfiles(source);
  return approved.map(({ sourceLabel, key, label }) => {
    const profile = profiles.find(item => item.label === sourceLabel);
    if (!profile) throw new Error('Approved specimen unavailable');
    return { ...profile, key, label };
  });
}

const sourceStat = await stat(sourcePath);
if ((sourceStat.mode & 0o777) !== 0o600 || sourceStat.size > 50_000) {
  throw new Error('Private specimen source permissions or size are invalid');
}
const data = JSON.parse(await readFile(sourcePath, 'utf8')) as unknown;
const publicProfiles = await createPublicSpecimens(data);
await mkdir(resolve('dist'), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(publicProfiles, null, 2)}\n`, { mode: 0o644 });
await chmod(outputPath, 0o644);
console.log(`Exported ${publicProfiles.length} explicitly approved specimen profiles to dist.`);
