import { test, expect } from '@playwright/test';

test('workbench compatibility route clearly links to the component showcase',async ({page})=>{
  await page.goto('/workbench/',{waitUntil:'networkidle'});
  await expect(page).toHaveTitle(/Arifian Design System/);
  await expect(page.getByRole('link',{name:'Explore Components'})).toHaveAttribute('href','/components/');
  await expect(page.locator('body')).not.toContainText(/Rosewood|Subtle|palette theme/i);
});

test('local specimen endpoint is not present in the public static site',async ({page})=>{
  const response=await page.request.get('/__local/specimens');
  expect(response.status()).toBe(404);
  await page.goto('/');
  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));
  expect(resources.some(url=>url.includes('/__local/specimens'))).toBe(false);
});
