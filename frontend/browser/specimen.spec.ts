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
test('design specimen selector exposes only the two intended profiles and switches visual grammar', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'See the design before you build it.'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Design workbench'})).toBeVisible();
  const profile = page.getByLabel('Design profile');
  const options = profile.locator('option');
  await expect(options).toHaveCount(2);
  const labels = await options.allTextContents();
  expect(new Set(labels).size).toBe(2);
  await expect(page.locator('.library-boundary')).toHaveCount(0);
  await expect(page.locator('.workbench footer')).toContainText('other source profiles remain private');
});

test('profile motion never fades specimen copy below readable opacity', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  const select = page.getByLabel('Design profile');
  await expect(select.locator('option')).toHaveCount(2);
  await select.selectOption({index:1});
  const opacities = await page.locator('.reflection > p').first().evaluate(async element => {
    const values: number[] = [];
    for (let i=0; i<12; i++) {
      values.push(Number(getComputedStyle(element).opacity));
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
    return values;
  });
  expect(Math.min(...opacities)).toBe(1);
});

test('static production page loads the approved public specimens and never requests the local endpoint', async ({page}) => {
  const profileRequests: string[] = [];
  const profileResponses: number[] = [];
  page.on('request', request => {
    if (request.url().includes('__local/specimens') || request.url().endsWith('/specimens.json')) profileRequests.push('unexpected profile endpoint');
    if (request.url().endsWith('/design-specimens.json')) profileRequests.push('public specimen payload');
  });
  page.on('response', response => {
    if (response.url().endsWith('/design-specimens.json')) profileResponses.push(response.status());
  });
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'See the design before you build it.'})).toBeVisible();
  const options = page.locator('#profile option');
  await expect(options).toHaveText(['Rosewood / Subtle','Terracotta']);
  await expect(page.locator('.library-boundary')).toHaveCount(0);
  await expect(page.locator('.workbench footer')).toContainText('These curated specimen profiles are public');
  await page.locator('#profile').selectOption('terracotta');
  await expect(page.locator('.workbench')).toHaveAttribute('data-recipe','tiles');
  expect(profileRequests).toEqual(['public specimen payload']);
  expect(profileResponses).toEqual([200]);
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
