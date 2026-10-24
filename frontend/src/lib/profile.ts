import { z } from 'zod';

const color = z.string().regex(/^#[\da-f]{3,8}$/i);
const length = z.string().regex(/^\d+(\.\d+)?(px|rem)$/);
const font = z.string().min(1).max(160).regex(/^[\w\s,'"-]+$/);
const schema = z.strictObject({
  key: z.string().regex(/^[a-z0-9-]{1,40}$/), label: z.string().min(1).max(80),
  recipe: z.enum(['flow', 'tiles']),
  colors: z.strictObject({ background: color, foreground: color, surface: color, primary: color, onPrimary: color, border: color }),
  typography: z.strictObject({ body: font, heading: font, scale: length }),
  shape: z.strictObject({ radius: length, border: length, shadow: z.string().max(100).regex(/^(none|[-\d\s.pxrem#(),%a-fgb]+)$/i) }),
  density: z.strictObject({ gap: length, padding: length }),
  motion: z.strictObject({ duration: z.number().min(0).max(1000), distance: z.number().min(0).max(30) }),
});
export type DesignProfile = z.infer<typeof schema>;
export function validateProfile(input: unknown): input is DesignProfile { return schema.safeParse(input).success; }
export function parseProfiles(input: unknown): DesignProfile[] {
  return z.array(schema).min(1).max(9).refine(items => new Set(items.map(p => p.key)).size === items.length).parse(input);
}
export function applyProfile(profile: DesignProfile, reducedMotion: boolean) {
  const p = schema.parse(profile);
  const duration = reducedMotion ? 0 : p.motion.duration;
  return {
    key: p.key, recipe: p.recipe, duration, distance: reducedMotion ? 0 : p.motion.distance,
    style: {
      '--background': p.colors.background, '--foreground': p.colors.foreground,
      '--card': p.colors.surface, '--primary': p.colors.primary,
      '--primary-foreground': p.colors.onPrimary, '--border': p.colors.border,
      '--font-body': p.typography.body, '--font-heading': p.typography.heading,
      '--type-display': p.typography.scale, '--radius': p.shape.radius,
      '--border-width': p.shape.border, '--surface-shadow': p.shape.shadow,
      '--space-gap': p.density.gap, '--space-panel': p.density.padding,
      '--motion-duration': `${duration}ms`,
    } as Record<string, string>,
  };
}
