import { renderSpecimen } from './SpecimenBody';
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, ArrowUp, Code, Copy, Layers } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Textarea } from './ui/textarea';
import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from './ui/empty';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useMotionPreference } from '../lib/use-motion-preference';
import { fallbackPopoverPosition } from '../lib/interaction-state';
import ThemeToggle from './ThemeToggle';

export const demoProjects = [
  { name: 'Atlas', year: '2026', image: '/studies/atlas.svg', description: 'An editorial field guide with room for the details.', tags: ['React', 'TypeScript'] },
  { name: 'Fieldwork', year: '2025', image: '/studies/fieldwork.svg', description: 'A quiet workspace for collecting ideas.', tags: ['Astro', 'CSS'] },
  { name: 'Index', year: '2024', image: '/studies/index.svg', description: 'Everyday objects, carefully arranged.', tags: ['React', 'Motion'] },
];
type Project = typeof demoProjects[number];
export const DemoState = ({ children }: { children: ReactNode }) => <p className="demo-state" role="status">{children}</p>;

export function SectionEyebrow({ children = '01 / SELECTED WORK' }: { children?: ReactNode }) { return <p className="eyebrow">{children}</p>; }
export function SectionEyebrowStudy() { return <div className="stack"><SectionEyebrow/><SectionEyebrow>02 / A LITTLE CONTEXT</SectionEyebrow><p className="muted">A short rule locates the label without competing with the heading.</p></div>; }
export function ProjectMeta({ project = demoProjects[0] }: { project?: Project }) {
  return <div className="project-meta"><span>{project.year} / Synthetic study</span><ul aria-label="Tech stack">{project.tags.map(tag => <li key={tag}><Code aria-hidden="true"/>{tag}</li>)}</ul></div>;
}
export function ProjectListItem({ project, index }: { project: Project; index: number }) {
  return <a className="portfolio-project-row" href="/patterns/#project-detail"><span className="project-number">{String(index).padStart(2,'0')}</span><div><h3>{project.name}</h3><p>{project.description}</p><ProjectMeta project={project}/></div><ArrowRight aria-hidden="true"/></a>;
}
export function ProjectPopover({ children, forceFallback = false }: { children?: ReactNode; forceFallback?: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g,''); const anchor = `--project-${id}`;
  const root = useRef<HTMLDivElement>(null); const panel = useRef<HTMLDivElement>(null); const trigger = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null); const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false); const [native, setNative] = useState(true);
  const [position, setPosition] = useState({ top: 12, left: 12, width: 300 });
  const cancel = () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); if (closeTimer.current) clearTimeout(closeTimer.current); };
  function close(restore = false) { cancel(); setOpen(false); if (restore) trigger.current?.focus(); }
  function enter() { cancel(); hoverTimer.current = setTimeout(() => setOpen(true), 2000); }
  function leave() { cancel(); closeTimer.current = setTimeout(() => setOpen(false), 300); }
  useEffect(() => () => cancel(), []);
  useEffect(() => {
    if (!open) return;
    const update = () => { const bounds = root.current?.getBoundingClientRect(); if (bounds) setPosition(fallbackPopoverPosition(bounds, innerWidth, innerHeight, 320, panel.current?.offsetHeight ?? 260)); };
    const element = panel.current;
    const supported = native && !forceFallback && !!element && typeof element.showPopover === 'function';
    if (!forceFallback && element && typeof element.showPopover !== 'function') setNative(false);
    if (supported) { try { element.showPopover(); } catch { setNative(false); } }
    update();
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); close(true); } };
    const onOutside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node) && !panel.current?.contains(event.target as Node)) close(); };
    window.addEventListener('resize', update); window.addEventListener('scroll', update, true);
    document.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onOutside);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onOutside); try { element?.hidePopover?.(); } catch { /* An already closed or unsupported popover needs no cleanup. */ } };
  }, [open, forceFallback, native]);
  return <div ref={root} className="project-popover-anchor" style={{ anchorName: anchor } as CSSProperties} onPointerEnter={event => { if (event.pointerType === 'mouse') enter(); }} onPointerLeave={event => { if (event.pointerType === 'mouse') leave(); }}>
    {children ?? <ProjectListItem project={demoProjects[0]} index={1}/>}
    <Button ref={trigger} variant="outline" aria-expanded={open} aria-controls={open ? `preview-${id}` : undefined} onClick={() => { cancel(); setOpen(value => !value); }}>Quick preview Atlas</Button>
    {open && createPortal(<div ref={panel} id={`preview-${id}`} popover={native && !forceFallback ? 'manual' : undefined} role="region" aria-label="Atlas quick preview" className="portfolio-project-popover" data-positioning={native && !forceFallback ? 'native' : 'fallback'} style={{ width: position.width, '--fallback-top': `${position.top}px`, '--fallback-left': `${position.left}px`, '--anchor-target': anchor } as CSSProperties} onPointerEnter={cancel} onPointerLeave={leave}>
      <SectionEyebrow>QUICK PREVIEW</SectionEyebrow><h3>Atlas</h3><ProjectMeta/><p>{demoProjects[0].description}</p><a className="text-link" href="/patterns/#project-detail">View project ↗</a><Button variant="ghost" onClick={() => close(true)}>Close preview</Button>
    </div>, document.body)}
  </div>;
}
export function ProjectPopoverStudy() {
  const [fallback, setFallback] = useState(false);
  return <div className="stack"><ProjectPopover forceFallback={fallback}/><label className="check-label"><input type="checkbox" checked={fallback} onChange={event => setFallback(event.target.checked)}/>Force positioning fallback</label><DemoState>Hover for two seconds, or use Quick preview. Escape closes and restores focus.</DemoState></div>;
}
export function FeaturedProject() {
  return <article className="featured-project"><a href="/patterns/#project-detail"><img src={demoProjects[0].image} width="960" height="600" alt="Atlas: synthetic editorial landscape" loading="lazy"/><div><SectionEyebrow>FEATURED STUDY</SectionEyebrow><h3>Atlas ↗</h3><p>{demoProjects[0].description}</p><ProjectMeta/></div></a></article>;
}
export function ProjectNavigation() {
  return <nav className="project-navigation" aria-label="Related projects">{demoProjects.slice(1).map((project, index) => <a key={project.name} href="/components/media/#carousel"><span className="muted">{index ? 'Next study →' : '← Previous study'}</span><strong>{project.name}</strong></a>)}</nav>;
}
export function SiteNavbar() {
  const [active, setActive] = useState('Overview'); const [scrolled, setScrolled] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  return <div className="stack"><div className="navbar-scroll-demo" ref={scroller} tabIndex={0} aria-label="Scrollable navbar preview" onScroll={event => setScrolled(event.currentTarget.scrollTop > 20)}>
    <header className="portfolio-navbar" data-scrolled={scrolled}><a className="wordmark" href="/" aria-label="Sample portfolio home"><span className="brand-mark" aria-hidden="true"/>Field notes</a><nav aria-label="Portfolio specimen navigation">{['Overview','Projects'].map(label => <button type="button" key={label} className="portfolio-nav-item" aria-current={active === label ? 'page' : undefined} onClick={() => setActive(label)}>{label}</button>)}</nav><details><summary>Menu</summary><div>{['Overview','Projects'].map(label => <Button key={label} variant="ghost" onClick={() => { setActive(label); const disclosure = scroller.current?.querySelector('details'); if (disclosure) disclosure.open = false; }}>{label}</Button>)}</div></details></header>
    <div className="navbar-preview-content"><SectionEyebrow>{active.toUpperCase()}</SectionEyebrow><h3>A clear way through.</h3><p>Scroll within this preview to inspect its compact frosted state.</p><p>Every destination remains available by keyboard and touch.</p></div>
  </div><DemoState>{scrolled ? 'Scrolled surface active.' : 'At the opening position.'}</DemoState></div>;
}
export function ScrollTopStudy() {
  const ref = useRef<HTMLDivElement>(null); const [distance, setDistance] = useState(0); const reduced = useMotionPreference();
  return <div className="stack"><div className="scroll-top-preview" ref={ref} tabIndex={0} aria-label="Scroll to top preview" onScroll={event => setDistance(event.currentTarget.scrollTop)}><div><SectionEyebrow>START HERE</SectionEyebrow><h3>Room for a longer story.</h3><p>Scroll this local preview. The return action becomes available after 300 pixels.</p><p className="scroll-top-end">The end of the study.</p></div></div><Button variant="outline" disabled={distance <= 300} onClick={() => ref.current?.scrollTo({top:0,behavior:reduced ? 'instant' : 'smooth'})}><ArrowUp data-icon="inline-start"/>Back to preview top</Button><DemoState>{distance > 300 ? 'Return action available.' : 'Return action appears after 300 pixels.'}</DemoState></div>;
}
export function HeroComposition() {
  return <section className="portfolio-hero-composition"><SectionEyebrow>A WORKING COLLECTION</SectionEyebrow><h3>Room for<br/><span>what matters.</span></h3><p>Thoughtful tools for collecting ideas and turning them into useful things.</p><div className="cluster"><a className="primary-link" href="/components/">Explore the parts ↗</a><a className="text-link" href="/foundations/">Shared foundations</a></div><a className="scroll-hint" href="/patterns/#profile-bento">Continue exploring ↓</a></section>;
}
export function ProfileCard() {
  return <article className="portfolio-profile stack"><div className="profile-initial" aria-label="Synthetic profile initials">AR</div><SectionEyebrow>SYNTHETIC PROFILE</SectionEyebrow><h3>Alex Reed</h3><p>Designer of useful things.<br/>Exploring tools for everyday work.</p><a className="text-link" href="/patterns/#profile-bento">See the composition ↗</a></article>;
}
export function ExperienceItem() { return <article className="experience-item"><time dateTime="2025">2025 — now</time><div><h3>Interface designer</h3><p>Field notes studio · synthetic role</p><p>Making complex workflows easier to understand.</p><ul><li>Design systems</li><li>Prototyping</li></ul></div></article>; }
export function FooterComposition() { return <footer className="footer-specimen"><div className="dashed-divider"/><div className="cluster"><span className="wordmark"><span className="brand-mark" aria-hidden="true"/>Field notes studio</span><a className="text-link" href="/about/">About this system ↗</a></div><p className="muted">A synthetic studio / made with attention.</p><figure className="crt-frame"><div className="crt-screen"><pre aria-label="Terminal status">{'FIELD NOTES\nREADY_'}</pre></div><figcaption>Quiet signal / static media</figcaption></figure></footer>; }

