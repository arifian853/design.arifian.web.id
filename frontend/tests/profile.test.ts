import { describe, expect, test } from 'bun:test';
import { applyProfile, validateProfile, type DesignProfile } from '../src/lib/profile';

// Invented fixtures, independent of private source documents.
const fixture = (key: string, recipe: 'flow' | 'tiles'): DesignProfile => ({
  key, label: `Fixture ${key}`, recipe,
  colors: { background: '#ffffff', foreground: '#101010', surface: '#eeeeee', primary: '#123456', onPrimary: '#ffffff', border: '#666666' },
  typography: { body: recipe === 'flow' ? 'serif' : 'monospace', heading: recipe === 'flow' ? 'serif' : 'sans-serif', scale: recipe === 'flow' ? '2.7rem' : '3.9rem' },
  shape: { radius: recipe === 'flow' ? '19px' : '2px', border: recipe === 'flow' ? '1px' : '3px', shadow: recipe === 'flow' ? '0 3px 8px #0002' : 'none' },
  density: { gap: recipe === 'flow' ? '23px' : '11px', padding: recipe === 'flow' ? '29px' : '17px' },
  motion: { duration: recipe === 'flow' ? 180 : 70, distance: recipe === 'flow' ? 6 : 0 },
});

describe('atomic full-profile switch', () => {
  test('switches layout, typography, shape, surface, density and motion, even with an identical palette', () => {
    const first = applyProfile(fixture('one', 'flow'), false);
    const second = applyProfile(fixture('two', 'tiles'), false);
    expect(first.recipe).not.toBe(second.recipe);
    for (const token of ['--font-body', '--font-heading', '--type-display', '--radius', '--border-width', '--surface-shadow', '--space-gap', '--space-panel', '--motion-duration']) {
      expect(first.style[token]).not.toBe(second.style[token]);
    }
    expect(first.style['--background']).toBe(second.style['--background']);
    expect(second.key).toBe('two');
  });
  test('reduced motion has a complete static fallback', () => {
    const state = applyProfile(fixture('one', 'flow'), true);
    expect(state.duration).toBe(0);
    expect(state.distance).toBe(0);
    expect(state.style['--motion-duration']).toBe('0ms');
  });
  test('rejects malformed, extra and executable profile input', () => {
    expect(validateProfile(fixture('one', 'flow'))).toBe(true);
    expect(validateProfile({ ...fixture('one', 'flow'), recipe: 'unknown' })).toBe(false);
    expect(validateProfile({ ...fixture('one', 'flow'), sourceText: 'unapproved' })).toBe(false);
    expect(validateProfile({ ...fixture('one', 'flow'), typography: { body: 'url(https://example.com)', heading: 'serif', scale: '3rem' } })).toBe(false);
  });
});
