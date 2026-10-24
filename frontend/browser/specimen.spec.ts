import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, chmod } from 'node:fs/promises';
import type { Page } from '@playwright/test';

async function metrics(page: Page) {
  return page.locator('.workbench').evaluate(root => {
    const bench = getComputedStyle(root);
    const panel = getComputedStyle(root.querySelector('.panel')!);
    const heading = getComputedStyle(root.querySelector('h1')!);
    return { shell: bench.gridTemplateColumns, radius: panel.borderRadius, border: panel.borderWidth,
      shadow: panel.boxShadow, padding: panel.padding, gap: bench.gap, font: heading.fontFamily,
      scale: heading.fontSize, motion: bench.getPropertyValue('--motion-duration'),
      layout: getComputedStyle(root.querySelector('.specimen-grid')!).gridTemplateColumns };
  });
}
async function capture(page: Page, name: string) {
  await mkdir('../private/qa', { recursive: true, mode: 0o700 });
  const file = `../private/qa/${name}.png`;
  await page.screenshot({path: file, fullPage: true});
  await chmod(file, 0o600);
}
for (const viewport of [{width:1440,height:1000}, {width:390,height:844}]) {
  test(`full composition, keyboard, contrast and layout at ${viewport.width}px`, async ({page}) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', () => errors.push('Browser error'));
    const external: string[] = [];
    let sameOrigin: string | undefined;
    page.on('request', req => {
      const origin = new URL(req.url()).origin;
      if (!sameOrigin && req.isNavigationRequest()) sameOrigin = origin;
      if (sameOrigin && origin !== sameOrigin) external.push('External request');
    });
    await page.goto('/');
    await expect(page.locator('.workbench')).toBeVisible();
    const before = await metrics(page);
    const textBefore = await page.locator('.intro h1').textContent();
    for (let index=0; index<2; index++) {
      await page.locator('#profile').selectOption({index});
      await expect(page.locator('.workbench')).toHaveAttribute('data-recipe',index ? 'tiles' : 'flow');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator('#workbench .intro h1')).toBeVisible();
      await page.getByRole('button',{name:'Save collection',exact:true}).click();
      await expect(page.getByRole('button',{name:'Saved to collection'})).toHaveAttribute('aria-pressed','true');
      await page.getByRole('button',{name:'Saved to collection'}).click();
      await page.locator('#search').fill('nothing matches');
      await expect(page.getByRole('status').filter({hasText:'No collections match'})).toBeVisible();
      await page.locator('#search').fill('');
      const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      // Keep private DOM, colors, font names and excerpts out of runner output.
      expect(axe.violations.map(v => ({id:v.id, count:v.nodes.length}))).toEqual([]);
      await capture(page, `specimen-${viewport.width}-${index}`);
    }
    const after = await metrics(page);
    for (const key of ['radius','border','shadow','padding','gap','font','scale','motion'] as const) expect(before[key] !== after[key],key).toBe(true);
    if (viewport.width > 760) {
      expect(before.shell !== after.shell).toBe(true);
      expect(before.layout !== after.layout).toBe(true);
    }
    expect(await page.locator('.intro h1').textContent() === textBefore).toBe(true);
    await page.locator('#profile').focus();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.matches(':focus-visible'))).toBe(true);
    expect(await page.evaluate(() => getComputedStyle(document.activeElement!).outlineWidth === '3px')).toBe(true);
    await page.locator('#profile').focus();
    await page.keyboard.press('ArrowUp'); await page.keyboard.press('Enter');
    await expect(page.locator('.workbench')).toHaveAttribute('data-recipe','flow');
    expect(errors.length).toBe(0); expect(external.length).toBe(0);
  });
}
test('public workbench loads only its two original demonstration profiles', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Keep room for ideas.'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Public workbench demo'})).toBeVisible();
  const profile = page.getByLabel('Design profile');
  await expect(profile.locator('option')).toHaveText(['Paper Current','Studio Ember']);
  await expect(page.locator('.locked')).toHaveCount(0);
  await expect(page.locator('.workbench footer')).toContainText('Private source documents are not included');
});

 test('OS and manual reduced motion both disable animation completely', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.workbench')).toHaveAttribute('data-motion','static');
  await page.locator('#profile').selectOption({index:1});
  expect(await page.locator('.reflection p').first().evaluate(el => getComputedStyle(el).transform === 'none')).toBe(true);
  expect(await page.locator('[data-slot="button"]').first().evaluate(el => getComputedStyle(el).transitionDuration === '0s')).toBe(true);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect(page.locator('.workbench')).toHaveAttribute('data-motion','active');
  await page.getByLabel('Static preview').check();
  await expect(page.locator('.workbench')).toHaveAttribute('data-motion','static');
  await capture(page,'reduced-motion');
});
test('read-only endpoint and filesystem boundary deny unsafe requests', async ({request}) => {
  const endpoint='/__local/specimens';
  const good=await request.get(endpoint); expect(good.status()).toBe(200);
  expect(good.headers()['cache-control']).toBe('no-store');
  expect(good.headers()['access-control-allow-origin']).toBeUndefined();
  for (const response of [await request.post(endpoint),await request.get(endpoint+'?file=secret'),await request.get(endpoint,{headers:{Origin:'https://example.invalid'}}),await request.get(endpoint,{headers:{Host:'evil.example'}})]) expect([403,404].includes(response.status())).toBe(true);
  const response = await request.get('/@fs/home/arifian/projects/design/private/normalized/specimens.json');
  expect([403,404].includes(response.status())).toBe(true);
});
