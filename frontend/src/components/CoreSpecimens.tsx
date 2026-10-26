import { renderSpecimen } from './SpecimenBody';
import ChartGallery, { Chart } from './ChartGallery';
import * as Portfolio from './PortfolioSpecimens';
import { nextCarouselIndex } from '../lib/interaction-state';
import { useMotionPreference } from '../lib/use-motion-preference';
import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'motion/react';
import { ArrowRight, Check, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet, FieldLegend } from './ui/field';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Progress } from './ui/progress';
import { Skeleton } from './ui/skeleton';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from './ui/empty';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { moveTask, sampleRecords, sortRecords, type Task } from '../lib/demo-state';

const projects = [
  { name: 'Atlas', image: '/studies/atlas.svg', description: 'An editorial field guide with room for the details.' },
  { name: 'Fieldwork', image: '/studies/fieldwork.svg', description: 'A quiet workspace for collecting ideas.' },
  { name: 'Index', image: '/studies/index.svg', description: 'Everyday objects, carefully arranged.' },
];
const State = ({ children }: { children: React.ReactNode }) => <p className="demo-state" role="status">{children}</p>;

function ButtonStudy() {
  const [done, setDone] = useState(false);
  return <div className="stack"><div className="cluster"><Button onClick={() => setDone(true)}>Create project <ArrowRight data-icon="inline-end" /></Button><Button variant="outline" onClick={() => setDone(false)}>Reset</Button><Button variant="secondary" onClick={() => setDone(true)}>Save a draft</Button><Button variant="ghost" onClick={() => setDone(false)}>Clear selection</Button><Button disabled>Unavailable</Button></div><Dialog><DialogTrigger render={<Button variant="destructive" />}>Discard draft</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Discard this sample draft?</DialogTitle><DialogDescription>This resets only the local demonstration.</DialogDescription></DialogHeader><div className="cluster"><DialogClose render={<Button variant="destructive" />} onClick={() => setDone(false)}>Discard draft</DialogClose><DialogClose render={<Button variant="outline" />}>Keep draft</DialogClose></div></DialogContent></Dialog><LoadingAction /><State>{done ? 'Project created in this preview.' : 'Ready when you are.'}</State></div>;
}
function ButtonGroup() {
  const [message, setMessage] = useState('Draft ready for your next step.');
  return <div className="stack"><div className="action-group" role="group" aria-label="Draft actions"><Button onClick={() => setMessage('Draft saved in this preview.')}>Save draft</Button><Button variant="outline" onClick={() => setMessage('Preview opened below.')}>Preview</Button><Button variant="ghost" onClick={() => setMessage('Draft ready for your next step.')}>Reset</Button></div><State>{message}</State>{message === 'Preview opened below.' && <p className="tab-copy">Field notes · A collection of everyday observations.</p>}</div>;
}
function Pagination() {
  const [value, setValue] = useState(1);
  return <div className="stack"><div className="cluster"><Button variant="outline" disabled={value === 1} onClick={() => setValue(x => x - 1)}>Previous</Button><Button variant="outline" disabled={value === 3} onClick={() => setValue(x => x + 1)}>Next <ArrowRight data-icon="inline-end" /></Button></div><State>Page {value} of 3</State></div>;
}
function Segments() {
  const [value, setValue] = useState(['Grid']);
  return <div className="stack"><ToggleGroup value={value} onValueChange={next => next.length && setValue(next)} aria-label="Collection view" variant="outline">{['Grid', 'List', 'Detail'].map(item => <ToggleGroupItem key={item} value={item}>{item}</ToggleGroupItem>)}</ToggleGroup><State>{value[0]} view selected.</State></div>;
}
function CopyAction() { return <div className="stack"><p className="sample-phrase">Make room for the details.</p><Portfolio.CopyText text="Make room for the details." label="Copy phrase"/><p className="muted">The same action is composed into response and code specimens.</p></div>; }
function LoadingAction() {
  const [phase, setPhase] = useState<'ready' | 'pending' | 'done'>('ready');
  useEffect(() => { if (phase !== 'pending') return; const timer = setTimeout(() => setPhase('done'), 900); return () => clearTimeout(timer); }, [phase]);
  return <div className="stack"><Button disabled={phase === 'pending'} onClick={() => setPhase('pending')}>{phase === 'pending' ? 'Saving…' : phase === 'done' ? 'Save again' : 'Save changes'}</Button><State>{phase === 'done' ? 'Changes saved in this preview.' : phase === 'pending' ? 'Saving in this preview…' : 'A short, local task.'}</State></div>;
}
function TextField() {
  const id = useId();
  return <Field><FieldLabel htmlFor={id}>Project name</FieldLabel><Input id={id} name="project-name" autoComplete="off" placeholder="An everyday collection…" aria-describedby={`${id}-hint`} /><FieldDescription id={`${id}-hint`}>Give this project a recognizable name.</FieldDescription></Field>;
}
function TextArea() {
  const id = useId(); const [text, setText] = useState('A little space to think.');
  return <Field><FieldLabel htmlFor={id}>Project note</FieldLabel><Textarea id={id} name="note" maxLength={160} value={text} onChange={event => setText(event.target.value)} aria-describedby={`${id}-count`} /><FieldDescription id={`${id}-count`}>{text.length} / 160 characters</FieldDescription></Field>;
}
function Selections() {
  const id = useId();
  return <FieldGroup><Field orientation="horizontal"><Checkbox id={`${id}-check`} aria-label="Include a project summary" defaultChecked /><FieldLabel htmlFor={`${id}-check`}>Include a project summary</FieldLabel></Field><Field orientation="horizontal"><Switch id={`${id}-switch`} aria-label="Receive preview reminders" /><FieldLabel htmlFor={`${id}-switch`}>Receive preview reminders</FieldLabel></Field><FieldSet><FieldLegend>Visibility</FieldLegend><RadioGroup defaultValue="personal" aria-label="Visibility">{['personal', 'team'].map(value => { const label = value === 'personal' ? 'Personal' : 'Team'; return <label className="cluster" key={value}><RadioGroupItem value={value} aria-label={label} />{label}</label>; })}</RadioGroup></FieldSet></FieldGroup>;
}
function SelectStudy() {
  const id = useId(); const [value, setValue] = useState<string | null>('Editorial');
  return <Field><FieldLabel htmlFor={id}>Project type</FieldLabel><Select items={['Editorial', 'Application', 'Collection'].map(label => ({ label, value: label }))} value={value} onValueChange={setValue}><SelectTrigger id={id}><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{['Editorial', 'Application', 'Collection'].map(item => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectGroup></SelectContent></Select><FieldDescription>{value} selected.</FieldDescription></Field>;
}
function SliderStudy() {
  const [value, setValue] = useState([48]);
  return <div className="stack"><p>Preview spacing: <strong>{value[0]}px</strong></p><Slider aria-label="Preview spacing" min={8} max={96} step={4} value={value} onValueChange={next => setValue(Array.isArray(next) ? next : [next])} /><div className="spacing-preview" style={{ padding: `${value[0] / 2}px` }}><span>Room to breathe</span></div></div>;
}
function Verification() {
  const id = useId(); const [value, setValue] = useState('');
  return <Field><FieldLabel htmlFor={id}>Verification code</FieldLabel><Input id={id} name="verification" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={value} onChange={event => setValue(event.target.value.replace(/\D/g, '').slice(0, 6))} className="verification-input" placeholder="000000" aria-describedby={`${id}-hint`} /><FieldDescription id={`${id}-hint`}>{value.length === 6 ? 'Six digits entered. This is a demonstration.' : 'Enter six digits. Paste is supported.'}</FieldDescription></Field>;
}
function Validation() {
  const id = useId(); const ref = useRef<HTMLInputElement>(null); const [error, setError] = useState(''); const [saved, setSaved] = useState(false);
  return <form noValidate onSubmit={event => { event.preventDefault(); const value = ref.current?.value ?? ''; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setError('Enter an email address, such as alex@example.test.'); setSaved(false); ref.current?.focus(); } else { setError(''); setSaved(true); } }}><FieldGroup><Field data-invalid={!!error}><FieldLabel htmlFor={id}>Email address</FieldLabel><Input ref={ref} id={id} name="email" type="email" autoComplete="email" spellCheck={false} placeholder="alex@example.test…" aria-invalid={!!error} aria-describedby={`${id}-hint`} /><FieldDescription id={`${id}-hint`}>{error || 'Used only for this specimen. Nothing is sent.'}</FieldDescription></Field><Button type="submit">Check address</Button><State>{saved ? 'Address looks good. Nothing was sent.' : error ? 'The address needs attention.' : 'Try an incomplete address to see the error state.'}</State></FieldGroup></form>;
}
function TabsStudy() {
  return <Tabs defaultValue="overview"><TabsList aria-label="Project information" variant="line"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList><TabsContent value="overview"><p className="tab-copy">A small collection, carefully considered.</p></TabsContent><TabsContent value="activity"><p className="tab-copy">The project summary was updated today.</p></TabsContent></Tabs>;
}
function BreadcrumbStudy() {
  return <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="/components/">Components</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="/components/navigation/">Navigation</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Current project</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>;
}
function AccordionStudy() {
  return <Accordion defaultValue={['purpose']}><AccordionItem value="purpose"><AccordionTrigger>What belongs in a collection?</AccordionTrigger><AccordionContent>Related ideas, useful references and enough context to return to them later.</AccordionContent></AccordionItem><AccordionItem value="detail"><AccordionTrigger>How much detail is enough?</AccordionTrigger><AccordionContent>Start with a name and a clear description. Add detail when it helps the next decision.</AccordionContent></AccordionItem></Accordion>;
}
function CommandStudy() {
  const id = useId(); const [query, setQuery] = useState('');
  const actions = [['Explore components', '/components/'], ['Read foundations', '/foundations/'], ['View motion', '/motion/']];
  const matches = actions.filter(([label]) => label.toLowerCase().includes(query.toLowerCase()));
  return <div className="stack"><Field><FieldLabel htmlFor={id}>Find a destination</FieldLabel><Input id={id} name="destination" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try foundations…" autoComplete="off" /></Field><ul className="command-results">{matches.map(([label, href]) => <li key={href}><a href={href}>{label}<ArrowRight aria-hidden="true" /></a></li>)}</ul><State>{matches.length ? `${matches.length} destinations. Use Tab to reach a result.` : 'No destinations found. Try another word.'}</State></div>;
}
function Steps() {
  const [step, setStep] = useState(0); const labels = ['Details', 'Review', 'Ready'];
  return <div className="stack"><ol className="steps">{labels.map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined}><span>{index < step ? '✓' : `0${index + 1}`}</span>{label}</li>)}</ol><div className="cluster"><Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button><Button disabled={step === 2} onClick={() => setStep(step + 1)}>Continue</Button></div><State>Current step: {labels[step]}</State></div>;
}
function AlertStudy() {
  const [visible, setVisible] = useState(true);
  return visible ? <Alert><Check aria-hidden="true" /><AlertTitle>All changes saved</AlertTitle><AlertDescription>This collection is ready for a review.</AlertDescription><Button variant="ghost" onClick={() => setVisible(false)}>Dismiss notice</Button></Alert> : <Button variant="outline" onClick={() => setVisible(true)}>Restore notice</Button>;
}
function ToastStudy() {
  const [visible,setVisible]=useState(false);const [error,setError]=useState(false);
  return <div className="stack"><label className="check-label"><input type="checkbox" checked={error} onChange={event=>setError(event.target.checked)}/>Preview error feedback</label><Button variant="outline" onClick={()=>setVisible(true)}>Show confirmation</Button><div role="status" aria-live="polite">{visible&&<div className="toast-sample" data-error={error}>{error?<X aria-hidden="true"/>:<Check aria-hidden="true"/>}<span>{error?'Preview could not be saved. Try again.':'Saved to your collection.'}</span><Button size="icon-sm" variant="ghost" aria-label="Dismiss confirmation" onClick={()=>setVisible(false)}><X/></Button></div>}</div></div>;
}
function StatusBadges() { return <div className="cluster"><Badge>Ready</Badge><Badge variant="secondary">In review</Badge><Badge variant="outline">Draft</Badge><Badge variant="destructive">Needs attention</Badge></div>; }
function ProgressStudy() {
  const [value, setValue] = useState(40);
  return <div className="stack"><p>Review progress <strong>{value}%</strong></p><Progress value={value} aria-label="Review progress" /><div className="cluster"><Button variant="outline" disabled={value === 100} onClick={() => setValue(x => Math.min(100, x + 20))}>Complete a step</Button><Button variant="ghost" onClick={() => setValue(0)}>Reset progress</Button></div></div>;
}
function SkeletonStudy() { return <div className="stack" role="status" aria-label="Loading project preview"><Skeleton className="skeleton-media" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /><span className="muted">Loading project preview…</span></div>; }
function EmptyStudy() {
  const [recovered, setRecovered] = useState(false);
  return recovered ? <Alert><AlertTitle>Collection created</AlertTitle><AlertDescription>Your first collection is ready.</AlertDescription><Button variant="outline" onClick={() => setRecovered(false)}>Reset specimen</Button></Alert> : <Empty><EmptyHeader><EmptyTitle>No collections yet</EmptyTitle><EmptyDescription>Start with one idea. There is room for the rest.</EmptyDescription></EmptyHeader><EmptyContent><Button onClick={() => setRecovered(true)}><Plus data-icon="inline-start" />Create collection</Button></EmptyContent></Empty>;
}
function DialogStudy() {
  const [saved, setSaved] = useState(false);
  return <div className="stack"><Dialog><DialogTrigger render={<Button variant="outline" />}>Review collection</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Ready for a review?</DialogTitle><DialogDescription>This demonstration changes local state only.</DialogDescription></DialogHeader><p>Atlas contains three references and a short project note.</p><div className="cluster"><DialogClose render={<Button />} onClick={() => setSaved(true)}>Mark as reviewed</DialogClose><DialogClose render={<Button variant="outline" />}>Cancel</DialogClose></div></DialogContent></Dialog><State>{saved ? 'Collection marked as reviewed.' : 'Review the details before confirming.'}</State></div>;
}
function SheetStudy() {
  return <Sheet><SheetTrigger render={<Button variant="outline" />}>Open details</SheetTrigger><SheetContent><SheetHeader><SheetTitle>Collection details</SheetTitle><SheetDescription>A little context for the next decision.</SheetDescription></SheetHeader><dl className="inspector"><dt>Name</dt><dd>Atlas</dd><dt>Type</dt><dd>Editorial</dd><dt>Status</dt><dd>In review</dd></dl><SheetClose render={<Button variant="outline" />}>Close details</SheetClose></SheetContent></Sheet>;
}
function TooltipStudy() {
  return <TooltipProvider><Tooltip><TooltipTrigger render={<Button variant="outline" />}>Why a short name?</TooltipTrigger><TooltipContent>Short names are easier to scan in a list.</TooltipContent></Tooltip><p className="demo-state">Focus or hover for supporting context.</p></TooltipProvider>;
}
export function RecordTable() {
  const [ascending, setAscending] = useState(true);
  return <div className="table-wrap"><Table><caption className="sr-only">Synthetic project records</caption><TableHeader><TableRow><TableHead aria-sort={ascending ? 'ascending' : 'descending'}><Button variant="ghost" onClick={() => setAscending(x => !x)}>Project <span aria-hidden="true">{ascending ? '↑' : '↓'}</span></Button></TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{sortRecords(sampleRecords, ascending).map(row => <TableRow key={row.name}><TableCell>{row.name}</TableCell><TableCell>{row.type}</TableCell><TableCell><Badge variant="outline">{row.state}</Badge></TableCell></TableRow>)}</TableBody></Table></div>;
}
function Timeline() { return <ol className="timeline"><li><time>09:00</time><div><strong>Collection created</strong><p>A new place for field notes.</p></div></li><li><time>10:30</time><div><strong>Three references added</strong><p>Enough context to get started.</p></div></li><li><time>11:15</time><div><strong>Ready for a review</strong><p>The first draft is in place.</p></div></li></ol>; }
function FileTree() {
  const [selected, setSelected] = useState('Overview.txt');
  const leaf = (name:string) => <li key={name}><Button variant="ghost" aria-pressed={selected === name} onClick={() => setSelected(name)}>{name}</Button></li>;
  return <div className="file-tree stack"><details open><summary>Collection</summary><ul><li><details><summary>Field notes</summary><ul>{['Monday.txt','Friday.txt'].map(leaf)}</ul></details></li>{leaf('Overview.txt')}</ul></details><State>Selected: {selected}. Use Tab for files and Enter or Space for folder disclosures.</State></div>;
}
function Carousel() {
  const [index, setIndex] = useState(0); const project = projects[index];
  return <div className="stack" role="region" aria-label="Project image carousel" onKeyDown={event => { if ((event.target as HTMLElement).matches('input,textarea,select')) return; if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); setIndex(value => nextCarouselIndex(value, event.key === 'ArrowLeft' ? -1 : 1, projects.length)); } }}><Dialog><DialogTrigger className="image-trigger" aria-label={`Enlarge ${project.name}`}><img src={project.image} alt={`${project.name}: synthetic editorial composition`} width="960" height="600" loading="lazy" /><span>View full size ↗</span></DialogTrigger><DialogContent className="lightbox"><DialogHeader><DialogTitle>{project.name}</DialogTitle><DialogDescription>{project.description}</DialogDescription></DialogHeader><img src={project.image} alt={`${project.name}: full editorial composition`} width="960" height="600" /><div className="cluster"><Button variant="outline" aria-label="Previous image" onClick={() => setIndex(value => nextCarouselIndex(value, -1, projects.length))}>Previous</Button><Button variant="outline" aria-label="Next image" onClick={() => setIndex(value => nextCarouselIndex(value, 1, projects.length))}>Next</Button><span role="status">{index + 1} / {projects.length}</span></div></DialogContent></Dialog><div className="thumbnail-strip" aria-label="Choose project">{projects.map((item, position) => <button type="button" key={item.name} aria-pressed={position === index} onClick={() => setIndex(position)}><img src={item.image} alt="" width="96" height="60" loading="lazy" /><span>{item.name}</span></button>)}</div><div className="cluster"><Button variant="outline" onClick={() => setIndex(x => nextCarouselIndex(x, -1, projects.length))}>Previous</Button><Button variant="outline" onClick={() => setIndex(x => nextCarouselIndex(x, 1, projects.length))}>Next</Button><span className="muted" role="status">{index + 1} / {projects.length}</span></div></div>;
}
function Compare() {
  const [value, setValue] = useState(50); const id = useId();
  return <div className="stack"><div className="compare-frame"><img src={projects[0].image} width="960" height="600" alt="Atlas study, transitioning from monochrome to terracotta" loading="lazy" /><img src={projects[0].image} width="960" height="600" alt="" aria-hidden="true" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }} loading="lazy" /><span className="compare-divider" style={{ left: `${value}%` }} /></div><label htmlFor={id}>Color coverage · {value}%</label><input id={id} type="range" min="0" max="100" value={value} onChange={event => setValue(Number(event.target.value))} /><p className="muted">Drag the boundary or use the arrow keys.</p></div>;
}
function Avatars() { return <div className="cluster avatar-group" aria-label="Synthetic collaborators">{['Alex Reed', 'Sam Park', 'Jules Lane'].map(name => <span key={name} className="avatar" title={name} aria-label={name}>{name.split(' ').map(x => x[0]).join('')}</span>)}<span className="muted">A small team, shared context.</span></div>; }
function CRTFrame() { return <figure className="crt-frame"><div className="crt-screen"><pre aria-label="An ASCII cat">{' /\_/\\\n( o.o )\n > ^ <'}</pre><span>ALL SYSTEMS QUIET.</span></div><figcaption><span aria-hidden="true">●</span> A small companion / no autoplay</figcaption></figure>; }
function Spotlight({ controllable = false }: { controllable?: boolean }) {
  const preference = useMotionPreference(); const [staticMode, setStaticMode] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return <div className="stack"><div className="spotlight" data-static={preference || staticMode ? 'true' : undefined} ref={ref} onPointerMove={event => { if (event.pointerType !== 'mouse' || preference || staticMode) return; const box = event.currentTarget.getBoundingClientRect(); ref.current?.style.setProperty('--spot-x', `${event.clientX - box.left}px`); ref.current?.style.setProperty('--spot-y', `${event.clientY - box.top}px`); }}><p className="eyebrow">A SMALL DETAIL</p><h3>Stay curious.</h3><p>A warm highlight follows a pointer. The surface stays still.</p><a className="text-link" href="/foundations/">Explore the foundations <span aria-hidden="true">↗</span></a></div>{controllable && <><label className="check-label"><input type="checkbox" checked={staticMode} onChange={event => setStaticMode(event.target.checked)} />Static preview</label><State>{preference || staticMode ? 'Static mode: pointer highlight removed.' : 'Fine pointers follow the light. Touch and keyboard keep a steady boundary.'}</State></>}</div>;
}
function ProfileBento() { return <div className="about-bento"><Portfolio.ProfileCard/><StatsCard/><QuoteCard/><div className="about-skills"><SkillGrid/></div><div className="about-tech"><TechStrip/></div></div>; }
function StatsCard() { return <Card><CardHeader><CardDescription>Reading this week · sample data</CardDescription><CardTitle className="metric">248<span> min</span></CardTitle></CardHeader><CardContent><div className="spark-bars" aria-hidden="true">{[30,60,42,80,100,64,74].map((height,index) => <i key={index} style={{ height: `${height}%` }} />)}</div></CardContent><CardFooter><p>↑ 18 minutes from last week</p></CardFooter></Card>; }
function QuoteCard() { return <figure className="quote-card"><p className="eyebrow">A WORKING PRINCIPLE</p><blockquote>“Make enough room for the important things.”</blockquote><figcaption>Arifian Design System · specimen copy</figcaption></figure>; }
function SkillGrid() { return <ul className="skill-grid">{['Interface design','Prototyping','Typography','Accessibility','Design systems','Interaction'].map(item => <li key={item}><span aria-hidden="true">↗</span>{item}</li>)}</ul>; }
function SectionHeading() { return <div className="section-heading-sample"><p className="eyebrow">01 / THE EVERYDAY</p><h3>Useful by design.</h3><p>A little structure. A lot of possibility.</p></div>; }
function TechStrip() { return <TooltipProvider><div className="tech-strip">{[['React','Interactive surfaces'],['Astro','Static pages'],['TypeScript','Clear contracts'],['Motion','Purposeful transitions']].map(([name,note]) => <Tooltip key={name}><TooltipTrigger render={<Button variant="ghost" />}>{name}</TooltipTrigger><TooltipContent>{note}</TooltipContent></Tooltip>)}</div></TooltipProvider>; }

