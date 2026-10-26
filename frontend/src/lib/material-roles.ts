export type MaterialSupportRoles = Record<string,string>;

/** Generate supplemental M3 roles from one already-approved source color, client-side only. */
export async function deriveMaterialSupportRoles(seed: string): Promise<MaterialSupportRoles> {
  const { argbFromHex, hexFromArgb, themeFromSourceColor } = await import('@material/material-color-utilities');
  const theme = themeFromSourceColor(argbFromHex(seed));
  const scheme = theme.schemes.light.toJSON();
  const hex = (value:number) => hexFromArgb(value);
  return {
    '--secondary':hex(scheme.secondary),'--secondary-foreground':hex(scheme.onSecondary),
    '--tertiary':hex(scheme.tertiary),'--tertiary-foreground':hex(scheme.onTertiary),
    '--muted':hex(scheme.surfaceVariant),'--muted-foreground':hex(scheme.onSurfaceVariant),
    '--accent':hex(scheme.secondaryContainer),'--accent-foreground':hex(scheme.onSecondaryContainer),
    '--destructive':hex(scheme.error),'--destructive-foreground':hex(scheme.onError),
    '--popover':hex(theme.palettes.neutral.tone(92)),
    '--popover-foreground':hex(scheme.onSurface),
    '--menu-surface':hex(theme.palettes.neutral.tone(94)),
    '--dialog-surface':hex(theme.palettes.neutral.tone(92)),
    '--sheet-surface':hex(theme.palettes.neutral.tone(96)),
    '--inverse-surface':hex(scheme.inverseSurface),
    '--inverse-on-surface':hex(scheme.inverseOnSurface),
    '--ring':hex(scheme.outline),'--outline':hex(scheme.outline),'--outline-variant':hex(scheme.outlineVariant),
    '--surface-container-lowest':hex(theme.palettes.neutral.tone(100)),
    '--surface-container-low':hex(theme.palettes.neutral.tone(96)),
    '--surface-container':hex(theme.palettes.neutral.tone(94)),
    '--surface-container-high':hex(theme.palettes.neutral.tone(92)),
    '--surface-container-highest':hex(theme.palettes.neutral.tone(90)),
    '--chart-1':hex(scheme.primary),'--chart-2':hex(scheme.secondary),'--chart-3':hex(scheme.tertiary),
    '--chart-4':hex(scheme.error),'--chart-5':hex(scheme.outline),
  };
}
