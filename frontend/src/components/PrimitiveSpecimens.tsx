import { renderSpecimen } from './SpecimenBody';
import { useEffect, useId, useRef, useState } from 'react';
import { Menu } from '@base-ui/react/menu';
import { ContextMenu } from '@base-ui/react/context-menu';
import { Menubar } from '@base-ui/react/menubar';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { Popover } from '@base-ui/react/popover';
import { PreviewCard } from '@base-ui/react/preview-card';
import { Collapsible } from '@base-ui/react/collapsible';
import { Drawer } from '@base-ui/react/drawer';
import { Combobox } from '@base-ui/react/combobox';
import { ScrollArea } from '@base-ui/react/scroll-area';
import { NumberField } from '@base-ui/react/number-field';
import { LoaderCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Field, FieldDescription, FieldLabel } from './ui/field';
import { DemoState, demoProjects } from './PortfolioSpecimens';
import { normalizeRange } from '../lib/interaction-state';

function MenuItems({ onAction }: { onAction: (value:string)=>void }) {
  return <Menu.Group><Menu.GroupLabel className="primitive-group-label">Collection</Menu.GroupLabel>{['New note','Duplicate study','Archive draft'].map(label=><Menu.Item key={label} className="primitive-menu-item" onClick={()=>onAction(label)}>{label}</Menu.Item>)}<Menu.Item disabled className="primitive-menu-item">Publish (unavailable)</Menu.Item></Menu.Group>;
}
export function DropdownMenuStudy() {
  const [action,setAction] = useState('No action selected.');
  return <div className="stack"><Menu.Root><Menu.Trigger render={<Button variant="outline"/>}>Collection actions ↓</Menu.Trigger><Menu.Portal><Menu.Positioner sideOffset={8} className="primitive-positioner"><Menu.Popup className="primitive-popup"><MenuItems onAction={setAction}/></Menu.Popup></Menu.Positioner></Menu.Portal></Menu.Root><DemoState>{action}</DemoState></div>;
}
export function ContextMenuStudy() {
  const [action,setAction] = useState('Right click, long press, or use Shift + F10 on the preview.');
  return <div className="stack"><ContextMenu.Root><ContextMenu.Trigger className="context-target" role="region" tabIndex={0} aria-label="Project context menu target">Atlas / synthetic project</ContextMenu.Trigger><ContextMenu.Portal><ContextMenu.Positioner className="primitive-positioner"><ContextMenu.Popup className="primitive-popup"><ContextMenu.Group>{['Inspect project','Add to collection','Reset preview'].map(label=><ContextMenu.Item className="primitive-menu-item" key={label} onClick={()=>setAction(label)}>{label}</ContextMenu.Item>)}</ContextMenu.Group></ContextMenu.Popup></ContextMenu.Positioner></ContextMenu.Portal></ContextMenu.Root><DemoState>{action}</DemoState></div>;
}
export function MenubarStudy() {
  const [action,setAction] = useState('Choose a menu. Arrow keys move between menus and items.');
  return <div className="stack"><Menubar className="primitive-menubar" aria-label="Sample editor menus">{['File','Edit','View'].map(label=><Menu.Root key={label}><Menu.Trigger className="primitive-trigger">{label}</Menu.Trigger><Menu.Portal><Menu.Positioner sideOffset={8} className="primitive-positioner"><Menu.Popup className="primitive-popup"><MenuItems onAction={value=>setAction(`${label}: ${value}`)}/></Menu.Popup></Menu.Positioner></Menu.Portal></Menu.Root>)}</Menubar><DemoState>{action}</DemoState></div>;
}
export function NavigationMenuStudy() {
  return <NavigationMenu.Root className="primitive-navigation" aria-label="Resource specimen"><NavigationMenu.List className="cluster">{[['Explore','/components/','Components'],['Learn','/foundations/','Foundations']].map(([label,href,title])=><NavigationMenu.Item key={label}><NavigationMenu.Trigger className="primitive-trigger">{label} ↓</NavigationMenu.Trigger><NavigationMenu.Content className="primitive-nav-content"><NavigationMenu.Link className="text-link" href={href}>{title} ↗</NavigationMenu.Link><p>Shared parts for a considered interface.</p></NavigationMenu.Content></NavigationMenu.Item>)}</NavigationMenu.List><NavigationMenu.Portal><NavigationMenu.Positioner sideOffset={8} className="primitive-positioner"><NavigationMenu.Popup className="primitive-popup"><NavigationMenu.Viewport/></NavigationMenu.Popup></NavigationMenu.Positioner></NavigationMenu.Portal></NavigationMenu.Root>;
}
export function PopoverStudy() {
  const [saved,setSaved] = useState(false); const id = useId();
  return <div className="stack"><Popover.Root><Popover.Trigger render={<Button variant="outline"/>}>Edit collection note</Popover.Trigger><Popover.Portal><Popover.Positioner sideOffset={8} className="primitive-positioner"><Popover.Popup className="primitive-popup stack"><Popover.Title className="primitive-title">Collection note</Popover.Title><Popover.Description>A small task anchored to its action.</Popover.Description><Field><FieldLabel htmlFor={id}>Short label</FieldLabel><Input id={id} name="short-label" autoComplete="off" defaultValue="Field notes" maxLength={60}/></Field><Popover.Close render={<Button/>} onClick={()=>setSaved(true)}>Save note</Popover.Close></Popover.Popup></Popover.Positioner></Popover.Portal></Popover.Root><DemoState>{saved?'Note saved in this preview.':'Open the note to edit its label.'}</DemoState></div>;
}
export function HoverCardStudy() {
  const [open,setOpen] = useState(false);
  return <div className="stack"><PreviewCard.Root open={open} onOpenChange={setOpen}><PreviewCard.Trigger className="text-link" href="/about/" onFocus={()=>setOpen(true)} onKeyDown={event=>{if(event.key==='Escape')setOpen(false);}}>Field notes studio ↗</PreviewCard.Trigger><PreviewCard.Portal><PreviewCard.Positioner sideOffset={8} className="primitive-positioner"><PreviewCard.Popup className="primitive-popup stack"><strong>Field notes studio</strong><p>A synthetic team exploring useful tools and quiet details.</p><span className="muted">Supporting context / no required actions</span></PreviewCard.Popup></PreviewCard.Positioner></PreviewCard.Portal></PreviewCard.Root><p className="muted">Hover or focus the link. Follow it for the full context.</p></div>;
}
export function CollapsibleStudy() { return <Collapsible.Root className="stack"><Collapsible.Trigger render={<Button variant="outline"/>}>Show supporting detail</Collapsible.Trigger><Collapsible.Panel className="primitive-collapse"><p>A compact disclosure for one supporting section. It stays distinct from a multi-section accordion.</p></Collapsible.Panel></Collapsible.Root>; }
export function DrawerStudy() {
  return <Drawer.Root><Drawer.Trigger render={<Button variant="outline"/>}>Open review drawer</Drawer.Trigger><Drawer.Portal><Drawer.Backdrop className="primitive-backdrop"/><Drawer.Viewport className="primitive-drawer-viewport"><Drawer.Popup className="primitive-drawer"><Drawer.Content className="stack"><Drawer.Title className="primitive-title">Review the collection</Drawer.Title><Drawer.Description>A bottom drawer with keyboard focus, dismissal and touch gestures.</Drawer.Description><p>Atlas · Editorial study · Ready for review.</p><Drawer.Close render={<Button variant="outline"/>}>Close review</Drawer.Close></Drawer.Content></Drawer.Popup></Drawer.Viewport></Drawer.Portal></Drawer.Root>;
}
const frameworks = ['Astro','React','Svelte','Vue'];
export function ComboboxStudy({ multiple = false }: { multiple?: boolean }) {
  const id = useId(); const [value,setValue] = useState<string | null>('Astro'); const [values,setValues] = useState<string[]>(['Astro']);
  return <div className="stack"><Combobox.Root items={frameworks} multiple={multiple} value={multiple?values:value} onValueChange={next=>{if(Array.isArray(next))setValues(next);else setValue(next);}}><Field><FieldLabel htmlFor={id}>{multiple?'Project frameworks':'Find a framework'}</FieldLabel><Combobox.Input id={id} autoComplete="off" name="framework" className="primitive-input" placeholder="Search frameworks…"/>{multiple && <Combobox.Chips className="cluster">{values.map(item=><Combobox.Chip className="tag-chip" key={item}>{item}<Combobox.ChipRemove aria-label={`Remove ${item}`}>×</Combobox.ChipRemove></Combobox.Chip>)}</Combobox.Chips>}</Field><Combobox.Portal><Combobox.Positioner sideOffset={8} className="primitive-positioner"><Combobox.Popup className="primitive-popup"><Combobox.Empty className="primitive-group-label">No frameworks found.</Combobox.Empty><Combobox.List>{(item:string)=><Combobox.Item key={item} value={item} className="primitive-menu-item"><Combobox.ItemIndicator>✓ </Combobox.ItemIndicator>{item}</Combobox.Item>}</Combobox.List></Combobox.Popup></Combobox.Positioner></Combobox.Portal></Combobox.Root><DemoState>Selected: {multiple?values.join(', ')||'none':value||'none'}</DemoState></div>;
}
function iso(date: Date) { return date.toISOString().slice(0,10); }
function dateFrom(value: string) { return new Date(`${value}T12:00:00Z`); }
export function Calendar({ selected = [], onSelect }: { selected?: string[]; onSelect?: (day:string)=>void }) {
  const [month,setMonth] = useState('2026-10-01'); const [focus,setFocus] = useState('2026-10-12'); const [local,setLocal] = useState('');
  const ref = useRef<HTMLTableElement>(null); const focusNext = useRef(false);
  const date = dateFrom(month); const title = date.toLocaleDateString('en-GB',{month:'long',year:'numeric',timeZone:'UTC'});
  const offset = (date.getUTCDay()+6)%7; const days = new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0,12)).getUTCDate();
  const cells = Array.from({length:Math.ceil((offset+days)/7)*7},(_,index)=>index>=offset&&index<offset+days?iso(new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),index-offset+1,12))):null);
  useEffect(()=>{if(focusNext.current){ref.current?.querySelector<HTMLButtonElement>(`[data-day="${focus}"]`)?.focus();focusNext.current=false;}},[focus,month]);
  function changeMonth(delta:number) { const next = new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+delta,1,12));setMonth(iso(next));setFocus(iso(next)); }
  function key(event:React.KeyboardEvent,day:string) {
    const next = dateFrom(day); const key = event.key;
    if(key==='ArrowRight')next.setUTCDate(next.getUTCDate()+1);else if(key==='ArrowLeft')next.setUTCDate(next.getUTCDate()-1);else if(key==='ArrowDown')next.setUTCDate(next.getUTCDate()+7);else if(key==='ArrowUp')next.setUTCDate(next.getUTCDate()-7);else if(key==='Home')next.setUTCDate(next.getUTCDate()-(next.getUTCDay()+6)%7);else if(key==='End')next.setUTCDate(next.getUTCDate()+6-(next.getUTCDay()+6)%7);else if(key==='PageDown'||key==='PageUp'){
      const currentDay=next.getUTCDate();next.setUTCDate(1);next.setUTCMonth(next.getUTCMonth()+(key==='PageDown'?1:-1));const last=new Date(Date.UTC(next.getUTCFullYear(),next.getUTCMonth()+1,0)).getUTCDate();next.setUTCDate(Math.min(currentDay,last));
    }else return;
    event.preventDefault();const value=iso(next);focusNext.current=true;setFocus(value);setMonth(`${value.slice(0,7)}-01`);
  }
  return <div className="calendar-specimen stack"><div className="calendar-heading"><Button variant="ghost" aria-label="Previous month" onClick={()=>changeMonth(-1)}>←</Button><strong aria-live="polite">{title}</strong><Button variant="ghost" aria-label="Next month" onClick={()=>changeMonth(1)}>→</Button></div><table ref={ref} role="grid" aria-label={title}><thead><tr>{['Mo','Tu','We','Th','Fr','Sa','Su'].map(day=><th scope="col" key={day}>{day}</th>)}</tr></thead><tbody>{Array.from({length:cells.length/7},(_,row)=><tr key={row}>{cells.slice(row*7,row*7+7).map((day,column)=><td key={day??`blank-${column}`} role="gridcell" aria-selected={day ? selected.includes(day)||local===day : undefined}>{day&&<button type="button" data-day={day} tabIndex={focus===day?0:-1} onFocus={()=>setFocus(day)} onKeyDown={event=>key(event,day)} onClick={()=>{setLocal(day);onSelect?.(day);}} aria-label={dateFrom(day).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})}>{Number(day.slice(-2))}</button>}</td>)}</tr>)}</tbody></table>{!onSelect&&<DemoState>{local?`Selected: ${local}`:'Use arrows to navigate, Enter to choose.'}</DemoState>}</div>;
}
export function DatePickerStudy() {
  const [range,setRange] = useState(false); const [days,setDays] = useState<string[]>([]); const [open,setOpen] = useState(false);
  function choose(day:string) { if(range){setDays(previous=>previous.length===1?normalizeRange(previous[0],day):[day]);}else{setDays([day]);setOpen(false);} }
  return <div className="stack"><label className="check-label"><input type="checkbox" checked={range} onChange={event=>{setRange(event.target.checked);setDays([]);}}/>Select a date range</label><Popover.Root open={open} onOpenChange={setOpen}><Popover.Trigger render={<Button variant="outline"/>}>{days.length?days.join(' → '):range?'Choose date range':'Choose a date'}</Popover.Trigger><Popover.Portal><Popover.Positioner sideOffset={8} className="primitive-positioner"><Popover.Popup className="primitive-popup stack"><Popover.Title className="primitive-title">{range?'Choose two dates':'Choose a date'}</Popover.Title><Popover.Description>Use arrows for days; Page Up and Page Down for months.</Popover.Description><Calendar selected={days} onSelect={choose}/><Popover.Close render={<Button variant="outline"/>}>Done</Popover.Close></Popover.Popup></Popover.Positioner></Popover.Portal></Popover.Root><DemoState>{days.length?`Selected: ${days.join(' to ')}`:'No date selected.'}</DemoState><Button variant="ghost" disabled={!days.length} onClick={()=>setDays([])}>Clear dates</Button></div>;
}
export function SidebarStudy() {
  const [open,setOpen] = useState(true); const [active,setActive] = useState('Overview'); const id = useId();
  return <div className="stack"><Button variant="outline" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(value=>!value)}>{open?'Collapse':'Expand'} sidebar</Button><div className="sidebar-preview" data-expanded={open}><nav id={id} hidden={!open} aria-label="Workspace specimen">{['Overview','Collections','Activity'].map(label=><Button key={label} variant="ghost" aria-current={active===label?'page':undefined} onClick={()=>setActive(label)}>{label}</Button>)}</nav><section aria-label={`${active} panel`}><p className="eyebrow">SAMPLE WORKSPACE</p><h3>{active}</h3><p>A compact navigation surface with an explicit collapse action.</p></section></div></div>;
}
export function ScrollAreaStudy() { return <ScrollArea.Root className="scroll-area-root"><ScrollArea.Viewport className="scroll-area-viewport" tabIndex={0} aria-label="Scrollable sample notes"><ScrollArea.Content><ol>{Array.from({length:12},(_,index)=><li key={index}><strong>Field note {String(index+1).padStart(2,'0')}</strong><p>Enough context to return to an idea later.</p></li>)}</ol></ScrollArea.Content></ScrollArea.Viewport><ScrollArea.Scrollbar className="scroll-area-bar"><ScrollArea.Thumb className="scroll-area-thumb"/></ScrollArea.Scrollbar></ScrollArea.Root>; }
export function ResizableStudy() {
  const [value,setValue] = useState(40); const ref = useRef<HTMLDivElement>(null); const leftId=useId();
  const set = (next:number)=>setValue(Math.max(20,Math.min(80,next)));
  return <div className="stack"><div className="resizable-preview" ref={ref} style={{gridTemplateColumns:`minmax(0,${value}fr) 12px minmax(0,${100-value}fr)`}}><div id={leftId}><strong>Collection</strong><p>Notes and references.</p></div><div className="resize-handle" role="separator" aria-orientation="vertical" aria-label="Resize collection panel" aria-controls={leftId} aria-valuemin={20} aria-valuemax={80} aria-valuenow={value} tabIndex={0} onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);}} onPointerMove={event=>{if(!event.currentTarget.hasPointerCapture(event.pointerId))return;const bounds=ref.current!.getBoundingClientRect();set(Math.round((event.clientX-bounds.left)/bounds.width*100));}} onPointerUp={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}} onKeyDown={event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();set(event.key==='Home'?20:event.key==='End'?80:value+(event.key==='ArrowLeft'?-5:5));}}}>⋮</div><div><strong>Inspector</strong><p>A little detail when you need it.</p></div></div><DemoState>Collection width: {value}%. Drag the divider or use arrow keys.</DemoState></div>;
}
export function AspectRatioStudy() { const [ratio,setRatio]=useState('16 / 9');return <div className="stack"><div className="cluster" role="group" aria-label="Media aspect ratio">{['16 / 9','4 / 3','1 / 1'].map(value=><Button key={value} variant="outline" aria-pressed={value===ratio} onClick={()=>setRatio(value)}>{value}</Button>)}</div><div className="aspect-ratio-preview" style={{aspectRatio:ratio}}><img src={demoProjects[0].image} alt="Synthetic Atlas composition in a responsive frame" width="960" height="600" loading="lazy"/></div></div>; }
export function KbdStudy() { return <div className="stack"><p>Send a prompt <kbd>Enter</kbd></p><p>Add a line <kbd>Shift</kbd> + <kbd>Enter</kbd></p><p className="muted">These keys are demonstrated in the canonical chat composer.</p></div>; }
export function SpinnerStudy() { const [busy,setBusy]=useState(true);return <div className="stack"><div role="status" className="cluster">{busy&&<LoaderCircle className="activity-spinner" aria-hidden="true"/>}{busy?'Preparing a preview…':'Preview ready.'}</div><Button variant="outline" onClick={()=>setBusy(value=>!value)}>{busy?'Finish preview':'Restart preview'}</Button></div>; }
export function NumberFieldStudy() { const id=useId();return <Field><FieldLabel htmlFor={id}>Collection size</FieldLabel><NumberField.Root id={id} defaultValue={12} min={1} max={24}><NumberField.Group className="number-field-group"><NumberField.Decrement className="primitive-trigger" aria-label="Decrease collection size">−</NumberField.Decrement><NumberField.Input name="collection-size" className="primitive-input"/><NumberField.Increment className="primitive-trigger" aria-label="Increase collection size">+</NumberField.Increment></NumberField.Group></NumberField.Root><FieldDescription>1 to 24 references. Use arrows or the step controls.</FieldDescription></Field>; }

export const primitiveRenderers = {
  'dropdown-menu': DropdownMenuStudy,
  'popover': PopoverStudy,
  'hover-card': HoverCardStudy,
  'context-menu': ContextMenuStudy,
  'menubar': MenubarStudy,
  'navigation-menu': NavigationMenuStudy,
  'collapsible': CollapsibleStudy,
  'drawer': DrawerStudy,
  'combobox': () => <div className="stack"><ComboboxStudy/><ComboboxStudy multiple/></div>,
  'calendar': Calendar,
  'date-picker': DatePickerStudy,
  'sidebar': SidebarStudy,
  'scroll-area': ScrollAreaStudy,
  'resizable': ResizableStudy,
  'aspect-ratio': AspectRatioStudy,
  'kbd': KbdStudy,
  'spinner': SpinnerStudy,
  'number-field': NumberFieldStudy,
};
export function PrimitiveSpecimen({ slug }: { slug: string }) { return renderSpecimen(slug, primitiveRenderers); }
