import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { catalog, validateCatalog } from '../src/lib/catalog';
import { specimenRenderers, Specimen } from '../src/components/Specimens';
import { moveTask, sortRecords, sampleRecords } from '../src/lib/demo-state';

describe('every catalog claim has a real specimen', () => {
  test('renderer registry and catalog match exactly', () => {
    expect(Object.keys(specimenRenderers).sort()).toEqual(catalog.map(entry => entry.slug).sort());
    for (const entry of catalog) {
      const html = renderToStaticMarkup(<Specimen slug={entry.slug} />);
      expect(html).toContain(`data-specimen="${entry.slug}"`);
      expect(html.length).toBeGreaterThan(120);
    }
  });
  test('metadata rejects a safe-looking slug without a renderer', () => {
    expect(validateCatalog([{ ...catalog[0], slug: 'imaginary-component' }])).toBe(false);
  });
  test('original authorship does not grant a third-party license', () => {
    expect(catalog.filter(entry => entry.original).every(entry => entry.license === 'Project terms')).toBe(true);
    expect(catalog.some(entry => entry.origin === 'shadcn / Base UI' && entry.license === 'MIT')).toBe(true);
  });
});

describe('local specimen state', () => {
  test('sorting preserves records and toggles meaningful order', () => {
    expect(sortRecords(sampleRecords, true).map(record => record.name)).toEqual(['Atlas', 'Fieldwork', 'Index']);
    expect(sortRecords(sampleRecords, false).map(record => record.name)).toEqual(['Index', 'Fieldwork', 'Atlas']);
    expect(sampleRecords[0].name).toBe('Fieldwork');
  });
  test('task movement is bounded and leaves unrelated tasks alone', () => {
    const tasks = [{ id: 1, title: 'Review spacing', stage: 0 }, { id: 2, title: 'Write labels', stage: 1 }];
    expect(moveTask(tasks, 1, 1)).toEqual([{ ...tasks[0], stage: 1 }, tasks[1]]);
    expect(moveTask(tasks, 1, -1)[0].stage).toBe(0);
    expect(moveTask([{ ...tasks[0], stage: 2 }], 1, 1)[0].stage).toBe(2);
    expect(tasks[0].stage).toBe(0);
  });
});
