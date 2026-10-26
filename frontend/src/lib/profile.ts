import { z } from 'zod';

const color = z.string().regex(/^#[\da-f]{3,8}$/i);
const length = z.string().regex(/^\d+(\.\d+)?(px|rem)$/);
const font = z.string().min(1).max(160).regex(/^[\w\s,'"-]+$/);
const colors = z.strictObject({ background: color, foreground: color, surface: color, primary: color, onPrimary: color, border: color });
const schema = z.strictObject({
  key: z.string().regex(/^[a-z0-9-]{1,40}$/), label: z.string().min(1).max(80),
  recipe: z.enum(['flow', 'tiles']),
  colors,
  typography: z.strictObject({ body: font, heading: font, scale: length }),
  shape: z.strictObject({ radius: length, border: length, shadow: z.string().max(100).regex(/^(none|[-\d\s.pxrem#(),%a-fgb]+)$/i) }),
  density: z.strictObject({ gap: length, padding: length }),
  motion: z.strictObject({ duration: z.number().min(0).max(1000), distance: z.number().min(0).max(30) }),
});
export type DesignProfile = z.infer<typeof schema>;
export type PublicWorkbenchProfile = DesignProfile;
export function validateProfile(input: unknown): input is DesignProfile { return schema.safeParse(input).success; }
export function parseProfiles(input: unknown): DesignProfile[] {
  return z.array(schema).min(1).max(9).refine(items => new Set(items.map(p => p.key)).size === items.length).parse(input);
}
export function parsePublicProfiles(input: unknown): PublicWorkbenchProfile[] {
  return z.array(schema).length(1).refine(items => items[0].key==='terracotta' && items[0].label==='Terracotta').parse(input);
}
export function applyProfile(profile: DesignProfile, reducedMotion: boolean, supportRoles: Record<string,string> = {}) {
  const p = schema.parse(profile);
  const duration = reducedMotion ? 0 : p.motion.duration;
  return {
    key: p.key, recipe: p.recipe, duration, distance: reducedMotion ? 0 : p.motion.distance,
    style: {
      // Preserve every authorized source color exactly; only supplement the six roles algorithmically.
      '--background': p.colors.background, '--foreground': p.colors.foreground,
      '--card': p.colors.surface, '--card-foreground': p.colors.foreground,
      '--surface': p.colors.surface, '--surface-foreground': p.colors.foreground,
      '--primary': p.colors.primary, '--primary-foreground': p.colors.onPrimary,
      '--secondary': p.colors.primary, '--secondary-foreground': p.colors.onPrimary,
      '--tertiary': p.colors.primary, '--tertiary-foreground': p.colors.onPrimary,
      '--muted': p.colors.surface, '--muted-foreground': p.colors.foreground,
      '--accent': p.colors.surface, '--accent-foreground': p.colors.foreground,
      '--destructive': p.colors.primary, '--destructive-foreground': p.colors.onPrimary,
      '--popover': p.colors.surface, '--popover-foreground': p.colors.foreground,
      '--border': p.colors.border, '--input': p.colors.border, '--ring': p.colors.foreground,
      '--outline': p.colors.border, '--outline-variant': p.colors.border,
      '--surface-container-lowest': p.colors.background, '--surface-container-low': p.colors.surface,
      '--surface-container': p.colors.surface, '--surface-container-high': p.colors.surface,
      '--surface-container-highest': p.colors.surface,
      '--chart-1': p.colors.primary, '--chart-2': p.colors.foreground,
      '--chart-3': p.colors.onPrimary, '--chart-4': p.colors.border, '--chart-5': p.colors.surface,
      ...supportRoles,
      '--font-body': p.typography.body, '--font-heading': p.typography.heading,
      '--type-display': p.typography.scale, '--radius': p.shape.radius,
      '--border-width': p.shape.border, '--surface-shadow': p.shape.shadow,
      '--space-gap': p.density.gap, '--space-panel': p.density.padding,
      '--motion-duration': `${duration}ms`,
    } as Record<string, string>,
  };
}
