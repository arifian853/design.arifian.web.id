import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { catalogCounts } from '../src/lib/catalog';

const routes = [
  ['Foundations', '/foundations/'], ['Components', '/components/'],
  ['Actions', '/components/actions/'], ['Forms', '/components/forms/'],
  ['Navigation', '/components/navigation/'], ['Feedback', '/components/feedback/'],
  ['Overlays', '/components/overlays/'], ['Data', '/components/data/'],
  ['Media', '/components/media/'], ['Surfaces', '/components/surfaces/'],
  ['Originals', '/originals/'], ['Motion', '/motion/'],
  ['Patterns', '/patterns/'], ['About', '/about/'],
] as const;

const primaryLinks = ['/foundations/', '/components/', '/patterns/', '/motion/', '/originals/'];

test('header and mobile navigation expose five primary links, theme toggle and footer collections', async ({ page }) => {
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/foundations/', { waitUntil: 'networkidle' });
    const header = page.locator('[data-site-header]');
    await expect(header.getByRole('link', { name: 'Arifian Design System home' })).toHaveAttribute('href', '/');
    await expect(header.getByRole('button', { name: /Switch to (dark|light) mode/ })).toBeVisible();
    const desktop = header.getByRole('navigation', { name: 'Main navigation', includeHidden: true });
    expect(await desktop.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(primaryLinks);
    await expect(header.locator('a[href="/about/"]')).toHaveCount(0);
    if (width <= 800) {
      await header.locator('.mobile-navigation summary').click();
      const mobile = header.getByRole('navigation', { name: 'Mobile navigation' });
      await expect(mobile).toBeVisible();
      expect(await mobile.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(primaryLinks);
      await expect(mobile.locator('a[aria-current="page"]')).toHaveAttribute('href', '/foundations/');
    } else {
      await expect(desktop).toBeVisible();
      await expect(desktop.getByRole('link')).toHaveText(['Foundations', 'Components', 'Patterns', 'Motion', 'Originals']);
    }
    await expect(page.locator('.site-footer a[href="/about/"]')).toBeVisible();
    await expect(page.locator('.site-footer a[href="/originals/"]')).toBeVisible();
    await expect(page.locator('a[href="/about/"]')).toHaveCount(1);
  }
});

for (const width of [801, 1024, 1440]) {
  test(`active desktop underline spans the padded anchor at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/foundations/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const active = page.locator('.desktop-nav a[aria-current="page"]');
    await expect(active).toHaveCount(1);
    await expect(active).toHaveText('Foundations');
    await expect(active).toBeVisible();
    const dimensions = await active.evaluate(anchor => {
      const range = document.createRange();
      range.selectNodeContents(anchor);
      const style = getComputedStyle(anchor);
      const underline = getComputedStyle(anchor, '::after');
      return {
        anchorWidth: anchor.getBoundingClientRect().width,
        textWidth: range.getBoundingClientRect().width,
        paddingLeft: style.paddingLeft, paddingRight: style.paddingRight,
        gap: getComputedStyle(anchor.parentElement!).gap,
        content: underline.content, position: underline.position,
        left: underline.left, right: underline.right, width: Number.parseFloat(underline.width),
      };
    });
    expect(dimensions.anchorWidth - dimensions.textWidth).toBeGreaterThan(10);
    expect(dimensions.paddingLeft).toBe('10px');
    expect(dimensions.paddingRight).toBe('10px');
    expect(dimensions.gap).toBe('6px');
    expect(dimensions.content).not.toBe('none');
    expect(dimensions.position).toBe('absolute');
    expect(dimensions.left).toBe('0px');
    expect(dimensions.right).toBe('0px');
    expect(Math.abs(dimensions.width - dimensions.anchorWidth)).toBeLessThanOrEqual(1);
  });
}

test('search, category and origin intersect and survive reload', async ({ page }) => {
  await page.goto('/components/?q=thumbnail&category=media&origin=portfolio-derived', { waitUntil: 'networkidle' });
  await expect(page.getByRole('searchbox', { name: 'Find a component' })).toHaveValue('thumbnail');
  await expect(page.getByRole('button', { name: 'Media', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('Origin', { exact: true })).toHaveValue('portfolio-derived');
  await expect(page.locator('.catalog-index a')).toHaveCount(1);
  await expect(page.locator('.catalog-index a')).toHaveAttribute('href', '/components/media/#carousel');
  await page.getByLabel('Origin', { exact: true }).selectOption('shadcn-adapted');
  await expect(page.getByText('No matching components', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/origin=shadcn-adapted/);
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.getByRole('searchbox')).toHaveValue('thumbnail');
  await expect(page.getByLabel('Origin', { exact: true })).toHaveValue('shadcn-adapted');
  await expect(page.getByRole('button', { name: 'Media', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.catalog-index a')).toHaveCount(0);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page).toHaveURL(/\/components\/$/);
  await expect(page.locator('.catalog-index a')).toHaveCount(catalogCounts.components);
});

test('home introduces the Arifian Design System with real specimens and derived counts', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page).toHaveTitle(/Arifian Design System/);
  await expect(page.getByRole('heading', { name: 'Interfaces with less noise and more intent.' })).toBeVisible();
  await expect(page.locator('[data-hero-specimen]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore Components' })).toHaveAttribute('href', '/components/');
  await expect(page.getByRole('link', { name: 'See Foundations' })).toHaveAttribute('href', '/foundations/');
  for (const kind of ['components', 'originals', 'motion', 'patterns']) {
    const stat = page.locator(`[data-stat="${kind}"]`);
    await expect(stat).toBeVisible();
    const count = Number(await stat.getAttribute('data-count'));
    expect(Number.isInteger(count)).toBe(true);
    expect(count).toBe(catalogCounts[kind as keyof typeof catalogCounts]);
    await expect(stat).toContainText(String(count));
  }
});

test('search and category filters change results and preserve a shareable URL', async ({ page }) => {
  await page.goto('/components/', { waitUntil: 'networkidle' });
  const search = page.getByRole('searchbox', { name: 'Find a component' });
  await page.getByLabel('Origin', { exact: true }).selectOption('shadcn-adapted');
  await search.fill('dialog');
  await expect(page.locator('.catalog-index .index-card')).toHaveCount(1);
  await expect(page.locator('.catalog-index a')).toHaveAttribute('href', '/components/overlays/#dialog');
  await expect(page).toHaveURL(/q=dialog/);
  await page.reload({ waitUntil: 'networkidle' });
  await expect(search).toHaveValue('dialog');
  await search.fill('does-not-exist');
  await expect(page.getByText('No matching components', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await page.getByRole('button', { name: 'Forms', exact: true }).click();
  await expect(page).toHaveURL(/category=forms/);
  for (const link of await page.locator('.catalog-index a').all()) {
    await expect(link).toHaveAttribute('href', /\/components\/forms\/#/);
  }
});

async function readySpecimen(page: import('@playwright/test').Page, id: string) {
  const specimen = page.locator(`#${id}`);
  await specimen.scrollIntoViewIfNeeded();
  await expect(specimen.locator('astro-island[ssr]')).toHaveCount(0);
  return specimen;
}

test('fields validate, selections use keyboard and no submission leaves the page', async ({ page }) => {
  const submissions: string[] = [];
  page.on('request', request => { if (request.method() !== 'GET') submissions.push(request.url()); });
  await page.goto('/patterns/', { waitUntil: 'networkidle' });
  const validation = await readySpecimen(page, 'validation');
  await validation.getByRole('button', { name: 'Check address' }).click();
  const email = validation.getByLabel('Email address');
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await email.fill('alex@example.test');
  await validation.getByRole('button', { name: 'Check address' }).click();
  await expect(validation.getByRole('status')).toContainText('Address looks good');
  await page.goto('/components/forms/', { waitUntil: 'networkidle' });
  const select = await readySpecimen(page, 'select');
  await select.getByRole('combobox').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(select.getByRole('combobox')).toContainText('Collection');
  expect(submissions).toEqual([]);
});

test('dialog and sheet trap focus, close with Escape and restore the trigger', async ({ page }) => {
  await page.goto('/components/overlays/', { waitUntil: 'networkidle' });
  const specimen = await readySpecimen(page, 'dialog');
  const trigger = specimen.getByRole('button', { name: 'Review collection' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Ready for a review?' });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  const sheet = await readySpecimen(page, 'sheet');
  await sheet.getByRole('button', { name: 'Open details' }).click();
  await expect(page.getByRole('dialog', { name: 'Collection details' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(sheet.getByRole('button', { name: 'Open details' })).toBeFocused();
});

test('dark appearance persists and open overlay surfaces stay opaque and sharp', async ({ page }) => {
  await page.goto('/components/overlays/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const specimen = await readySpecimen(page, 'dialog');
  await specimen.getByRole('button', { name: 'Review collection' }).click();
  const dialog = page.getByRole('dialog', { name: 'Ready for a review?' });
  expect(await dialog.evaluate(el => ({ bg: getComputedStyle(el).backgroundColor, radius: getComputedStyle(el).borderRadius }))).toEqual({ bg: 'rgb(48, 48, 46)', radius: '0px' });
  expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
});

test('table sorting, chart data and local patterns perform real state changes', async ({ page }) => {
  await page.goto('/components/data/', { waitUntil: 'networkidle' });
  const table = await readySpecimen(page, 'table');
  await expect(table.locator('tbody tr').first()).toContainText('Atlas');
  await table.getByRole('button', { name: 'Project' }).click();
  await expect(table.locator('tbody tr').first()).toContainText('Index');
  const chart = await readySpecimen(page, 'chart');
  await chart.getByText('View exact data').click();
  await expect(chart.getByRole('table')).toContainText('80');
  await page.goto('/patterns/', { waitUntil: 'networkidle' });
  const settings = await readySpecimen(page, 'settings');
  await settings.getByLabel('Collection name').fill('New field notes');
  await settings.getByRole('button', { name: 'Save preferences' }).click();
  await expect(settings.getByRole('status')).toContainText('Preferences saved');
  const board = await readySpecimen(page, 'kanban');
  await board.getByRole('button', { name: 'Move Review the spacing forward' }).click();
  await expect(board.getByRole('region', { name: 'In progress', exact: true })).toContainText('Review the spacing');
});

test('motion honors live reduced-motion preference and static preview', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/motion/', { waitUntil: 'networkidle' });
  const reveal = await readySpecimen(page, 'reveal');
  await reveal.getByRole('button', { name: 'Replay reveal' }).click();
  await expect(reveal.getByRole('status')).toContainText('Static mode');
  await expect(reveal.locator('.motion-phrase')).toHaveCSS('transform', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(reveal.getByRole('status')).toContainText('On demand');
  await reveal.getByLabel('Static preview').check();
  await expect(reveal.getByRole('status')).toContainText('Static mode');
});

test('media thumbnails and keyboard-accessible full-size views work', async ({ page }) => {
  await page.goto('/components/media/', { waitUntil: 'networkidle' });
  const gallery = await readySpecimen(page, 'carousel');
  await gallery.getByRole('button', { name: 'Fieldwork', exact: true }).click();
  await expect(gallery.getByRole('button', { name: 'Fieldwork', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await gallery.getByRole('button', { name: 'Enlarge Fieldwork' }).click();
  await expect(page.getByRole('dialog', { name: 'Fieldwork', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(gallery.getByRole('button', { name: 'Enlarge Fieldwork' })).toBeFocused();
});

for (const width of [320,390,430,768,1024,1280,1440]) {
  test(`showcase reflows and passes axe at ${width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const theme of ['light', 'dark']) {
      await page.goto('/', { waitUntil: 'networkidle' });
      if (theme === 'dark') await page.getByRole('button', { name: 'Switch to dark mode' }).click();
      for (const route of ['/', '/foundations/', '/components/forms/', '/patterns/']) {
        await page.goto(route, { waitUntil: 'networkidle' });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
      }
    }
    expect(errors).toEqual([]);
  });
}

test('navigation remains usable around layout breakpoints and with keyboard focus', async ({ page }) => {
  for (const width of [519,521,799,801,1099,1101]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width <= 800) {
      await page.getByRole('button', { name: 'Open navigation' }).or(page.locator('.mobile-navigation summary')).click();
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Foundations' })).toBeVisible();
    }
  }
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveCSS('outline-style', 'solid');
});

test('all planned showcase and category routes render meaningful static pages', async ({ page }) => {
  for (const [heading, path] of routes) {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status(), `${path} should be a generated page`).toBe(200);
    await expect(page.getByRole('heading', { name: new RegExp(heading, 'i'), level: 1 })).toBeVisible();
  }
});

test('public component browsing has no install onboarding, source viewer or alternate profiles', async ({ page }) => {
  await page.goto('/components/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: /components/i, level: 1 })).toBeVisible();
  await expect(page.getByRole('searchbox')).toBeVisible();
  await expect(page.getByText(/npm\s+(install|add)|bun\s+(install|add)|npx\s+.*shadcn|source code viewer|copy source/i)).toHaveCount(0);
  await expect(page.getByRole('combobox', { name: /design profile|profile family|theme family/i })).toHaveCount(0);
});

test('showcase pages never call private or agent-only endpoints', async ({ page }) => {
  const forbidden: string[] = [];
  page.on('request', request => {
    if (/be-design\.arifian\.web\.id|\/__local\/specimens|\/api\//i.test(request.url())) forbidden.push(request.url());
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.goto('/patterns/', { waitUntil: 'networkidle' });
  expect(forbidden).toEqual([]);
});

test('legacy workbench redirects to the component showcase', async ({ page }) => {
  await page.goto('/workbench/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/components\/$/);
});

for (const [legacy, destination] of [
  ['/components/data-display/', '/components/data/'],
  ['/components/layout/', '/components/surfaces/'],
]) {
  test(`${legacy} redirects to ${destination}`, async ({ page }) => {
    await page.goto(legacy, { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}

test('mobile home keeps the header and specimens inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('[data-site-header]')).toBeVisible();
  await expect(page.locator('[data-hero-specimen]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
