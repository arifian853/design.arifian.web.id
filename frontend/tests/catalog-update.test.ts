import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { catalog, categories, catalogCounts, originalCollection, searchCatalog, validateCatalog, readCatalogFilters, writeCatalogFilters } from '../src/lib/catalog';

test('eight canonical categories retain their approved order and unique identities', () => {
  expect(categories.map(({ slug, name }) => [slug, name])).toEqual([
    ['actions', 'Actions'], ['forms', 'Forms'], ['navigation', 'Navigation'],
    ['feedback', 'Feedback'], ['overlays', 'Overlays'], ['data', 'Data'],
    ['media', 'Media'], ['surfaces', 'Surfaces'],
  ]);
  expect(new Set(categories.map(category => category.slug)).size).toBe(8);
  expect(new Set(catalog.map(entry => entry.slug)).size).toBe(catalog.length);
  expect(new Set(catalog.map(entry => entry.family ?? entry.slug)).size).toBe(catalog.length);
});

test('related primitives retain distinct families while variants stay in their canonical family', () => {
  for (const group of [
    ['button', 'button-group', 'toggle-group', 'copy-button'],
    ['select', 'combobox', 'calendar', 'date-picker'],
    ['dialog', 'sheet', 'drawer', 'popover', 'project-popover'],
    ['accordion', 'collapsible'], ['timeline', 'experience-item'],
  ]) {
    const entries = group.map(slug => catalog.find(entry => entry.slug === slug)!);
    expect(entries.every(entry => entry?.kind === 'component')).toBe(true);
    expect(new Set(entries.map(entry => entry.family ?? entry.slug)).size).toBe(group.length);
  }
  for (const [slug, variant] of [['button', 'Loading'], ['chart', 'Donut'], ['reveal', 'Static'], ['combobox', 'Multiple'], ['date-picker', 'Range complete']]) {
    expect(catalog.filter(entry => (entry.family ?? entry.slug) === slug)).toHaveLength(1);
    expect(catalog.find(entry => entry.slug === slug)?.states).toContain(variant);
  }
});

test('kinds partition the inventory and Originals reuses entries across those kinds', () => {
  expect(catalogCounts.components + catalogCounts.patterns + catalogCounts.motion).toBe(catalog.length);
  expect(originalCollection).toEqual(catalog.filter(entry => ['portfolio-derived', 'arifian-original'].includes(entry.origin)));
  for (const entry of originalCollection) expect(catalog.includes(entry)).toBe(true);
  expect(new Set(originalCollection.map(entry => entry.kind))).toEqual(new Set(['component', 'pattern', 'motion']));
  // A second presentation or provenance label cannot create another family.
  expect(validateCatalog([catalog[0], { ...catalog[1], family: catalog[0].family, kind: 'motion', origin: 'portfolio-derived' }])).toBe(false);
  expect(validateCatalog([{ ...catalog[0], family: undefined }, { ...catalog[1], family: catalog[0].slug }])).toBe(false);
});

test('canonical families replace state and provenance duplicates', () => {
  for (const slug of ['loading-button','bar-chart','line-chart','donut-chart','stagger-reveal','spotlight-motion','message-board']) expect(catalog.some(e => e.slug === slug)).toBe(false);
  expect(catalog.find(e => e.slug === 'validation')?.kind).toBe('pattern');
  expect(catalog.find(e => e.slug === 'profile-bento')?.kind).toBe('pattern');
  expect(catalog.find(e => e.slug === 'chart')?.aliases).toContain('bar chart');
  expect(catalogCounts.originals).toBe(catalog.filter(e => ['portfolio-derived','arifian-original'].includes(e.origin)).length);
});

test('category, origin and alias search intersect independently', () => {
  const all = catalog.filter(e => e.kind === 'component');
  expect(searchCatalog('thumbnail', 'media', all, 'portfolio-derived').map(e => e.slug)).toContain('carousel');
  expect(searchCatalog('', 'forms', all, 'shadcn-adapted').every(e => e.category === 'forms' && e.origin === 'shadcn-adapted')).toBe(true);
  expect(searchCatalog('thumbnail', 'media', all, 'shadcn-adapted')).toEqual([]);
});

test('shareable query, category and origin filters round trip without losing their intersection', () => {
  const filters = { query: 'thumbnail', category: 'media', origin: 'portfolio-derived' };
  const url = writeCatalogFilters(new URL('https://example.test/components/?unrelated=kept#collection'), filters);
  expect(readCatalogFilters(url.search)).toEqual(filters);
  expect(url.searchParams.get('unrelated')).toBe('kept');
  expect(url.hash).toBe('#collection');
  expect(searchCatalog(filters.query, filters.category, catalog.filter(e => e.kind === 'component'), filters.origin).map(e => e.slug)).toEqual(['carousel']);
  expect(readCatalogFilters('?category=obsolete&origin=unknown&q=keyboard')).toEqual({ query: 'keyboard', category: 'all', origin: 'all' });
  const cleared = writeCatalogFilters(url, { query: '', category: 'all', origin: 'all' });
  expect([...cleared.searchParams]).toEqual([['unrelated', 'kept']]);
});

test('provenance validates maturity, canonical families, references and unknown fields', () => {
  expect(validateCatalog(catalog)).toBe(true);
  for (const changes of [{ origin:'unknown' }, { maturity:'published' }, { origin:'external-inspired', reference:undefined }, { reference:'javascript:alert(1)' }, { original:true }, { sourceFiles:['a.ts'] }]) expect(validateCatalog([{...catalog[0], ...changes}])).toBe(false);
  expect(validateCatalog([catalog[0], {...catalog[1], family:catalog[0].family ?? catalog[0].slug}])).toBe(false);
});

test('primary IA includes Originals and workbench is a redirect', () => {
  const layout = readFileSync('src/layouts/ShowcaseLayout.astro','utf8');
  expect(layout).toContain("['Foundations','/foundations/'],['Components','/components/'],['Patterns','/patterns/'],['Motion','/motion/'],['Originals','/originals/']");
  expect(layout).not.toContain("['About','/about/']");
  expect(readFileSync('src/pages/workbench.astro','utf8')).toContain("Astro.redirect('/components/', 301)");
  const css = readFileSync('src/styles/global.css','utf8');
  expect(css).toContain('.desktop-nav a[aria-current]:after{content:');
  expect(css).toMatch(/\.desktop-nav a\[aria-current\]:after\{[^}]*left:0;right:0;/);
});

test('filter URLs normalize invalid values and preserve unrelated parameters and anchors', () => {
  expect(readCatalogFilters('?category=unknown&origin=unknown&q=room')).toEqual({query:'room',category:'all',origin:'all'});
  const url=new URL('https://example.test/components/?keep=yes#catalog');
  const next=writeCatalogFilters(url,{query:'thumbnail',category:'media',origin:'portfolio-derived'});
  expect(readCatalogFilters(next.search)).toEqual({query:'thumbnail',category:'media',origin:'portfolio-derived'});
  const cleared=writeCatalogFilters(next,{query:'',category:'all',origin:'all'});
  expect(cleared.search).toBe('?keep=yes');expect(cleared.hash).toBe('#catalog');expect(url.search).toBe('?keep=yes');
});
