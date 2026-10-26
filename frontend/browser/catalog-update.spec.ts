import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { catalog, categories } from '../src/lib/catalog';

async function specimen(page:Page,id:string) {
  const card=page.locator(`article#${id}`);await card.scrollIntoViewIfNeeded();
  await expect(card.locator('astro-island[ssr]')).toHaveCount(0);return card;
}
test('primary taxonomy and full item underline preserve hover and keyboard focus',async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  for(const route of ['/foundations/','/components/','/components/forms/','/patterns/','/motion/','/originals/']) {
    await page.goto(route,{waitUntil:'networkidle'});
    const nav=page.getByRole('navigation',{name:'Main navigation',exact:true});
    await expect(nav.getByRole('link')).toHaveText(['Foundations','Components','Patterns','Motion','Originals']);
    const active=nav.locator('[aria-current="page"]');await expect(active).toHaveCount(1);
    const expectedActiveHref=route.startsWith('/components/')?'/components/':route;await expect(active).toHaveAttribute('href',expectedActiveHref);
    const box=await active.evaluate(link=>{const item=link.getBoundingClientRect();const line=getComputedStyle(link,'::after');const range=document.createRange();range.selectNodeContents(link);return {item:item.width,text:range.getBoundingClientRect().width,line:parseFloat(line.width),left:line.left,right:line.right,position:line.position};});
    expect(box.line).toBeCloseTo(box.item,1);expect(box.item).toBeGreaterThan(box.text+10);expect(box.left).toBe('0px');expect(box.right).toBe('0px');expect(box.position).toBe('absolute');
    await active.focus();await expect(active).toHaveCSS('outline-style','solid');await active.hover();
    expect(await active.evaluate(el=>parseFloat(getComputedStyle(el,'::after').width))).toBeCloseTo(box.item,1);
  }
  await page.setViewportSize({width:390,height:844});await page.goto('/components/');
  await page.locator('.mobile-navigation summary').click();
  await expect(page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link')).toHaveText(['Foundations↗','Components↗','Patterns↗','Motion↗','Originals↗']);
});
test('category origin and alias search survive reload, history navigation and clearing',async({page})=>{
  await page.goto('/components/?category=media&origin=portfolio-derived&q=thumbnail',{waitUntil:'networkidle'});
  const search=page.getByRole('searchbox',{name:'Find a component'});const origin=page.getByLabel('Origin',{exact:true});
  await expect(search).toHaveValue('thumbnail');await expect(origin).toHaveValue('portfolio-derived');
  await expect(page.locator('.index-card')).toHaveCount(1);await expect(page.locator('.index-card')).toContainText('Project carousel');
  await origin.selectOption('shadcn-adapted');await expect(page.getByText('No matching components',{exact:true})).toBeVisible();
  await expect(search).toHaveValue('thumbnail');await expect(page.getByRole('button',{name:'Media',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.reload({waitUntil:'networkidle'});await expect(origin).toHaveValue('shadcn-adapted');
  await page.getByRole('button',{name:'Clear filters'}).click();await expect(search).toHaveValue('');await expect(origin).toHaveValue('all');await expect(page).toHaveURL(/\/components\/$/);
  await origin.selectOption('portfolio-derived');await search.fill('project');
  await page.locator('.index-card').first().click();await page.goBack({waitUntil:'networkidle'});
  await expect(origin).toHaveValue('portfolio-derived');await expect(search).toHaveValue('project');
});
test('all category counts and curated originals come from the canonical catalog',async({page})=>{
  await page.goto('/components/',{waitUntil:'networkidle'});
  await expect(page.locator('.index-card')).toHaveCount(catalog.filter(e=>e.kind==='component').length);
  for(const category of categories){await page.getByRole('button',{name:category.name,exact:true}).click();await expect(page.locator('.index-card')).toHaveCount(catalog.filter(e=>e.kind==='component'&&e.category===category.slug).length);}
  await page.goto('/originals/',{waitUntil:'networkidle'});
  await expect(page.locator('.specimen-card')).toHaveCount(catalog.filter(e=>['portfolio-derived','arifian-original'].includes(e.origin)).length);
  await page.goto('/workbench/',{waitUntil:'networkidle'});await expect(page).toHaveURL(/\/components\/$/);
});
test('project popover opens by keyboard and fallback remains inside the viewport',async({page})=>{
  for(const width of [320,1440]){
    await page.setViewportSize({width,height:900});await page.goto('/components/overlays/',{waitUntil:'networkidle'});
    const card=await specimen(page,'project-popover');await card.getByLabel('Force positioning fallback').check();
    const trigger=card.getByRole('button',{name:'Quick preview Atlas'});await trigger.focus();await page.keyboard.press('Enter');
    const popup=page.getByRole('region',{name:'Atlas quick preview'});await expect(popup).toBeVisible();await expect(popup).toHaveAttribute('data-positioning','fallback');
    const bounds=await popup.boundingBox();expect(bounds).not.toBeNull();expect(bounds!.x).toBeGreaterThanOrEqual(0);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(width);expect(bounds!.y).toBeGreaterThanOrEqual(0);expect(bounds!.y+bounds!.height).toBeLessThanOrEqual(900);
    await page.keyboard.press('Escape');await expect(popup).toHaveCount(0);await expect(trigger).toBeFocused();
    await card.getByLabel('Force positioning fallback').uncheck();await trigger.click();await expect(popup).toBeVisible();await page.keyboard.press('Escape');
  }
});
test('menus popover and drawer support keyboard dismissal and focus return',async({page})=>{
  await page.goto('/components/overlays/',{waitUntil:'networkidle'});
  const menu=await specimen(page,'dropdown-menu');const trigger=menu.getByRole('button',{name:'Collection actions'});await trigger.focus();await page.keyboard.press('ArrowDown');await expect(page.getByRole('menu')).toBeVisible();await page.keyboard.press('Home');await page.keyboard.press('Enter');await expect(menu.getByRole('status')).toContainText('New note');await expect(trigger).toBeFocused();
  const popover=await specimen(page,'popover');const edit=popover.getByRole('button',{name:'Edit collection note'});await edit.click();await expect(page.getByRole('dialog',{name:'Collection note'})).toBeVisible();await page.keyboard.press('Escape');await expect(edit).toBeFocused();
  const drawer=await specimen(page,'drawer');const review=drawer.getByRole('button',{name:'Open review drawer'});await review.click();const dialog=page.getByRole('dialog',{name:'Review the collection'});await expect(dialog).toBeVisible();for(let i=0;i<4;i++){await page.keyboard.press('Tab');expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true);}await page.keyboard.press('Escape');await expect(review).toBeFocused();
});
test('combobox date range and resizable panels expose working keyboard controls',async({page})=>{
  await page.goto('/components/forms/',{waitUntil:'networkidle'});
  const combo=await specimen(page,'combobox');const input=combo.getByRole('combobox',{name:'Find a framework'});await input.fill('Rea');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');await expect(combo.getByRole('status').first()).toContainText('React');
  const dates=await specimen(page,'date-picker');await dates.getByLabel('Select a date range').check();await dates.getByRole('button',{name:'Choose date range'}).click();await page.getByRole('button',{name:'28 October 2026',exact:true}).click();await page.getByRole('button',{name:'3 October 2026',exact:true}).click();await page.getByRole('button',{name:'Done',exact:true}).click();await expect(dates.getByRole('status')).toContainText('2026-10-03 to 2026-10-28');
  await page.goto('/components/surfaces/',{waitUntil:'networkidle'});const panels=await specimen(page,'resizable');const handle=panels.getByRole('separator',{name:'Resize collection panel'});await handle.focus();await page.keyboard.press('End');await expect(handle).toHaveAttribute('aria-valuenow','80');await page.keyboard.press('Home');await expect(handle).toHaveAttribute('aria-valuenow','20');
});
test('composer handles multiline, submit, pending and retry locally',async({page})=>{
  const sent:string[]=[];page.on('request',request=>{if(request.method()!=='GET')sent.push(request.url());});
  await page.goto('/patterns/',{waitUntil:'networkidle'});const chat=await specimen(page,'chat');const input=chat.getByLabel('Your prompt');await chat.getByRole('button',{name:'Help me simplify a form',exact:true}).click();await expect(input).toHaveValue('Help me simplify a form');await input.focus();await page.keyboard.press('Shift+Enter');await page.keyboard.type('Keep its labels.');await expect(input).toHaveValue(/\n/);await page.keyboard.press('Enter');await expect(chat.getByRole('log')).toContainText('Keep its labels.');await expect(chat.getByRole('button',{name:'Send prompt'})).toBeDisabled();await expect(chat.getByRole('log').getByRole('table')).toBeVisible();await chat.getByRole('button',{name:'Preview error'}).click();await expect(chat.getByText('Response interrupted',{exact:true})).toBeVisible();await chat.getByRole('button',{name:'Retry response'}).click();await expect(chat.getByText('Response interrupted',{exact:true})).toHaveCount(0);expect(sent).toEqual([]);
});
test('carousel keys stay in scope and work inside the lightbox',async({page})=>{
  await page.goto('/components/media/',{waitUntil:'networkidle'});const carousel=await specimen(page,'carousel');const trigger=carousel.getByRole('button',{name:'Enlarge Atlas'});await trigger.focus();await page.keyboard.press('ArrowLeft');await expect(carousel.getByRole('button',{name:'Enlarge Index'})).toBeVisible();await carousel.getByRole('button',{name:'Enlarge Index'}).click();await expect(page.getByRole('dialog',{name:'Index',exact:true})).toBeVisible();await page.keyboard.press('ArrowRight');await expect(page.getByRole('dialog',{name:'Atlas',exact:true})).toBeVisible();await page.keyboard.press('Escape');await expect(carousel.getByRole('button',{name:'Enlarge Atlas'})).toBeFocused();
});
test('expanded specimens remain sharp, responsive and accessible in both themes and reduced motion',async({page})=>{
  test.setTimeout(180_000);await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [320,768,1440]){await page.setViewportSize({width,height:1000});for(const theme of ['light','dark']){await page.goto('/',{waitUntil:'networkidle'});await page.evaluate(value=>{document.documentElement.dataset.theme=value;localStorage.setItem('arifian-design-theme-v1',value);},theme);for(const path of ['/components/navigation/','/components/forms/','/components/overlays/','/components/surfaces/','/motion/','/patterns/']){await page.goto(path,{waitUntil:'networkidle'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);}}}
});

test('message-board previews loading, empty, error, retry and a temporary note',async({page})=>{
  await page.goto('/patterns/',{waitUntil:'networkidle'});const board=await specimen(page,'messages');const states=board.getByLabel('Board preview state');
  await states.selectOption('Loading');await expect(board.getByRole('status',{name:'Loading messages'})).toBeVisible();
  await states.selectOption('Empty');await expect(board.getByText('No notes yet',{exact:true})).toBeVisible();
  await board.getByLabel('Leave a temporary note').fill('A local example.');await states.selectOption('Error');await expect(board.getByLabel('Leave a temporary note')).toHaveValue('A local example.');await board.getByRole('button',{name:'Retry notes'}).click();await board.getByRole('button',{name:'Add note'}).click();await expect(board.getByRole('log')).toContainText('A local example.');
});

test('context menu, hover context, menubar, resource menu and disclosure remain operable',async({page})=>{
  await page.goto('/components/overlays/',{waitUntil:'networkidle'});
  const context=await specimen(page,'context-menu');await context.getByRole('region',{name:'Project context menu target'}).focus();await page.keyboard.press('Shift+F10');await expect(page.getByRole('menu')).toBeVisible();await page.getByRole('menuitem',{name:'Inspect project',exact:true}).click();await expect(context.getByRole('status')).toContainText('Inspect project');
  const hover=await specimen(page,'hover-card');await hover.getByRole('link',{name:'Field notes studio'}).focus();await expect(page.locator('.primitive-popup').filter({hasText:'A synthetic team'})).toBeVisible();await page.keyboard.press('Escape');
  await page.goto('/components/navigation/',{waitUntil:'networkidle'});
  const bar=await specimen(page,'menubar');await bar.getByRole('menuitem',{name:'File',exact:true}).focus();await page.keyboard.press('ArrowDown');await expect(page.getByRole('menu')).toBeVisible();await page.keyboard.press('Escape');
  const resources=await specimen(page,'navigation-menu');await resources.getByRole('button',{name:'Explore'}).click();await expect(page.locator('.primitive-popup').getByRole('link',{name:'Components'})).toBeVisible();await page.keyboard.press('Escape');
  await page.goto('/components/surfaces/',{waitUntil:'networkidle'});const disclosure=await specimen(page,'collapsible');const toggle=disclosure.getByRole('button',{name:'Show supporting detail'});await toggle.focus();await page.keyboard.press('Enter');await expect(toggle).toHaveAttribute('aria-expanded','true');await expect(disclosure.getByText('A compact disclosure for one supporting section.',{exact:false})).toBeVisible();
});
test('calendar roving focus, local file validation and tags expose usable feedback',async({page})=>{
  await page.goto('/components/forms/',{waitUntil:'networkidle'});
  const calendar=await specimen(page,'calendar');await calendar.getByRole('button',{name:'12 October 2026',exact:true}).focus();await page.keyboard.press('ArrowRight');await expect(calendar.getByRole('button',{name:'13 October 2026',exact:true})).toBeFocused();await page.keyboard.press('Enter');await expect(calendar.getByRole('status')).toContainText('2026-10-13');
  const drop=await specimen(page,'dropzone');await drop.getByLabel('Local reference images').setInputFiles({name:'note.txt',mimeType:'text/plain',buffer:Buffer.from('synthetic note')});await expect(drop.getByRole('status')).toContainText('Choose a PNG');
  const tags=await specimen(page,'tags-input');await tags.getByLabel('Collection tags').fill('Editorial');await tags.getByRole('button',{name:'Add tag',exact:true}).click();await expect(tags.getByRole('status')).toContainText('2 tags');await tags.getByLabel('Collection tags').fill('Research');await tags.getByRole('button',{name:'Add tag',exact:true}).click();await expect(tags.getByRole('status')).toContainText('3 tags');await tags.getByRole('button',{name:'Remove Research'}).click();await expect(tags.getByRole('status')).toContainText('2 tags');
});
