import { specimenIds } from './specimen-ids';

/** Public-safe display metadata. No implementation payload or private retrieval fields. */
export const categories = [
  { slug: 'actions', name: 'Actions', summary: 'Clear intent, deliberate response.' },
  { slug: 'forms', name: 'Forms', summary: 'Input with context and useful feedback.' },
  { slug: 'navigation', name: 'Navigation', summary: 'Location, movement and progressive detail.' },
  { slug: 'feedback', name: 'Feedback', summary: 'Make every state understandable.' },
  { slug: 'overlays', name: 'Overlays', summary: 'Focused tasks with a clear way back.' },
  { slug: 'data', name: 'Data', summary: 'Structure that makes information readable.' },
  { slug: 'media', name: 'Media', summary: 'Frames, galleries and close inspection.' },
  { slug: 'surfaces', name: 'Surfaces', summary: 'Sharp surfaces, flexible compositions.' },
] as const;
export const origins = [
  { value: 'portfolio-derived', label: 'Portfolio-derived' },
  { value: 'arifian-original', label: 'Arifian Original' },
  { value: 'shadcn-adapted', label: 'shadcn-adapted' },
  { value: 'external-inspired', label: 'External-inspired' },
] as const;
export type Category = typeof categories[number]['slug'];
export type ComponentOrigin = typeof origins[number]['value'];
export type CatalogKind = 'component' | 'motion' | 'pattern';
export type Maturity = 'stable' | 'beta' | 'experimental';
export type CatalogEntry = {
  slug: string; name: string; summary: string; category: Category; kind: CatalogKind;
  origin: ComponentOrigin; maturity: Maturity; family?: string; aliases?: string[];
  reference?: string; license?: string; tags: string[]; states: string[]; motion: string;
};
export const originLabel = (origin: ComponentOrigin) => origins.find(item => item.value === origin)!.label;
export const isOriginal = (entry: CatalogEntry) => entry.origin === 'portfolio-derived' || entry.origin === 'arifian-original';
const specimenStates: Record<string, string[]> = {
  button:['Default','Focus','Disabled','Confirmation'], 'button-group':['Default','Saved','Preview'],
  'toggle-group':['Selected','Unselected','Focus'], 'copy-button':['Default','Copied','Unavailable'],
   input:['Default','Focus'], textarea:['Default','Editing','Limit'],
  'selection-controls':['Checked','Unchecked','Selected'], select:['Closed','Open','Selected'], slider:['Default','Adjusted'],
  otp:['Empty','Partial','Complete'], validation:['Default','Invalid','Valid'],
  'chat-composer':['Empty','Conversation','Error'], tabs:['Overview','Activity'], accordion:['Expanded','Collapsed'],
  command:['Results','No results'], pagination:['First','Middle','Last'], 'step-navigation':['Current','Completed'],
  alert:['Visible','Dismissed'], toast:['Hidden','Confirmed','Error','Dismissed'], 'status-badge':['Ready','In review','Draft','Needs attention'],
  progress:['Partial','Complete','Reset'], skeleton:['Loading'], 'empty-state':['Empty','Created'],
   dialog:['Closed','Open','Confirmed'], sheet:['Closed','Open'],
  tooltip:['Rest','Hover','Focus'],  table:['Ascending','Descending'],
  'file-tree':['Expanded','Collapsed'], carousel:['First','Selected','Wrapped navigation','Full size'], compare:['Monochrome','Mixed','Color'],
  'spotlight-card':['Rest','Pointer','Focus'], reveal:['Rest','Replay','Static'],
   'rotating-text':['Phrase','Next phrase','Static'],
  'active-indicator':['Overview','Notes','Activity','Static'], presence:['Visible','Hidden','Static'],
  'expand-collapse':['Expanded','Collapsed','Static'], 'number-ticker':['Initial','Changed','Static'],
   settings:['Editing','Saved'], 'search-results':['Results','Empty'],
  'file-browser':['Selected file'], kanban:['To do','In progress','Done'], chat:['Empty','Conversation','Error'],
  messages:['Note','Reply','Composing','Loading','Empty','Error'], 'project-gallery':['Results','Empty','Selected','Full size'],
};
type EntryOptions = Partial<Pick<CatalogEntry, 'origin' | 'kind' | 'maturity' | 'family' | 'aliases' | 'reference' | 'license' | 'states' | 'tags' | 'motion'>>;
function entry(slug: string, name: string, category: Category, summary: string, options: EntryOptions = {}): CatalogEntry {
  return { slug, name, category, summary, kind: 'component', origin: 'arifian-original', maturity: 'beta',
    family: slug, tags: [], states: specimenStates[slug] ?? ['Default'],
    motion: 'Bounded feedback. Reduced motion removes spatial transitions.', ...options };
}
const base = (slug: string, name: string, category: Category, summary: string, options: EntryOptions = {}) => entry(slug, name, category, summary, {
  origin: 'shadcn-adapted', reference: `https://ui.shadcn.com/docs/components/base/${({ 'input': 'input', 'selection-controls': 'checkbox', 'otp': 'input-otp', 'toggle-group': 'toggle-group' } as Record<string,string>)[slug] ?? slug}`, license: 'shadcn/ui MIT; Base UI MIT', ...options,
});
const portfolio = (slug: string, name: string, category: Category, summary: string, options: EntryOptions = {}) => entry(slug, name, category, summary, {
  origin: 'portfolio-derived', reference: 'https://github.com/arifian853/arifian853.github.io', license: 'Owner-authored adaptation; no upstream license declared', ...options,
});
const pattern = (slug: string, name: string, category: Category, summary: string, options: EntryOptions = {}) => entry(slug, name, category, summary, { kind: 'pattern', ...options });
const study = (slug: string, name: string, category: Category, summary: string, options: EntryOptions = {}) => entry(slug, name, category, summary, { kind: 'motion', states: ['Rest', 'Replay', 'Static'], ...options });

