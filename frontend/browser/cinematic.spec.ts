import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage opens as a cinematic design atlas and keeps the workbench reachable', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'See the design before you build it.'})).toBeVisible();
  await expect(page.locator('#top').getByRole('link',{name:'Enter the workbench'})).toHaveAttribute('href','#workbench');
  const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(axe.violations.map(v => ({id:v.id,count:v.nodes.length,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
  await expect(page.getByRole('region',{name:'A design system assembled in layers'})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const stage = page.locator('.archive-stage');
  const before = await stage.evaluate(el => getComputedStyle(el).transform);
  await page.evaluate(() => window.scrollTo(0, Math.round(innerHeight * 1.4)));
  await page.waitForTimeout(150);
  const after = await stage.evaluate(el => getComputedStyle(el).transform);
  expect(after).not.toBe(before);
  await page.locator('#top').getByRole('link',{name:'Enter the workbench'}).click();
  await expect(page.locator('#workbench .workbench')).toBeVisible();
});

test('cinematic homepage hydrates without browser errors', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.locator('.cinematic-home')).toHaveAttribute('data-hydrated','true');
  await page.waitForTimeout(50);
  expect(errors).toEqual([]);
});

test('system reduced motion stays respected without an override control', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.cinematic-home')).toHaveAttribute('data-motion','static');
  await expect(page.locator('.cinematic-home')).toHaveAttribute('data-hydrated','true');
  await expect(page.getByRole('button',{name:/motion/i})).toHaveCount(0);
  const stage = page.locator('.archive-stage');
  const before = await stage.evaluate(el => getComputedStyle(el).transform);
  await page.evaluate(() => window.scrollTo(0, Math.round(innerHeight * 1.4)));
  await page.waitForTimeout(150);
  const after = await stage.evaluate(el => getComputedStyle(el).transform);
  expect(after).toBe(before);
  await page.waitForTimeout(50);
  expect(errors).toEqual([]);
});

test('motion starts automatically for users without reduced-motion preference and has no toggle', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  await expect(page.locator('.cinematic-home')).toHaveAttribute('data-hydrated','true');
  await expect(page.locator('.cinematic-home')).toHaveAttribute('data-motion','active');
  await expect(page.getByRole('button',{name:/motion/i})).toHaveCount(0);
});

test('homepage reflows for mobile without horizontal overflow', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'See the design before you build it.'})).toBeVisible();
  await expect(page.locator('#top').getByRole('link',{name:'Enter the workbench'})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
