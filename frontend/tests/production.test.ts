import { expect, test } from 'bun:test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { catalog, catalogCounts, categories } from '../src/lib/catalog';

// Artifact checks: build first; never silently skip an absent build.
const routes = ['/', '/foundations/', '/components/', ...categories.map(c => `/components/${c.slug}/`), '/originals/', '/motion/', '/patterns/', '/about/'];
test('every showcase route is generated, readable and noindex', () => {
  for (const route of routes) {
    const html = readFileSync(`dist${route}index.html`, 'utf8');
    expect(html).toContain('<h1');
    expect(html).toContain('noindex, nofollow');
    expect(html).toContain('data-site-header');
    expect(html).toContain('Arifian Design System');
  }
  const home = readFileSync('dist/index.html', 'utf8');
  expect(home).toContain('data-hero-specimen');
  for (const [kind, count] of Object.entries(catalogCounts)) {
    expect(home).toContain(`data-stat="${kind}" data-count="${count}"`);
  }
  expect(existsSync('dist/design-specimens.json')).toBe(false);
});

test('retired routes generate static redirects to canonical destinations', () => {
  for (const [from, to] of [
    ['/workbench/', '/components/'],
    ['/components/data-display/', '/components/data/'],
    ['/components/layout/', '/components/surfaces/'],
  ]) {
    const html = readFileSync(`dist${from}index.html`, 'utf8');
    expect(html).toMatch(/http-equiv="refresh"/i);
    expect(html).toContain(`url=${to}`);
    expect(html).toContain(`href="${to}"`);
    expect(html).not.toContain('data-site-header');
    expect(existsSync(`dist${to}index.html`)).toBe(true);
  }
});

test('generated navigation, anchors and local assets resolve inside the static artifact', () => {
  const htmlFiles: string[] = [];
  function collect(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) collect(path);
      else if (entry.name.endsWith('.html')) htmlFiles.push(path);
    }
  }
  collect('dist');
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    const route = file.slice(4).replace(/index\.html$/, '');
    for (const [, href] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const url = new URL(href, `https://showcase.invalid${route}`);
      if (url.origin !== 'https://showcase.invalid') continue;
      const path = `dist${url.pathname.endsWith('/') ? `${url.pathname}index.html` : url.pathname}`;
      expect(existsSync(path), `${file}: local link or asset ${href} must resolve`).toBe(true);
      if (url.hash && path.endsWith('.html')) expect(readFileSync(path, 'utf8').includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${file}: linked anchor must exist`).toBe(true);
    }
  }
});

test('every counted specimen is rendered on its linked destination', () => {
  for (const entry of catalog) {
    const route = entry.kind === 'component' ? `/components/${entry.category}/` : entry.kind === 'motion' ? '/motion/' : '/patterns/';
    const html = readFileSync(`dist${route}index.html`, 'utf8');
    expect(html).toContain(`id="${entry.slug}"`);
    expect(html).toContain(`data-specimen="${entry.slug}"`);
    expect(html).toContain(entry.name.replaceAll('&', '&amp;'));
  }
});

test('legacy destinations are redirect artifacts backed by Netlify permanent redirects', () => {
  for (const [from,to] of [['workbench','/components/'],['components/data-display','/components/data/'],['components/layout','/components/surfaces/']]) {
    const html=readFileSync(`dist/${from}/index.html`,'utf8');
    expect(html).toContain('http-equiv="refresh"');expect(html).toContain(to);
  }
  const config=readFileSync('../netlify.toml','utf8');
  expect(config).toContain('from = "/workbench/"');expect(config).toContain('status = 301');
  expect(config).toContain('X-Robots-Tag = "noindex, nofollow, noarchive"');
});
