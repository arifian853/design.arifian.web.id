import { describe, expect, test } from 'bun:test';
import { catalog, categories, catalogCounts, searchCatalog, validateCatalog } from '../src/lib/catalog';

describe('public showcase catalog', () => {
  test('counts accepted, rendered entries without inflating variants', () => {
    expect(validateCatalog(catalog)).toBe(true);
    expect(catalogCounts.components).toBe(catalog.filter(item => item.kind === 'component').length);
    expect(catalogCounts.originals).toBe(catalog.filter(item => item.original).length);
    expect(catalogCounts.motion).toBe(catalog.filter(item => item.kind === 'motion').length);
    expect(catalogCounts.patterns).toBe(catalog.filter(item => item.kind === 'pattern').length);
    for (const category of categories) expect(catalog.some(item => item.category === category.slug)).toBe(true);
  });
  test('searches names, purpose and tags within an optional category', () => {
    expect(searchCatalog('keyboard').length).toBeGreaterThan(0);
    expect(searchCatalog('dialog', 'overlays').map(item => item.slug)).toContain('dialog');
    expect(searchCatalog('no-such-specimen')).toEqual([]);
    expect(searchCatalog('', 'forms').every(item => item.category === 'forms')).toBe(true);
  });
  test('rejects duplicate ids, unsafe metadata and unrenderable entries', () => {
    expect(validateCatalog([...catalog, catalog[0]])).toBe(false);
    expect(validateCatalog([{ ...catalog[0], summary: '/private/source.md' }])).toBe(false);
    expect(validateCatalog([{ ...catalog[0], slug: '../unsafe' }])).toBe(false);
    expect(validateCatalog([{ ...catalog[0], origin: 'unknown' }])).toBe(false);
    expect(validateCatalog(null)).toBe(false);
    expect(validateCatalog([{ ...catalog[0], states: null }])).toBe(false);
    expect(validateCatalog([{ ...catalog[0], original: true, license: 'MIT' }])).toBe(false);
  });
});