export const catalog: CatalogEntry[] = [
  base('button', 'Button', 'actions', 'Primary, secondary and destructive actions with visible state.', { aliases: ['loading action', 'loading button'], states: ['Default', 'Secondary', 'Outline', 'Ghost', 'Destructive', 'Icon', 'Loading', 'Disabled', 'Confirmation'] }),
  entry('button-group', 'Button group', 'actions', 'Keep related actions together without competing emphasis.'),
  base('toggle-group', 'Segmented control', 'actions', 'Choose a single view with arrow-key navigation.', { tags: ['keyboard'] }),
  entry('copy-button', 'Copy button', 'actions', 'Copy a phrase, response or code with success and manual fallback feedback.', { aliases: ['copy action', 'copy response action', 'clipboard'] }),
  base('input', 'Text field', 'forms', 'A label, a useful hint and a clear focus boundary.'),
  portfolio('textarea', 'Textarea', 'forms', 'Multiline input with a visible character budget.'),
  base('selection-controls', 'Selection controls', 'forms', 'Checkbox, switch and radio choices with explicit labels.'),
  base('select', 'Select', 'forms', 'A keyboard-operable list with readable selected values.'),
  base('slider', 'Range slider', 'forms', 'Adjust a continuous value with arrows or touch.'),
  base('otp', 'Verification code', 'forms', 'A single field for a six-digit code with predictable keyboard entry.'),
  pattern('validation', 'Form validation', 'forms', 'Inline errors linked to the field that needs attention.'),
  entry('dropzone', 'Dropzone', 'forms', 'Validate local image names, types, sizes and counts through drop or native selection.', { origin: 'external-inspired', reference: 'https://www.kibo-ui.com/components/dropzone', license: 'Original implementation; reference only (Kibo UI MIT)', aliases: ['file input', 'file selection'], states: ['Empty', 'Drag over', 'Selected', 'Rejected', 'Cleared'] }),
  portfolio('chat-composer', 'Prompt composer', 'forms', 'Suggestions, a text area and a clear send action.'),
  base('tabs', 'Tabs', 'navigation', 'Switch peer content with the standard keyboard pattern.', { tags: ['keyboard'] }),
  base('breadcrumb', 'Breadcrumb', 'navigation', 'Show the path and label the current location.'),
  base('accordion', 'Accordion', 'navigation', 'Reveal supporting detail without losing the overview.'),
  base('command', 'Command search', 'navigation', 'Filter a local action list and select with the keyboard.'),
  entry('pagination', 'Pagination', 'navigation', 'Bounded page navigation with a visible current position.'),
  entry('step-navigation', 'Step navigation', 'navigation', 'A labeled sequence with current and completed steps.'),
  base('alert', 'Alert', 'feedback', 'Persistent feedback with an explicit dismiss action.'),
  entry('toast', 'Feedback toast', 'feedback', 'A brief confirmation that can be dismissed.'),
  entry('status-badge', 'Status badge', 'feedback', 'Readable labels communicate meaning beyond color.'),
  base('progress', 'Progress', 'feedback', 'A named completion indicator with an exact value.'),
  base('skeleton', 'Skeleton', 'feedback', 'Preserve content footprint during a loading state.'),
  base('empty-state', 'Empty state', 'feedback', 'A helpful recovery action for an empty collection.'),
  base('dialog', 'Dialog', 'overlays', 'A focused decision with focus trapping and Escape dismissal.', { tags: ['keyboard'] }),
  base('sheet', 'Side sheet', 'overlays', 'Inspect a secondary task without losing context.'),
  base('tooltip', 'Tooltip', 'overlays', 'Short supporting text available on hover and keyboard focus.'),
  entry('table', 'Sortable table', 'data', 'Sort synthetic records with a semantic header control.'),
  entry('chart', 'Chart gallery', 'data', 'Bar, line, area, donut, radial, radar and compact views share one family.', { aliases: ['bar chart', 'line chart', 'area chart', 'donut chart', 'radar', 'radial', 'sparkline'], states: ['Bar', 'Line', 'Area', 'Donut', 'Radial', 'Radar', 'Compact'] }),
  entry('timeline', 'Activity timeline', 'data', 'Make a short chronological sequence easy to scan.'),
  entry('file-tree', 'File tree', 'data', 'Expand folders with native keyboard-operable disclosure.'),
  portfolio('carousel', 'Project carousel', 'media', 'Thumbnail selection, bounded navigation and a full-screen view.', { aliases: ['project image carousel', 'thumbnail strip', 'project lightbox'] }),
  entry('compare', 'Before / after', 'media', 'Move a comparison boundary without relying on hover.'),
  entry('avatar', 'Avatar group', 'media', 'Initial-based fallbacks keep people recognizable.'),
  portfolio('crt-frame', 'CRT media frame', 'media', 'A small, static terminal companion inside a tactile frame.'),
  portfolio('spotlight-card', 'Spotlight card', 'surfaces', 'A restrained pointer light that keeps the surface still.'),
  pattern('profile-bento', 'About bento', 'surfaces', 'A profile, stats, quote, skills and technology composition with synthetic content.', { origin: 'portfolio-derived', reference: 'https://github.com/arifian853/arifian853.github.io', aliases: ['profile bento', 'about bento'] }),
  portfolio('stats-card', 'Stats card', 'surfaces', 'A clear value, unit and compact trend.'),
  portfolio('quote-card', 'Quote card', 'surfaces', 'A source-labeled thought with editorial hierarchy.'),
  portfolio('skill-grid', 'Skill grid', 'surfaces', 'Small capabilities arranged in a responsive grid.'),
  portfolio('section-heading', 'Section heading', 'surfaces', 'A line, an eyebrow and a deliberately weighted heading.'),
  portfolio('tech-strip', 'Technology strip', 'surfaces', 'A compact, labeled set with focusable supporting notes.'),
  study('reveal', 'Reveal', 'surfaces', 'Fade, slide, blur, stagger and split variants of one entry behavior.', { origin: 'external-inspired', reference: 'https://reactbits.dev/text-animations/blur-text', license: 'Original implementation; reference only (React Bits MIT + Commons Clause)', aliases: ['fade reveal', 'stagger reveal', 'blur fade', 'split text'] }),
  study('rotating-text', 'Rotating text', 'surfaces', 'Advance a phrase on demand with a quiet presence transition.'),
  study('active-indicator', 'Active indicator', 'navigation', 'A shared-layout marker connects related views.'),
  study('presence', 'Presence transition', 'feedback', 'Add and remove a small activity row.'),
  study('expand-collapse', 'Expand / collapse', 'surfaces', 'Reveal additional content with a bounded height transition.'),
  study('number-ticker', 'Number ticker', 'data', 'A single value changes after a deliberate action.'),
  pattern('dashboard', 'Dashboard', 'data', 'A compact overview composed from metrics, chart and records.'),
  pattern('settings', 'Settings form', 'forms', 'A coherent preferences task with explicit local save feedback.'),
  pattern('search-results', 'Filter + results', 'navigation', 'Search a synthetic project collection and recover from no results.'),
  pattern('file-browser', 'File browser', 'data', 'Folder navigation paired with a selected-file inspector.'),
  pattern('kanban', 'Task board', 'surfaces', 'Move tasks between labeled stages with accessible controls.'),
  pattern('chat', 'Chat conversation', 'forms', 'Suggestions and structured responses in a local scripted conversation.', { origin: 'portfolio-derived', reference: 'https://github.com/arifian853/arifian853.github.io' }),
  pattern('messages', 'Message board', 'feedback', 'Write a temporary note and inspect its reply state.', { origin: 'portfolio-derived', reference: 'https://github.com/arifian853/arifian853.github.io' }),
  pattern('project-gallery', 'Project gallery', 'media', 'A project index with a focused carousel and lightbox.'),
  portfolio('site-navbar', 'Portfolio navbar', 'navigation', 'Wordmark, full-width active indicator, mobile disclosure and a scrolled surface.', { aliases: ['site navbar', 'mobile navigation', 'active nav indicator'], states: ['Opening', 'Scrolled', 'Mobile open', 'Active'] }),
  portfolio('theme-toggle', 'Theme toggle', 'navigation', 'The shared light and dark preference, demonstrated as a canonical control.', { states: ['Light', 'Dark'] }),
  portfolio('scroll-top', 'Scroll to top', 'navigation', 'A return action after 300 pixels, demonstrated inside a local scroll area.', { states: ['At top', 'Available', 'Reduced motion'] }),
  portfolio('section-eyebrow', 'Section eyebrow', 'surfaces', 'A short accent rule and a compact editorial label.', { aliases: ['accent rule'] }),
  portfolio('profile-card', 'Profile card', 'surfaces', 'A sharp portrait fallback, role and related destination.'),
  portfolio('experience-item', 'Experience item', 'data', 'Date, role, context and capabilities in a reusable editorial row.', { aliases: ['experience timeline'] }),
  portfolio('featured-project', 'Featured project card', 'surfaces', 'Grayscale media, a project title and supporting metadata.'),
  portfolio('project-list-item', 'Project list item', 'surfaces', 'A numbered responsive row with project icon, tech list, year and destination.', { aliases: ['project icon', 'project tech list'], tags: ['keyboard', 'project'] }),
  portfolio('project-meta', 'Project metadata', 'data', 'Year, context and labeled technology items.', { aliases: ['project tech list', 'project year'] }),
  portfolio('project-popover', 'Project popover', 'overlays', 'Delayed native top-layer preview with CSS anchors and a viewport-clamped fallback.', { states: ['Closed', 'Delayed hover', 'Explicit open', 'Native anchor', 'Fallback', 'Dismissed'], tags: ['keyboard', 'touch', 'positioning'], motion: 'Two-second mouse dwell, 300ms transfer grace. Explicit button for keyboard/touch; Escape restores focus. Native top layer with CSS anchors; measured fixed fallback.' }),
  portfolio('project-navigation', 'Project navigation', 'navigation', 'Paired previous and next project destinations.'),
  portfolio('prompt-suggestions', 'Prompt suggestions', 'forms', 'A small suggestion group that fills the canonical composer.', { aliases: ['prompt suggestion group', 'prompt chip'], states: ['Available', 'Selected'] }),
  portfolio('ai-empty', 'AI empty state', 'feedback', 'A greeting and a clear invitation to start a local conversation.'),
  portfolio('chat-message', 'Chat message', 'feedback', 'User and assistant variants share one labeled message family.', { aliases: ['user message', 'assistant message'], states: ['User', 'Assistant', 'Long response'] }),
  portfolio('rich-response', 'Structured response', 'data', 'Readable prose, lists, links, tables and code in an authored response fixture.', { aliases: ['markdown response', 'markdown table'], tags: ['structured content', 'safe text'], motion: 'Static structured response anatomy; no Markdown or raw HTML parser is claimed.' }),
  portfolio('code-block', 'Code block', 'data', 'A named code surface with horizontal scroll and clipboard feedback.', { aliases: ['copy code'], states: ['Default', 'Copied', 'Clipboard unavailable'] }),
  portfolio('chat-error', 'Chat error', 'feedback', 'Retain context and provide a local retry action.', { aliases: ['retry action'], states: ['Interrupted', 'Retried'] }),
  portfolio('chat-welcome', 'Chat welcome dialog', 'overlays', 'A titled, dismissible introduction to a scripted conversation.'),
  portfolio('message-item', 'Message item', 'feedback', 'An anonymous note with timestamp and optional reply content.', { aliases: ['message timestamp'] }),
  portfolio('message-reply', 'Message reply', 'feedback', 'A labeled response separated by an indented accent rule.'),
  portfolio('message-composer', 'Message composer', 'forms', 'A local anonymous note with a character budget and disabled empty submit.', { aliases: ['anonymous message composer', 'character counter'], states: ['Empty', 'Editing', 'Limit', 'Added'] }),
  base('dropdown-menu', 'Dropdown menu', 'overlays', 'Grouped local actions with typeahead, arrow navigation and focus return.'),
  base('popover', 'Popover', 'overlays', 'An anchored editable task with a title and explicit completion action.'),
  base('hover-card', 'Hover card', 'overlays', 'Nonessential supporting context on pointer hover or link focus.'),
  base('context-menu', 'Context menu', 'overlays', 'Project actions available through pointer, long press and keyboard context menu.'),
  base('menubar', 'Menubar', 'navigation', 'Peer application menus with coordinated arrow-key navigation.'),
  base('navigation-menu', 'Navigation menu', 'navigation', 'Progressive resource links in a compact menu.'),
  base('collapsible', 'Collapsible', 'surfaces', 'One supporting section controlled by an explicit disclosure.'),
  base('drawer', 'Drawer', 'overlays', 'A bottom review surface with focus management, touch gestures and dismissal.'),
  base('combobox', 'Combobox', 'forms', 'Searchable single and multiple selection with removable values.', { aliases: ['multi select', 'autocomplete'], states: ['Empty', 'Filtered', 'Selected', 'Multiple', 'No results'] }),
  entry('calendar', 'Calendar', 'forms', 'An authored month grid with roving date focus, month navigation and selection.', { states: ['Month', 'Selected', 'Keyboard focus'], tags: ['keyboard', 'date'] }),
  entry('date-picker', 'Date picker', 'forms', 'The canonical calendar inside a Base UI popover, with ordered date-range selection.', { aliases: ['date range picker'], states: ['Closed', 'Single date', 'Range start', 'Range complete', 'Cleared'] }),
  entry('sidebar', 'Sidebar', 'navigation', 'A bounded workspace navigation with active content and an explicit collapse action.'),
  base('scroll-area', 'Scroll area', 'surfaces', 'A keyboard-focusable viewport with a draggable scrollbar and native scrolling.'),
  entry('resizable', 'Resizable panels', 'surfaces', 'A bounded split with pointer capture and arrow-key resize controls.', { states: ['Default', 'Dragging', 'Keyboard', 'Minimum', 'Maximum'] }),
  entry('aspect-ratio', 'Aspect ratio', 'media', 'One media frame, three ratios, stable image coverage.'),
  entry('kbd', 'Keyboard key', 'data', 'Compact semantic key labels that document the composer shortcuts.', { aliases: ['kbd', 'keyboard shortcut'] }),
  entry('spinner', 'Spinner', 'feedback', 'Activity with a readable status and a still reduced-motion state.', { aliases: ['typing state', 'loading state'], states: ['Busy', 'Ready', 'Reduced motion'], license: 'Lucide ISC' }),
  base('number-field', 'Number field', 'forms', 'Bounded numeric input with keyboard and labeled step actions.'),
  entry('tags-input', 'Tags input', 'forms', 'Add, merge and remove small labels with native form behavior.', { origin: 'external-inspired', reference: 'https://www.kibo-ui.com/components/tags', license: 'Original implementation; reference only (Kibo UI MIT)', states: ['Empty', 'Added', 'Duplicate merged', 'Removed'] }),
  entry('color-picker', 'Color picker', 'forms', 'A native swatch control and approved presets, scoped to its preview.', { states: ['Preset', 'Custom local swatch'] }),
  entry('rating', 'Rating', 'forms', 'A native radio scale with text labels and arrow-key selection.'),
  entry('terminal', 'Terminal', 'data', 'A scripted command transcript with explicit run and reset controls.', { origin: 'external-inspired', reference: 'https://magicui.design/docs/components/terminal', license: 'Original implementation; reference only (Magic UI MIT)', states: ['Ready', 'Complete', 'Reset'] }),
  portfolio('hero-composition', 'Hero composition', 'surfaces', 'Eyebrow, editorial title, CTA group, ambient accent and scroll hint.', { kind: 'pattern', aliases: ['hero CTA group', 'scroll hint', 'ambient terracotta glow'] }),
  portfolio('footer-composition', 'Footer composition', 'surfaces', 'Dashed division, compact metadata and a static CRT media treatment.', { kind: 'pattern', aliases: ['dashed divider'] }),
  portfolio('project-detail', 'Project detail', 'media', 'A project header, metadata, carousel, lightbox and related navigation.', { kind: 'pattern', aliases: ['project detail header'] }),
  pattern('chroma-project-grid', 'Chroma project grid', 'media', 'A grayscale project index with bounded color reveal and an equivalent focus treatment.', { origin: 'external-inspired', reference: 'https://reactbits.dev/components/chroma-grid', license: 'Original implementation; reference only (React Bits MIT + Commons Clause)', tags: ['pointer', 'keyboard', 'project'] }),
  pattern('onboarding', 'Guided introduction', 'navigation', 'A short sequence with explicit progress, previous step and replay controls.'),
  pattern('code-comparison', 'Code comparison', 'data', 'Compare a vague action label with a clearer result, using the canonical code block.', { origin: 'external-inspired', reference: 'https://magicui.design/docs/components/code-comparison', license: 'Original implementation; reference only (Magic UI MIT)' }),
  study('text-type', 'Text type', 'surfaces', 'A short on-demand typing study with an always-readable accessible label.', { origin: 'external-inspired', reference: 'https://reactbits.dev/text-animations/text-type', license: 'Original implementation; reference only (React Bits MIT + Commons Clause)' }),
  study('scroll-progress', 'Scroll progress', 'navigation', 'Reading position inside a local native-scroll passage.', { origin: 'external-inspired', reference: 'https://magicui.design/docs/components/scroll-progress', license: 'Original implementation; reference only (Magic UI MIT)', states: ['Start', 'Reading', 'Complete'] }),
  study('marquee', 'Marquee', 'surfaces', 'An opt-in, pausable label sequence with a static reduced-motion alternative.', { origin: 'external-inspired', reference: 'https://magicui.design/docs/components/marquee', license: 'Original implementation; reference only (Magic UI MIT)', states: ['Static', 'Playing', 'Paused', 'Reduced motion'] }),

];
export const originalCollection = catalog.filter(isOriginal);
export const catalogCounts = {
  components: catalog.filter(entry => entry.kind === 'component').length,
  originals: originalCollection.length,
  motion: catalog.filter(entry => entry.kind === 'motion').length,
  patterns: catalog.filter(entry => entry.kind === 'pattern').length,
};
export function specimenHref(entry: CatalogEntry) {
  return `${entry.kind === 'component' ? `/components/${entry.category}/` : entry.kind === 'motion' ? '/motion/' : '/patterns/'}#${entry.slug}`;
}
export function searchCatalog(query: string, category?: string, entries = catalog, origin?: string) {
  const q = query.trim().toLocaleLowerCase();
  return entries.filter(entry => (!category || category === 'all' || entry.category === category)
    && (!origin || origin === 'all' || entry.origin === origin)
    && (!q || [entry.name, entry.summary, ...(entry.aliases ?? []), ...entry.tags, ...entry.states, entry.motion].join(' ').toLocaleLowerCase().includes(q)));
}
export type CatalogFilters = { query: string; category: string; origin: string };
export function readCatalogFilters(search: string): CatalogFilters {
  const params = new URLSearchParams(search);
  const category = params.get('category'); const origin = params.get('origin');
  return { query: params.get('q') ?? '', category: categories.some(item => item.slug === category) ? category! : 'all',
    origin: origins.some(item => item.value === origin) ? origin! : 'all' };
}
export function writeCatalogFilters(url: URL, filters: CatalogFilters) {
  const next = new URL(url);
  for (const [key, value] of [['q', filters.query], ['category', filters.category], ['origin', filters.origin]]) {
    if (!value || value === 'all') next.searchParams.delete(key); else next.searchParams.set(key, value);
  }
  return next;
}
export function validateCatalog(entries: unknown): entries is CatalogEntry[] {
  if (!Array.isArray(entries)) return false;
  const ids = new Set<string>(); const families = new Set<string>();
  const allowed = new Set(['slug','name','summary','category','kind','origin','maturity','family','aliases','reference','license','tags','states','motion']);
  const strings = (value: unknown) => Array.isArray(value) && value.every(item => typeof item === 'string' && item.trim());
  return entries.every(entry => {
    if (!entry || typeof entry !== 'object' || Object.keys(entry).some(key => !allowed.has(key)) ||
      typeof entry.slug !== 'string' || !/^[a-z][a-z0-9-]*$/.test(entry.slug) || ids.has(entry.slug) ||
      !categories.some(item => item.slug === entry.category) || !['component','motion','pattern'].includes(entry.kind) ||
      !origins.some(item => item.value === entry.origin) || !['stable','beta','experimental'].includes(entry.maturity) ||
      ![entry.name,entry.summary,entry.motion].every(value => typeof value === 'string' && value.trim()) ||
      !strings(entry.tags) || !strings(entry.states) || (entry.aliases !== undefined && !strings(entry.aliases)) ||
      (entry.family !== undefined && (typeof entry.family !== 'string' || !/^[a-z][a-z0-9-]*$/.test(entry.family))) ||
      (entry.license !== undefined && (typeof entry.license !== 'string' || !entry.license.trim())) ||
      (entry.reference !== undefined && (typeof entry.reference !== 'string' || !/^https:\/\/[^\s]+$/.test(entry.reference))) ||
      (entry.origin === 'external-inspired' && !entry.reference) ||
      !specimenIds.includes(entry.slug as typeof specimenIds[number]) ||
      /private[\\/]|__local|sourceText|bookshelf/i.test(JSON.stringify(entry))) return false;
    const family = entry.family ?? entry.slug;
    if (families.has(family)) return false;
    ids.add(entry.slug); families.add(family); return true;
  });
}
