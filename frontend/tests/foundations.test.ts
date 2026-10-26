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

test('approved global visual tokens remain exact', () => {
  expect(block(":root")).toEqual({
  "--background": "#f5f4ed",
  "--foreground": "#141413",
  "--card": "#faf9f5",
  "--primary": "#141413",
  "--primary-foreground": "#faf9f5",
  "--secondary": "#e8e6dc",
  "--secondary-foreground": "#4d4c48",
  "--muted": "#e8e6dc",
  "--muted-foreground": "#5e5d59",
  "--accent": "#e8e6dc",
  "--destructive": "#b53333",
  "--destructive-foreground": "#faf9f5",
  "--border": "#f0eee6",
  "--input": "#e8e6dc",
  "--ring": "#d1cfc5",
  "--brand-50": "#faf5f2",
  "--brand-200": "#e9c6b9",
  "--brand-400": "#d97757",
  "--brand-500": "#c96442",
  "--brand-600": "#be5c3a",
  "--brand-700": "#b55333",
  "--brand-800": "#964225",
  "--brand-950": "#3f1b10",
  "--accent-text": "var(--brand-800)",
  "--focus": "var(--brand-800)",
  "--control-border": "#85837a",
  "--panel-border": "#d1cfc5",
  "--chart-1": "var(--brand-700)",
  "--chart-2": "var(--foreground)",
  "--chart-3": "var(--muted-foreground)",
  "--chart-4": "var(--brand-200)",
  "--chart-5": "var(--secondary)",
  "--font-body": "'Inclusive Sans'",
  "--font-heading": "'Lexend Deca'",
  "--radius": "0px",
  "--interaction": "200ms",
  "--reveal": "550ms",
  "--ease": "cubic-bezier(.25,.46,.45,.94)"
});
  expect(block("[data-theme=\"dark\"]")).toEqual({
  "--background": "#141413",
  "--foreground": "#faf9f5",
  "--card": "#30302e",
  "--primary": "#faf9f5",
  "--primary-foreground": "#141413",
  "--secondary": "#30302e",
  "--secondary-foreground": "#faf9f5",
  "--muted": "#30302e",
  "--muted-foreground": "#b0aea5",
  "--accent": "#3d3d3a",
  "--border": "#30302e",
  "--input": "#30302e",
  "--ring": "#b0aea5",
  "--accent-text": "var(--brand-200)",
  "--focus": "var(--brand-400)",
  "--control-border": "#85837a",
  "--panel-border": "#52514c"
});
});