export function CopyText({ text, label = 'Copy response' }: { text: string; label?: string }) {
  const [status, setStatus] = useState('');
  async function copy() { try { await navigator.clipboard.writeText(text); setStatus('Copied.'); } catch { setStatus('Clipboard unavailable. Select the text to copy it manually.'); } }
  return <div className="stack"><Button type="button" variant="outline" onClick={copy}><Copy data-icon="inline-start"/>{label}</Button><DemoState>{status}</DemoState></div>;
}
export function CodeBlock({ code = 'const collection = ["Atlas", "Fieldwork"];', language = 'TypeScript' }: { code?: string; language?: string }) {
  return <figure className="response-code"><figcaption>{language}</figcaption><pre tabIndex={0}><code>{code}</code></pre><CopyText text={code} label="Copy code"/></figure>;
}
export function RichResponse() {
  return <div className="rich-response"><p>Start with a <strong>clear heading</strong> and a useful action. Give every part enough space to read.</p><ul><li>Use a visible label.</li><li>Explain the next step.</li><li>Keep supporting detail nearby.</li></ul><p>Related guidance: <a className="text-link" href="/foundations/">the shared foundations</a>.</p><div className="table-wrap" tabIndex={0} aria-label="Response table scroll area"><table className="data-alternative"><caption>Synthetic response table</caption><thead><tr><th scope="col">Part</th><th scope="col">Purpose</th></tr></thead><tbody><tr><th scope="row">Heading</th><td>Orient the reader</td></tr><tr><th scope="row">Action</th><td>Offer a next step</td></tr></tbody></table></div><CodeBlock/><blockquote className="reply">Add detail when it serves the task.</blockquote></div>;
}
export function ChatMessage({ role, children }: { role: 'user' | 'assistant'; children: ReactNode }) { return <article className="message" data-role={role === 'user' ? 'You' : 'Assistant'}><strong>{role === 'user' ? 'You' : 'Demo assistant'}</strong><div>{children}</div></article>; }
export function ChatMessageStudy() { return <div className="stack"><ChatMessage role="user"><p>How can I simplify this page?</p></ChatMessage><ChatMessage role="assistant"><RichResponse/></ChatMessage></div>; }
export function PromptSuggestions({ onChoose }: { onChoose?: (text: string) => void }) {
  const [selected, setSelected] = useState('');
  return <div className="stack"><div className="prompt-suggestions" role="group" aria-label="Suggested prompts">{['Help me simplify a form','Suggest a page structure','Explain the spacing'].map(prompt => <Button key={prompt} variant="outline" onClick={() => { setSelected(prompt); onChoose?.(prompt); }}>{prompt}<ArrowRight data-icon="inline-end"/></Button>)}</div>{!onChoose && <DemoState>{selected ? `Selected: ${selected}` : 'Choose a starting point.'}</DemoState>}</div>;
}
export function AIEmpty() { return <Empty><EmptyHeader><Layers aria-hidden="true"/><EmptyTitle>A little room to think.</EmptyTitle><EmptyDescription>Ask a clear question or choose a prompt below. This assistant is a local scripted specimen.</EmptyDescription></EmptyHeader></Empty>; }
export function ChatComposer({ onSend, value, onChange, pending = false }: { onSend: (text: string) => void; value?: string; onChange?: (text: string) => void; pending?: boolean }) {
  const id = useId(); const [local, setLocal] = useState(''); const text = value ?? local;
  const setText = (next: string) => { setLocal(next); onChange?.(next); };
  function submit() { if (!text.trim() || pending) return; onSend(text.trim()); setText(''); }
  return <form onSubmit={event => {event.preventDefault(); submit();}}><FieldGroup><Field><FieldLabel htmlFor={id}>Your prompt</FieldLabel><Textarea id={id} name="prompt" autoComplete="off" maxLength={600} value={text} readOnly={pending} aria-describedby={`${id}-hint`} onChange={event => setText(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(); } }} placeholder="What are you working on…"/><FieldDescription id={`${id}-hint`}>{text.length} / 600 · Enter sends, Shift + Enter adds a line. Nothing is sent to a service.</FieldDescription></Field><Button type="submit" disabled={pending || !text.trim()}>{pending ? 'Preparing response…' : 'Send prompt'}<ArrowRight data-icon="inline-end"/></Button></FieldGroup></form>;
}
export function ChatComposerStudy() { const [sent,setSent] = useState(''); return <div className="stack"><ChatComposer onSend={setSent}/><DemoState>{sent ? `Local prompt: ${sent}` : 'Compose a short prompt.'}</DemoState></div>; }
export function ChatError({ onRetry }: { onRetry?: () => void }) {
  const [retried, setRetried] = useState(false);
  return <div className="stack"><Alert variant="destructive"><AlertTitle>Response interrupted</AlertTitle><AlertDescription>Your prompt stays available. This is a scripted error state.</AlertDescription><Button variant="outline" onClick={() => {setRetried(true); onRetry?.();}}>Retry response</Button></Alert>{!onRetry && <DemoState>{retried ? 'Retry completed locally.' : 'No service connection.'}</DemoState>}</div>;
}
export function ChatWelcome() { return <Dialog><DialogTrigger render={<Button variant="outline"/>}>Open chat welcome</DialogTrigger><DialogContent><DialogHeader><DialogTitle>A place to work through an idea.</DialogTitle><DialogDescription>This conversation is scripted. Prompts stay in this specimen and disappear when you leave.</DialogDescription></DialogHeader><p>Try a prompt, read the structured reply, or inspect its error state.</p><DialogClose render={<Button/>}>Start exploring</DialogClose></DialogContent></Dialog>; }
export function ChatPattern() {
  const [draft,setDraft] = useState(''); const [messages,setMessages] = useState<string[]>([]); const [pending,setPending] = useState(false); const [failed,setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {if(timer.current)clearTimeout(timer.current);}, []);
  function send(text: string) { if(pending)return; setMessages(list=>[...list,text]); setPending(true); setFailed(false); timer.current=setTimeout(()=>setPending(false),600); }
  return <div className="chat-demo stack"><SectionEyebrow>SCRIPTED CONVERSATION</SectionEyebrow><ChatWelcome/>{!messages.length && <AIEmpty/>}<PromptSuggestions onChoose={setDraft}/><div className="conversation" role="log" aria-label="Scripted conversation">{messages.map((text,index)=><div className="stack" key={index}><ChatMessage role="user"><p>{text}</p></ChatMessage>{(index < messages.length-1 || !pending) && !failed && <ChatMessage role="assistant"><RichResponse/></ChatMessage>}</div>)}{pending && <DemoState>Preparing a local response…</DemoState>}</div><ChatComposer value={draft} onChange={setDraft} onSend={send} pending={pending}/><Button variant="ghost" onClick={()=>{ if(timer.current)clearTimeout(timer.current);setPending(false);setFailed(true);}}>Preview error</Button>{failed && <ChatError onRetry={()=>setFailed(false)}/>}<DemoState>Scripted responses. No service connection.</DemoState></div>;
}
export function MessageReply({ children = 'Agreed. The quiet details do a lot of work.' }: { children?: ReactNode }) { return <blockquote className="reply"><strong>Author reply</strong><p>{children}</p></blockquote>; }
export function MessageItem({ text = 'A small detail can make a busy day easier.', children }: { text?: string; children?: ReactNode }) { return <article className="message-item"><div className="cluster"><SectionEyebrow>VISITOR / SAMPLE</SectionEyebrow><time dateTime="2026-10-01T09:00:00Z">1 October · 09:00</time></div><p>{text}</p>{children}</article>; }
export function MessageComposer({ onAdd }: { onAdd?: (text: string)=>void }) {
  const id = useId(); const [draft,setDraft] = useState(''); const [status,setStatus] = useState('');
  return <form onSubmit={event=>{event.preventDefault();if(!draft.trim())return;onAdd?.(draft.trim());setDraft('');setStatus('Note added to this preview.');}}><FieldGroup><Field><FieldLabel htmlFor={id}>Leave a temporary note</FieldLabel><Textarea id={id} name="message" autoComplete="off" maxLength={240} value={draft} onChange={event=>setDraft(event.target.value)} aria-describedby={`${id}-count`} placeholder="A thought worth keeping…"/><FieldDescription id={`${id}-count`}>{draft.length} / 240 · notes disappear when you leave.</FieldDescription></Field><Button type="submit" disabled={!draft.trim()}>Add note</Button><DemoState>{status}</DemoState></FieldGroup></form>;
}
export function MessageBoardPattern() {
  const id=useId(); const [messages,setMessages] = useState(['A small detail can make a busy day easier.']); const [reply,setReply] = useState(false); const [state,setState] = useState('Ready');
  return <div className="stack"><Field><FieldLabel htmlFor={id}>Board preview state</FieldLabel><select id={id} name="board-state" className="catalog-origin" value={state} onChange={event=>setState(event.target.value)}>{['Ready','Loading','Empty','Error'].map(value=><option key={value}>{value}</option>)}</select></Field>
    {state==='Loading'?<div className="stack" role="status" aria-label="Loading messages"><Skeleton className="skeleton-media"/><Skeleton className="h-4 w-3/4"/><span>Loading messages…</span></div>
    :state==='Empty'?<Empty><EmptyHeader><EmptyTitle>No notes yet</EmptyTitle><EmptyDescription>Write a short thought below to start the collection.</EmptyDescription></EmptyHeader></Empty>
    :state==='Error'?<Alert variant="destructive"><AlertTitle>Notes could not be loaded</AlertTitle><AlertDescription>Scripted error. Your draft stays in the composer.</AlertDescription><Button variant="outline" onClick={()=>setState('Ready')}>Retry notes</Button></Alert>
    :<div className="message-board" role="log" aria-label="Local message board">{messages.map((text,index)=><MessageItem key={index} text={text}>{index===0 && <><Button variant="ghost" aria-expanded={reply} onClick={()=>setReply(value=>!value)}>{reply?'Hide reply':'Read reply'}</Button>{reply&&<MessageReply/>}</>}</MessageItem>)}</div>}
    <MessageComposer onAdd={text=>{setMessages(list=>state==='Empty'?[text]:[...list,text]);setState('Ready');}}/><DemoState>{messages.length} {messages.length===1?'note':'notes'} in this preview.</DemoState></div>;
}
export function ThemeToggleStudy() { return <div className="cluster"><ThemeToggle/><p className="muted">Light and dark. Uses the same preference as the header.</p></div>; }

