import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { catalog } from '../src/lib/catalog';
import { specimenRenderers } from '../src/components/Specimens';
import { fallbackPopoverPosition, nextCarouselIndex, normalizeRange, acceptLocalFiles, addTag } from '../src/lib/interaction-state';
import { ChatComposer, ChatMessage, MessageItem, MessageReply, RichResponse, ProjectListItem, demoProjects } from '../src/components/PortfolioSpecimens';

test('portfolio parity has canonical renderers and honest provenance', () => {
  for (const slug of ['site-navbar','theme-toggle','scroll-top','section-eyebrow','hero-composition','profile-card','project-list-item','project-popover','featured-project','carousel','chat-composer','chat-message','rich-response','code-block','prompt-suggestions','ai-empty','chat-error','chat-welcome','message-item','message-reply','message-composer','footer-composition']) {
    expect(catalog.find(e => e.slug === slug)?.origin).toBe('portfolio-derived');
    expect(specimenRenderers[slug as keyof typeof specimenRenderers]).toBeFunction();
  }
});
test('priority primitives have renderers without fake duplicate families', () => {
  for (const slug of ['dropdown-menu','popover','hover-card','context-menu','menubar','navigation-menu','collapsible','drawer','combobox','calendar','date-picker','sidebar','scroll-area','resizable','aspect-ratio','kbd','spinner']) expect(catalog.find(e => e.slug === slug)?.kind).toBe('component');
});
test('viewport fallback stays inside small and desktop windows', () => {
  for (const [w,h] of [[320,568],[1440,900]]) {
    const p = fallbackPopoverPosition({left:w-40,right:w,bottom:h-10,top:h-80},w,h,300,180);
    expect(p.left).toBeGreaterThanOrEqual(12); expect(p.left+p.width).toBeLessThanOrEqual(w-12);
    expect(p.top).toBeGreaterThanOrEqual(12); expect(p.top+180).toBeLessThanOrEqual(h-12);
  }
});
test('carousel bounds and date range ordering are deterministic', () => {
  expect(nextCarouselIndex(0,-1,3)).toBe(2); expect(nextCarouselIndex(2,1,3)).toBe(0);
  expect(nextCarouselIndex(0,1,0)).toBe(0);
  expect(normalizeRange('2026-10-28','2026-10-03')).toEqual(['2026-10-03','2026-10-28']);
});
test('local dropzone rejects size and type without inspecting contents', () => {
  expect(acceptLocalFiles([{name:'note.txt',type:'text/plain',size:1}]).error).toContain('image');
  expect(acceptLocalFiles([{name:'large.png',type:'image/png',size:6_000_000}]).error).toContain('5 MB');
  expect(acceptLocalFiles([{name:'study.png',type:'image/png',size:100}]).names).toEqual(['study.png']);
  expect(addTag(['React'],' react ')).toEqual(['React']); expect(addTag(['React'],'Astro')).toEqual(['React','Astro']);
});
test('message and project families render reusable semantic anatomy with synthetic content', () => {
  const project = renderToStaticMarkup(<ProjectListItem project={demoProjects[0]} index={1}/>);
  expect(project).toContain('Tech stack'); expect(project).toContain('Atlas');
  expect(renderToStaticMarkup(<ChatComposer onSend={()=>{}}/>)).toContain('Your prompt');
  expect(renderToStaticMarkup(<ChatMessage role="assistant"><RichResponse/></ChatMessage>)).toContain('<table');
  expect(renderToStaticMarkup(<MessageItem text="A note"/>)).toContain('<time');
  expect(renderToStaticMarkup(<MessageReply/>)).toContain('Author reply');
});

test('message-board state previews reuse feedback anatomy', () => {
  const Board = specimenRenderers.messages;
  const html=renderToStaticMarkup(<Board/>);
  expect(html).toContain('Board preview state');
  expect(html).toContain('Loading');expect(html).toContain('Empty');expect(html).toContain('Error');
});
