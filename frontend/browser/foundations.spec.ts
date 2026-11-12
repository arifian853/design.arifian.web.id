import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const brand = [['50','#faf5f2'],['200','#e9c6b9'],['400','#d97757'],['500','#c96442'],['600','#be5c3a'],['700','#b55333'],['800','#964225'],['950','#3f1b10']];

test('every swatch copies its exact hex with keyboard controls and live feedback', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (value: string) => { (window as unknown as { copiedHex: string }).copiedHex = value; },
    } });
  });
  await page.goto('/foundations/', { waitUntil: 'networkidle' });
  await expect(page.locator('.brand-swatch-card')).toHaveCount(8);
  for (const [index, [step, hex]] of brand.entries()) {
    const card = page.locator('.brand-swatch-card').nth(index);
    const button = card.getByRole('button', { name: `Copy Brand ${step} ${hex}`, exact: true });
    await button.focus();
    await expect(button).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press(index % 2 ? 'Space' : 'Enter');
    await expect(card.getByRole('status')).toHaveText(`Copied ${hex}.`);
    await expect(button).toBeFocused();
    expect(await page.evaluate(() => (window as unknown as { copiedHex: string }).copiedHex)).toBe(hex);
    await expect(card.locator('code')).toHaveText(hex);
  }
  await page.keyboard.press('Enter');
  await expect(page.locator('.brand-swatch-card').last().getByRole('status')).toHaveText('Copied #3f1b10.');
});

for (const failure of ['denied', 'missing'] as const) {
  test(`clipboard ${failure} offers keyboard-selectable manual copy and allows retry`, async ({ page }) => {
    await page.addInitScript(mode => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: mode === 'missing' ? undefined : {
        writeText: async () => { throw new Error('Permission denied'); },
      } });
    }, failure);
    await page.goto('/foundations/', { waitUntil: 'networkidle' });
    const card = page.locator('.brand-swatch-card').first();
    const button = card.getByRole('button', { name: 'Copy Brand 50 #faf5f2', exact: true });
    await button.focus(); await page.keyboard.press('Enter');
    await expect(card.getByRole('status')).toHaveText('Clipboard unavailable. Select the hex below and copy it manually.');
    await page.keyboard.press('Tab');
    const field = card.getByRole('textbox', { name: 'Brand 50 hex for manual copying' });
    await expect(field).toBeFocused(); await expect(field).toHaveValue('#faf5f2');
    expect(await field.evaluate((input: HTMLInputElement) => [input.selectionStart, input.selectionEnd])).toEqual([0, 7]);
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => {} } }));
    await button.click();
    await expect(card.getByRole('status')).toHaveText('Copied #faf5f2.');
    await expect(field).toHaveCount(0);
    await expect(card.locator('code')).toHaveText('#faf5f2');
  });
}

test('swatch cards and attribution stay sharp, responsive and accessible across themes and motion settings', async ({ page }) => {
  test.setTimeout(180_000);
  for (const reducedMotion of ['reduce', 'no-preference'] as const) {
    await page.emulateMedia({ reducedMotion });
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const theme of ['light', 'dark']) {
        for (const route of ['/foundations/', '/about/']) {
          await page.goto(route, { waitUntil: 'networkidle' });
          await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
          expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
          if (route === '/foundations/') {
            for (const card of await page.locator('.brand-swatch-card').all()) {
              await expect(card).toHaveCSS('border-radius', '0px');
              const button = card.getByRole('button');
              await expect(button).toHaveCSS('border-radius', '0px');
              const bounds = await button.boundingBox();
              expect(bounds!.width).toBeGreaterThanOrEqual(44); expect(bounds!.height).toBeGreaterThanOrEqual(44);
              if (reducedMotion === 'reduce') await expect(button).toHaveCSS('transition-duration', '0s');
            }
          } else {
            const credit = page.locator('[data-attribution-source="claude-anthropic"]');
            await expect(credit).toContainText('Claude, created by Anthropic');
            await expect(credit.getByRole('link', { name: 'Claude ↗', exact: true })).toHaveAttribute('href', 'https://claude.ai/');
            await expect(credit.getByRole('link', { name: 'Anthropic ↗', exact: true })).toHaveAttribute('href', 'https://www.anthropic.com/');
          }
        }
      }
    }
  }
});
