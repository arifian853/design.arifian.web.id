export function nextCarouselIndex(index: number, direction: number, length: number) {
  return length > 0 ? (index + direction + length) % length : 0;
}
export function fallbackPopoverPosition(anchor: { left: number; right: number; top: number; bottom: number }, viewportWidth: number, viewportHeight: number, desiredWidth: number, height: number) {
  const width = Math.min(desiredWidth, viewportWidth - 24);
  const left = Math.max(12, Math.min(viewportWidth - width - 12, (anchor.left + anchor.right - width) / 2));
  const below = anchor.bottom + 8;
  const top = Math.max(12, Math.min(viewportHeight - height - 12, below + height <= viewportHeight - 12 ? below : anchor.top - height - 8));
  return { left, top, width };
}
export function normalizeRange(start: string, end: string): [string, string] {
  return start <= end ? [start, end] : [end, start];
}
export function acceptLocalFiles(files: readonly { name: string; type: string; size: number }[]) {
  if (!files.length) return { names: [], error: 'Choose an image.' };
  if (files.length > 4) return { names: [], error: 'Choose up to four images.' };
  if (files.some(file => !['image/png','image/jpeg','image/webp'].includes(file.type))) return { names: [], error: 'Choose a PNG, JPEG or WebP image.' };
  if (files.some(file => file.size > 5_000_000)) return { names: [], error: 'Each image must be 5 MB or smaller.' };
  return { names: files.map(file => file.name), error: '' };
}
export function addTag(tags: readonly string[], candidate: string) {
  const tag = candidate.trim().slice(0, 32);
  return !tag || tags.some(item => item.toLocaleLowerCase() === tag.toLocaleLowerCase()) ? [...tags] : [...tags, tag];
}
