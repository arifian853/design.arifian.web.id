import { specimenIds } from './specimen-ids';
/** Public-safe authored showcase metadata. No source documents or retrieval data. */
export const categories = [
  {slug:'actions', name:'Actions', summary:'Clear intent, deliberate response.'},
  {slug:'forms', name:'Forms', summary:'Input with context and useful feedback.'},
  {slug:'navigation', name:'Navigation', summary:'Location, movement and progressive detail.'},
  {slug:'feedback', name:'Feedback', summary:'Make every state understandable.'},
  {slug:'overlays', name:'Overlays', summary:'Focused tasks with a clear way back.'},
  {slug:'data-display', name:'Data display', summary:'Structure that makes information readable.'},
  {slug:'media', name:'Media', summary:'Frames, galleries and close inspection.'},
  {slug:'layout', name:'Layout', summary:'Sharp surfaces, flexible compositions.'},
] as const;
export type Category = typeof categories[number]['slug'];
export type CatalogKind = 'component' | 'motion' | 'pattern';
export type CatalogEntry = {slug:string;name:string;summary:string;category:Category;kind:CatalogKind;original:boolean;origin:'Arifian Original'|'shadcn / Base UI'|'Original composition';license:'MIT'|'Project terms';status:'preview';tags:string[];states:string[];motion:string};
const specimenStates: Record<string, string[]> = {
  button:['Default','Focus','Disabled','Confirmation'], 'button-group':['Default','Saved','Preview'],
  'toggle-group':['Selected','Unselected','Focus'], 'copy-button':['Default','Copied','Unavailable'],
  'loading-button':['Ready','Pending','Complete'], input:['Default','Focus'], textarea:['Default','Editing','Limit'],
  'selection-controls':['Checked','Unchecked','Selected'], select:['Closed','Open','Selected'], slider:['Default','Adjusted'],
  otp:['Empty','Partial','Complete'], validation:['Default','Invalid','Valid'], 'file-input':['Empty','Selected'],
  'chat-composer':['Empty','Conversation','Error'], tabs:['Overview','Activity'], accordion:['Expanded','Collapsed'],
  command:['Results','No results'], pagination:['First','Middle','Last'], 'step-navigation':['Current','Completed'],
  alert:['Visible','Dismissed'], toast:['Hidden','Confirmed','Dismissed'], 'status-badge':['Ready','In review','Draft','Needs attention'],
  progress:['Partial','Complete','Reset'], skeleton:['Loading'], 'empty-state':['Empty','Created'],
  'message-board':['Note','Reply','Composing'], dialog:['Closed','Open','Confirmed'], sheet:['Closed','Open'],
  tooltip:['Rest','Hover','Focus'], 'project-preview':['Closed','Open'], table:['Ascending','Descending'],
  'file-tree':['Expanded','Collapsed'], carousel:['First','Selected','Last','Full size'], compare:['Monochrome','Mixed','Color'],
  'spotlight-card':['Rest','Pointer','Focus'], 'fade-reveal':['Rest','Replay','Static'],
  'stagger-reveal':['Rest','Replay','Static'], 'rotating-text':['Phrase','Next phrase','Static'],
  'active-indicator':['Overview','Notes','Activity','Static'], presence:['Visible','Hidden','Static'],
  'expand-collapse':['Expanded','Collapsed','Static'], 'number-ticker':['Initial','Changed','Static'],
  'spotlight-motion':['Rest','Pointer','Static'], settings:['Editing','Saved'], 'search-results':['Results','Empty'],
  'file-browser':['Selected file'], kanban:['To do','In progress','Done'], chat:['Empty','Conversation','Error'],
  messages:['Note','Reply','Composing'], 'project-gallery':['Results','Empty','Selected','Full size'],
};
const component = (slug:string,name:string,category:Category,summary:string,original=false,tags:string[]=[]):CatalogEntry => ({slug,name,category,summary,original,kind:'component',origin:original?'Arifian Original':'shadcn / Base UI',license:original?'Project terms':'MIT',status:'preview',tags,states:specimenStates[slug] ?? ['Default'],motion:'150–300ms feedback where relevant. Reduced motion removes travel.'});
const composed = (slug:string,name:string,category:Category,summary:string,kind:CatalogKind):CatalogEntry => ({...component(slug,name,category,summary,kind==='motion'),kind,license:'Project terms',origin:'Original composition',tags:[kind,'keyboard','responsive'],motion:kind==='motion'?'Replay on demand. Reduced motion removes spatial transitions.':'Bounded interaction; reduced motion removes spatial transitions.'});
export const catalog:CatalogEntry[] = [
  component('button','Button','actions','Primary, secondary and destructive actions with visible state.',false,['disabled','loading']),
  component('button-group','Button group','actions','Keep related actions together without competing emphasis.',true),
  component('toggle-group','Segmented control','actions','Choose a single view with arrow-key navigation.',false,['keyboard']),
  component('copy-button','Copy action','actions','Copy a sample label with success and failure feedback.',true),
  component('loading-button','Loading action','actions','Prevent duplicate actions while a local task finishes.',true),
  component('input','Text field','forms','A label, a useful hint and a clear focus boundary.'),
  component('textarea','Textarea','forms','Multiline input with a visible character budget.',true),
  component('selection-controls','Selection controls','forms','Checkbox, switch and radio choices with explicit labels.'),
  component('select','Select','forms','A keyboard-operable list with readable selected values.'),
  component('slider','Range slider','forms','Adjust a continuous value with arrows or touch.'),
  component('otp','Verification code','forms','A single field for a six-digit code with predictable keyboard entry.'),
  component('validation','Form validation','forms','Inline errors linked to the field that needs attention.',true),
  component('file-input','File selection','forms','Choose a local file and inspect its name without uploading.',true),
  component('chat-composer','Prompt composer','forms','Suggestions, a text area and a clear send action.',true,['chat']),
  component('tabs','Tabs','navigation','Switch peer content with the standard keyboard pattern.',false,['keyboard']),
  component('breadcrumb','Breadcrumb','navigation','Show the path and label the current location.'),
  component('accordion','Accordion','navigation','Reveal supporting detail without losing the overview.'),
  component('command','Command search','navigation','Filter a local action list and select with the keyboard.'),
  component('pagination','Pagination','navigation','Bounded page navigation with a visible current position.',true),
  component('step-navigation','Step navigation','navigation','A labeled sequence with current and completed steps.',true),
  component('alert','Alert','feedback','Persistent feedback with an explicit dismiss action.'),
  component('toast','Feedback toast','feedback','A brief confirmation that can be dismissed.',true),
  component('status-badge','Status badge','feedback','Readable labels communicate meaning beyond color.',true),
  component('progress','Progress','feedback','A named completion indicator with an exact value.'),
  component('skeleton','Skeleton','feedback','Preserve content footprint during a loading state.'),
  component('empty-state','Empty state','feedback','A helpful recovery action for an empty collection.'),
  component('message-board','Message & reply','feedback','A local note, a structured reply and a composer.',true,['messages']),
  component('dialog','Dialog','overlays','A focused decision with focus trapping and Escape dismissal.',false,['keyboard']),
  component('sheet','Side sheet','overlays','Inspect a secondary task without losing context.'),
  component('tooltip','Tooltip','overlays','Short supporting text available on hover and keyboard focus.'),
  component('project-preview','Project preview','overlays','An inspectable project summary with a sharp overlay.',true),
  component('table','Sortable table','data-display','Sort synthetic records with a semantic header control.',true),
  component('bar-chart','Bar chart','data-display','Compare labeled values on an honest shared scale.',true),
  component('line-chart','Line chart','data-display','Follow a time series with an exact data alternative.',true),
  component('donut-chart','Donut chart','data-display','Show a labeled part-to-whole relationship with exact values.',true),
  component('timeline','Activity timeline','data-display','Make a short chronological sequence easy to scan.',true),
  component('file-tree','File tree','data-display','Expand folders with native keyboard-operable disclosure.',true),
  component('carousel','Project carousel','media','Thumbnail selection, bounded navigation and a full-screen view.',true),
  component('compare','Before / after','media','Move a comparison boundary without relying on hover.',true),
  component('avatar','Avatar group','media','Initial-based fallbacks keep people recognizable.',true),
  component('crt-frame','CRT media frame','media','A small, static terminal companion inside a tactile frame.',true),
  component('spotlight-card','Spotlight card','layout','A restrained pointer light that keeps the surface still.',true),
  component('profile-bento','Profile bento','layout','A portable profile composition with synthetic content.',true),
  component('stats-card','Stats card','layout','A clear value, unit and compact trend.',true),
  component('quote-card','Quote card','layout','A source-labeled thought with editorial hierarchy.',true),
  component('skill-grid','Skill grid','layout','Small capabilities arranged in a responsive grid.',true),
  component('section-heading','Section heading','layout','A line, an eyebrow and a deliberately weighted heading.',true),
  component('tech-strip','Technology strip','layout','A compact, labeled set with focusable supporting notes.',true),
  composed('fade-reveal','Fade reveal','layout','Replay a restrained entry while keeping the content readable.','motion'),
  composed('stagger-reveal','Stagger reveal','layout','A short sequence establishes an order of attention.','motion'),
  composed('rotating-text','Rotating text','layout','Advance a phrase on demand with a quiet presence transition.','motion'),
  composed('active-indicator','Active indicator','navigation','A shared-layout marker connects related views.','motion'),
  composed('presence','Presence transition','feedback','Add and remove a small activity row.','motion'),
  composed('expand-collapse','Expand / collapse','layout','Reveal additional content with a bounded height transition.','motion'),
  composed('number-ticker','Number ticker','data-display','A single value changes after a deliberate action.','motion'),
  composed('spotlight-motion','Pointer spotlight','layout','A local highlight follows a fine pointer and stays static on touch.','motion'),
  composed('dashboard','Dashboard','data-display','A compact overview composed from metrics, chart and records.','pattern'),
  composed('settings','Settings form','forms','A coherent preferences task with explicit local save feedback.','pattern'),
  composed('search-results','Filter + results','navigation','Search a synthetic project collection and recover from no results.','pattern'),
  composed('file-browser','File browser','data-display','Folder navigation paired with a selected-file inspector.','pattern'),
  composed('kanban','Task board','layout','Move tasks between labeled stages with accessible controls.','pattern'),
  composed('chat','Chat conversation','forms','Suggestions and structured responses in a local scripted conversation.','pattern'),
  composed('messages','Message board','feedback','Write a temporary note and inspect its reply state.','pattern'),
  composed('project-gallery','Project gallery','media','A project index with a focused carousel and lightbox.','pattern'),
];
export const catalogCounts = {components:catalog.filter(x=>x.kind==='component').length,originals:catalog.filter(x=>x.original).length,motion:catalog.filter(x=>x.kind==='motion').length,patterns:catalog.filter(x=>x.kind==='pattern').length};
export function searchCatalog(query:string,category?:string,entries=catalog) { const q=query.trim().toLocaleLowerCase();return entries.filter(x=>(!category||category==='all'||x.category===category)&&(!q||[x.name,x.summary,...x.tags].join(' ').toLocaleLowerCase().includes(q))); }
export function validateCatalog(entries: unknown): entries is CatalogEntry[] {
  if (!Array.isArray(entries)) return false;
  const ids = new Set<string>();
  return entries.every(x => {
    if (!x || typeof x !== 'object' || typeof x.slug !== 'string' ||
      !/^[a-z][a-z0-9-]*$/.test(x.slug) || ids.has(x.slug) ||
      !categories.some(c => c.slug === x.category) ||
      !['component','motion','pattern'].includes(x.kind) ||
      !['Arifian Original','shadcn / Base UI','Original composition'].includes(x.origin) ||
      !['MIT','Project terms'].includes(x.license) ||
      typeof x.original !== 'boolean' || (x.original && x.license !== 'Project terms') ||
      x.status !== 'preview' || ![x.name,x.summary,x.motion].every(value => typeof value === 'string' && value.trim()) ||
      ![x.tags,x.states].every(value => Array.isArray(value) && value.every(item => typeof item === 'string')) ||
      !specimenIds.includes(x.slug as typeof specimenIds[number]) ||
      /private\/|__local|sourceText|bookshelf/i.test(JSON.stringify(x))) return false;
    ids.add(x.slug);
    return true;
  });
}
