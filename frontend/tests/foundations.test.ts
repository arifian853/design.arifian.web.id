import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const css = readFileSync('src/styles/global.css', 'utf8');
function block(selector: string) {
  const body = css.slice(css.indexOf(`${selector}{`) + selector.length + 1).split('}')[0];
  return Object.fromEntries([...body.matchAll(/(--[\w-]+):([^;]+);/g)].map(([, key, value]) => [key, value.trim()]));
}
function contrast(a: string, b: string) {
  const luminance = (hex: string) => {
    const channels = [1,3,5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255).map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
}
test('semantic text and control roles retain minimum contrast in both appearances', () => {
  for (const overrides of [{}, block('[data-theme="dark"]')]) {
    const tokens = { ...block(':root'), ...overrides };
    const resolve = (key: string): string => tokens[key].startsWith('var(') ? resolve(tokens[key].slice(4,-1)) : tokens[key];
    for (const surface of ['--background', '--card', '--secondary']) {
      for (const text of ['--foreground','--muted-foreground','--accent-text']) expect(contrast(resolve(text), resolve(surface))).toBeGreaterThanOrEqual(4.5);
      for (const edge of ['--focus','--control-border']) expect(contrast(resolve(edge), resolve(surface))).toBeGreaterThanOrEqual(3);
    }
    expect(contrast(resolve('--primary'), resolve('--primary-foreground'))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(resolve('--destructive'), resolve('--destructive-foreground'))).toBeGreaterThanOrEqual(4.5);
  }
});