export const portfolioRenderers = {
  'chat-composer': ChatComposerStudy,
  'chat': ChatPattern,
  'messages': MessageBoardPattern,
  'site-navbar': SiteNavbar,
  'theme-toggle': ThemeToggleStudy,
  'scroll-top': ScrollTopStudy,
  'section-eyebrow': SectionEyebrowStudy,
  'profile-card': ProfileCard,
  'experience-item': ExperienceItem,
  'featured-project': FeaturedProject,
  'project-list-item': () => <ProjectListItem project={demoProjects[0]} index={1}/>,
  'project-meta': ProjectMeta,
  'project-popover': ProjectPopoverStudy,
  'project-navigation': ProjectNavigation,
  'prompt-suggestions': PromptSuggestions,
  'ai-empty': AIEmpty,
  'chat-message': ChatMessageStudy,
  'rich-response': RichResponse,
  'code-block': CodeBlock,
  'chat-error': ChatError,
  'chat-welcome': ChatWelcome,
  'message-item': MessageItem,
  'message-reply': MessageReply,
  'message-composer': MessageComposer,
  'hero-composition': HeroComposition,
  'footer-composition': FooterComposition,
};
export function PortfolioSpecimen({ slug }: { slug: string }) { return renderSpecimen(slug, portfolioRenderers); }
