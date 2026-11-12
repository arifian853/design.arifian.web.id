import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const theme of ['light', 'dark']) {
  for (const width of [390, 1280]) {
    test(`Agent Access works with keyboard at ${width}px in ${theme} with reduced motion`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme as 'light' | 'dark' });
      await page.addInitScript(value => localStorage.setItem('arifian-design-theme-v1', value), theme);
      await page.goto('/about/#agent-access', { waitUntil: 'networkidle' });
      const section = page.locator('#agent-access');
      await expect(section.getByRole('heading', { name: 'Agent Access', exact: true })).toBeVisible();
      if (theme === 'dark') await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expect(section).toContainText('Hosted HTTP access is not yet available');
      const setup = section.locator('summary').nth(0);
      await setup.focus();
      await expect(setup).toBeFocused();
      await expect(setup).toHaveCSS('outline-style', 'solid');
      await page.keyboard.press('Enter');
      const checkout = section.getByRole('code').filter({ hasText: 'git clone' });
      await expect(checkout).toBeVisible();
      await expect(checkout).toContainText('test -f scripts/catalog-mcp.ts');
      const clients = section.locator('summary').nth(1);
      await clients.focus();
      await page.keyboard.press('Space');
      const block = section.getByRole('region', { name: 'Codex CLI stdio configuration' });
      await expect(block).toBeVisible();
      await page.keyboard.press('Tab');
      await expect(block).toBeFocused();
      await expect(block).toContainText('codex mcp add arifian-design -- bun run "$PWD/scripts/catalog-mcp.ts"');
      await expect(section.locator('pre[aria-label="Claude Code stdio configuration"]')).toContainText('--transport stdio --scope local');
      for (const link of await section.getByRole('link').all()) {
        await link.focus();
        await expect(link).toBeFocused();
        await expect(link).toHaveCSS('outline-style', 'solid');
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await section.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
      const results = await new AxeBuilder({ page }).include('#agent-access').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations).toEqual([]);
      await clients.focus();
      await page.keyboard.press('Enter');
      await expect(block).toBeHidden();
    });
  }
}