function MotionStudy({ effect }: { effect: 'fade' | 'stagger' | 'rotate' | 'indicator' | 'presence' | 'expand' | 'number' }) {
  const indicatorId = useId(); const preference = useMotionPreference(); const [staticMode, setStaticMode] = useState(false); const reduced = preference || staticMode;
  const [revision, setRevision] = useState(0); const [active, setActive] = useState('Overview'); const [visible, setVisible] = useState(true); const [count, setCount] = useState(24);
  const countAnimation = useRef<ReturnType<typeof animate> | null>(null);
  const countTarget = useRef(24);
  useEffect(() => () => { countAnimation.current?.stop(); }, []);
  useEffect(() => { if (reduced) { countAnimation.current?.stop(); setCount(countTarget.current); } }, [reduced]);
  function change() { setRevision(x => x + 1); if (effect === 'presence' || effect === 'expand') setVisible(x => !x); if (effect === 'number') { countAnimation.current?.stop(); const target = revision % 2 === 0 ? 48 : 24; countTarget.current = target; if (reduced) setCount(target); else countAnimation.current = animate(count, target, { duration: 0.5, onUpdate: next => setCount(Math.round(next)) }); } }
  const transition = { duration: reduced ? 0 : 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] };
  return <div className="stack"><div className="motion-stage">
    {effect === 'indicator' ? <div className="indicator-tabs" role="group" aria-label="Motion view">{['Overview','Notes','Activity'].map(label => <button key={label} type="button" aria-pressed={active === label} onClick={() => setActive(label)}>{label}{active === label && <motion.span layoutId={indicatorId} transition={{ duration: reduced ? 0 : 0.2 }} />}</button>)}</div> : effect === 'number' ? <p className="motion-number" aria-live="polite">{count}<small> references</small></p> : effect === 'presence' || effect === 'expand' ? <AnimatePresence initial={false}>{visible && <motion.div key="row" initial={reduced ? false : effect === 'expand' ? { height: 0 } : { opacity: 0, y: 8 }} animate={effect === 'expand' ? { height: 'auto' } : { opacity: 1, y: 0 }} exit={effect === 'expand' ? { height: 0 } : { opacity: 0, y: reduced ? 0 : -8 }} transition={transition} className="presence-row"><Check aria-hidden="true" /><div><strong>{effect === 'expand' ? 'The details, when you need them.' : 'A new reference was added.'}</strong>{effect === 'expand' && <p>Progressive detail keeps the overview calm and the next step close.</p>}</div></motion.div>}</AnimatePresence> : effect === 'stagger' ? <div className="stagger-items" key={revision}>{['Collect','Consider','Create'].map((label,index) => <motion.span key={label} initial={revision && !reduced ? { opacity: 0, y: 12 } : false} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: reduced ? 0 : index * 0.08 }}>{label}</motion.span>)}</div> : <motion.p className="motion-phrase" key={revision} initial={revision && !reduced ? { opacity: 0, y: 12 } : false} animate={{ opacity: 1, y: 0 }} transition={transition}>{effect === 'rotate' ? ['Less noise.','More intent.','Room to think.'][revision % 3] : 'Room for what matters.'}</motion.p>}
  </div><div className="cluster">{effect !== 'indicator' && <Button variant="outline" onClick={change}>{effect === 'presence' || effect === 'expand' ? visible ? 'Hide detail' : 'Show detail' : effect === 'rotate' ? 'Next phrase' : effect === 'number' ? 'Change value' : 'Replay reveal'}</Button>}<label className="check-label"><input type="checkbox" checked={staticMode} onChange={event => setStaticMode(event.target.checked)} />Static preview</label></div><State>{reduced ? 'Static mode: spatial motion removed.' : 'On demand. No looping or scroll capture.'}</State></div>;
}
function Dashboard() { return <div className="dashboard-demo"><StatsCard /><Chart /><div className="dashboard-records"><RecordTable /></div></div>; }
function Settings() {
  const id = useId(); const [saved,setSaved]=useState(false);
  return <form onChange={()=>setSaved(false)} onSubmit={event=>{event.preventDefault();setSaved(true);}}><FieldGroup><Field><FieldLabel htmlFor={id}>Collection name</FieldLabel><Input id={id} name="collection" autoComplete="off" defaultValue="Field notes" /></Field><Field orientation="horizontal"><Switch id={`${id}-digest`} aria-label="Weekly reading summary" defaultChecked /><FieldLabel htmlFor={`${id}-digest`}>Weekly reading summary</FieldLabel></Field><Field orientation="horizontal"><Checkbox id={`${id}-context`} aria-label="Show reference descriptions" defaultChecked /><FieldLabel htmlFor={`${id}-context`}>Show reference descriptions</FieldLabel></Field><Button type="submit">Save preferences</Button><State>{saved ? 'Preferences saved for this preview.' : 'Changes stay in this preview.'}</State></FieldGroup></form>;
}
function SearchResults() {
  const id=useId(); const [query,setQuery]=useState(''); const matches=projects.filter(item=>`${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="stack"><Field><FieldLabel htmlFor={id}>Search projects</FieldLabel><Input id={id} name="projects" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Try editorial…" /></Field><ul className="project-results">{matches.map(project=><li key={project.name}><img src={project.image} alt="" width="120" height="75" loading="lazy" /><div><strong>{project.name}</strong><p>{project.description}</p></div></li>)}</ul>{!matches.length && <Empty><EmptyHeader><EmptyTitle>No matching projects</EmptyTitle><EmptyDescription>Try a shorter phrase.</EmptyDescription></EmptyHeader><EmptyContent><Button variant="outline" onClick={()=>setQuery('')}>Clear search</Button></EmptyContent></Empty>}<State>{matches.length} projects found.</State></div>;
}
function FileBrowser() {
  const [selected,setSelected]=useState('Overview.txt');
  return <div className="file-browser"><div><details open><summary>Field notes</summary><ul>{['Overview.txt','Monday.txt','Friday.txt'].map(name=><li key={name}><Button variant="ghost" aria-pressed={selected===name} onClick={()=>setSelected(name)}>{name}</Button></li>)}</ul></details></div><div className="file-inspector" role="status"><p className="eyebrow">SELECTED FILE</p><h3>{selected}</h3><p>{selected==='Overview.txt'?'A week of observations, gathered in one place.':selected==='Monday.txt'?'Start by noticing what is already working.':'Make a little room for next week.'}</p><dl><dt>Type</dt><dd>Text note</dd><dt>Storage</dt><dd>Demonstration only</dd></dl></div></div>;
}
function Kanban() {
  const [tasks,setTasks]=useState<Task[]>([{id:1,title:'Review the spacing',stage:0},{id:2,title:'Write useful labels',stage:1},{id:3,title:'Simplify the header',stage:2}]);
  return <div className="kanban">{['To do','In progress','Done'].map((stage,index)=><section key={stage} aria-label={stage} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const id = Number(event.dataTransfer.getData('text/plain')); if (!Number.isInteger(id)) return; setTasks(list => list.map(task => task.id === id ? { ...task, stage: index } : task)); }}><h3>{stage}</h3>{tasks.filter(task=>task.stage===index).map(task=><article key={task.id} draggable onDragStart={event => { event.dataTransfer.setData('text/plain', String(task.id)); event.dataTransfer.effectAllowed = 'move'; }}><p>{task.title}</p><div className="cluster"><Button variant="ghost" disabled={index===0} aria-label={`Move ${task.title} back`} onClick={()=>setTasks(list=>moveTask(list,task.id,-1))}>←</Button><Button variant="ghost" disabled={index===2} aria-label={`Move ${task.title} forward`} onClick={()=>setTasks(list=>moveTask(list,task.id,1))}>→</Button></div></article>)}</section>)}</div>;
}

function ProjectGallery() {
  return <div className="project-gallery-pattern"><SearchResults /><Carousel /></div>;
}

function ProjectDetail() { return <div className="stack"><Portfolio.SectionEyebrow>PROJECT STUDY</Portfolio.SectionEyebrow><h3>Atlas / editorial field guide</h3><Portfolio.ProjectMeta/><Carousel/><Portfolio.ProjectNavigation/></div>; }
export const coreRenderers = {
  'button': ButtonStudy,
  'button-group': ButtonGroup,
  'toggle-group': Segments,
  'copy-button': CopyAction,
  'input': TextField,
  'textarea': TextArea,
  'selection-controls': Selections,
  'select': SelectStudy,
  'slider': SliderStudy,
  'otp': Verification,
  'validation': Validation,
  'tabs': TabsStudy,
  'breadcrumb': BreadcrumbStudy,
  'accordion': AccordionStudy,
  'command': CommandStudy,
  'pagination': Pagination,
  'step-navigation': Steps,
  'alert': AlertStudy,
  'toast': ToastStudy,
  'status-badge': StatusBadges,
  'progress': ProgressStudy,
  'skeleton': SkeletonStudy,
  'empty-state': EmptyStudy,
  'dialog': DialogStudy,
  'sheet': SheetStudy,
  'tooltip': TooltipStudy,
  'table': RecordTable,
  'timeline': Timeline,
  'file-tree': FileTree,
  'carousel': Carousel,
  'compare': Compare,
  'avatar': Avatars,
  'crt-frame': CRTFrame,
  'spotlight-card': () => <Spotlight controllable />,
  'profile-bento': ProfileBento,
  'stats-card': StatsCard,
  'quote-card': QuoteCard,
  'skill-grid': SkillGrid,
  'section-heading': SectionHeading,
  'tech-strip': TechStrip,
  'rotating-text': () => <MotionStudy effect="rotate" />,
  'active-indicator': () => <MotionStudy effect="indicator" />,
  'presence': () => <MotionStudy effect="presence" />,
  'expand-collapse': () => <MotionStudy effect="expand" />,
  'number-ticker': () => <MotionStudy effect="number" />,
  'dashboard': Dashboard,
  'settings': Settings,
  'search-results': SearchResults,
  'file-browser': FileBrowser,
  'kanban': Kanban,
  'project-gallery': ProjectGallery,
  'project-detail': ProjectDetail,
};
export function CoreSpecimen({ slug }: { slug: string }) { return renderSpecimen(slug, coreRenderers); }
