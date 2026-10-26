import { renderSpecimen } from './SpecimenBody';
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Field, FieldDescription, FieldLabel } from './ui/field';
import { DemoState, demoProjects, CodeBlock, SectionEyebrow } from './PortfolioSpecimens';
import { acceptLocalFiles, addTag } from '../lib/interaction-state';
import { useMotionPreference } from '../lib/use-motion-preference';

export function Dropzone() {
  const id=useId();const [result,setResult]=useState({names:[] as string[],error:''});const [over,setOver]=useState(false);
  return <Field><FieldLabel htmlFor={id}>Local reference images</FieldLabel><div className="local-dropzone" data-over={over} onDragOver={event=>{event.preventDefault();setOver(true);}} onDragLeave={()=>setOver(false)} onDrop={event=>{event.preventDefault();setOver(false);setResult(acceptLocalFiles(Array.from(event.dataTransfer.files)));}}><p>Drop images here, or choose files below.</p><Input id={id} name="reference-images" type="file" multiple accept="image/png,image/jpeg,image/webp" aria-invalid={!!result.error} aria-describedby={`${id}-hint ${id}-result`} onChange={event=>setResult(acceptLocalFiles(Array.from(event.target.files??[])))}/></div><FieldDescription id={`${id}-hint`}>Up to four PNG, JPEG or WebP images, 5 MB each. Files stay on your device.</FieldDescription><div id={`${id}-result`} role="status">{result.error?<p>{result.error}</p>:<ul>{result.names.map(name=><li key={name}>{name}</li>)}</ul>}</div>{!!result.names.length&&<Button variant="ghost" onClick={()=>{setResult({names:[],error:''});const input=document.getElementById(id) as HTMLInputElement|null;if(input)input.value='';}}>Clear files</Button>}</Field>;
}
export function TagsInput() {
  const id=useId();const [tags,setTags]=useState(['Editorial','Prototype']);const [draft,setDraft]=useState('');
  return <div className="stack"><form onSubmit={event=>{event.preventDefault();setTags(previous=>addTag(previous,draft));setDraft('');}}><Field><FieldLabel htmlFor={id}>Collection tags</FieldLabel><Input id={id} name="tag" autoComplete="off" value={draft} maxLength={32} onChange={event=>setDraft(event.target.value)} placeholder="Add a tag…"/><FieldDescription>Enter adds a tag. Matching names are merged.</FieldDescription><Button type="submit" variant="outline" disabled={!draft.trim()}>Add tag</Button></Field></form><ul className="cluster" aria-label="Selected tags">{tags.map(tag=><li className="tag-chip" key={tag}>{tag}<Button variant="ghost" size="icon-sm" aria-label={`Remove ${tag}`} onClick={()=>setTags(previous=>previous.filter(value=>value!==tag))}>×</Button></li>)}</ul><DemoState>{tags.length} tags selected.</DemoState></div>;
}
const palette=['#f5f4ed','#141413','#c96442','#e9c6b9','#964225'];
export function ColorPicker() {
  const id=useId();const [color,setColor]=useState(palette[2]);
  return <Field><FieldLabel htmlFor={id}>Specimen accent</FieldLabel><div className="cluster"><input id={id} name="sample-accent" type="color" value={color} onChange={event=>setColor(event.target.value)}/><output htmlFor={id}>{color}</output></div><div className="cluster" role="group" aria-label="Approved palette presets">{palette.map(value=><Button key={value} variant="outline" aria-pressed={color===value} onClick={()=>setColor(value)}>{value}</Button>)}</div><div className="color-picker-preview" style={{borderColor:color}}>Local swatch / the site tokens stay fixed.</div></Field>;
}
export function Rating() {
  const id=useId();const [rating,setRating]=useState('3');
  return <fieldset className="rating"><legend>How useful was this study?</legend><div className="cluster">{[1,2,3,4,5].map(value=><label key={value}><input type="radio" name={id} value={value} checked={rating===String(value)} onChange={event=>setRating(event.target.value)}/><span>{value}</span><span className="sr-only"> out of 5</span></label>)}</div><DemoState>{rating} out of 5. Your response stays in this preview.</DemoState></fieldset>;
}
export function ChromaProjectGrid() {
  const reduced=useMotionPreference();const ref=useRef<HTMLDivElement>(null);
  return <div className="chroma-project-grid" ref={ref} data-static={reduced} onPointerMove={event=>{if(event.pointerType!=='mouse'||reduced)return;ref.current?.querySelectorAll<HTMLImageElement>('.chroma-color').forEach(image=>{const imageBounds=image.getBoundingClientRect();image.style.setProperty('--local-x',`${event.clientX-imageBounds.left}px`);image.style.setProperty('--local-y',`${event.clientY-imageBounds.top}px`);});}}>{demoProjects.map(project=><a key={project.name} href="/patterns/#project-detail"><div className="chroma-media"><img src={project.image} alt={`${project.name}: synthetic project study`} width="960" height="600" loading="lazy"/><img className="chroma-color" src={project.image} alt="" aria-hidden="true" width="960" height="600" loading="lazy"/></div><div><SectionEyebrow>{project.year} / STUDY</SectionEyebrow><h3>{project.name} ↗</h3><p>{project.description}</p></div></a>)}</div>;
}
export function RevealVariants() {
  const reducedPreference=useMotionPreference();const [staticMode,setStatic]=useState(false);const [variant,setVariant]=useState('Fade');const [revision,setRevision]=useState(0);const reduced=reducedPreference||staticMode;
  return <div className="stack"><div className="cluster" role="group" aria-label="Reveal variant">{['Fade','Slide','Blur','Stagger','Split'].map(value=><Button variant="outline" aria-pressed={variant===value} key={value} onClick={()=>{setVariant(value);setRevision(0);}}>{value}</Button>)}</div><div className="motion-stage"><p className="motion-phrase" aria-label="Room for what matters." key={`${variant}-${revision}`}>
    {variant==='Stagger'||variant==='Split'?<span aria-hidden="true" className="split-words">{'Room for what matters.'.split(' ').map((word,index)=><motion.span key={index} initial={revision&&!reduced?{y:variant==='Split'?12:6}:false} animate={{y:0}} transition={{duration:reduced?0:.4,delay:reduced?0:index*.08}}>{word} </motion.span>)}</span>:<motion.span aria-hidden="true" initial={revision&&!reduced?{opacity:variant==='Fade'?.4:1,y:variant==='Slide'?12:0,filter:variant==='Blur'?'blur(3px)':'none'}:false} animate={{opacity:1,y:0,filter:'none'}} transition={{duration:reduced?0:.5}}>Room for what matters.</motion.span>}
  </p></div><div className="cluster"><Button variant="outline" onClick={()=>setRevision(value=>value+1)}>Replay reveal</Button><label className="check-label"><input type="checkbox" checked={staticMode} onChange={event=>setStatic(event.target.checked)}/>Static preview</label></div><DemoState>{reduced?'Static mode: spatial motion removed.':'On demand. No looping or scroll capture.'}</DemoState></div>;
}
export function TextType() {
  const preference=useMotionPreference();const [staticMode,setStatic]=useState(false);const [step,setStep]=useState(24);const [running,setRunning]=useState(false);const phrase='A quiet place for ideas.';const reduced=preference||staticMode;
  useEffect(()=>{if(reduced||!running){if(reduced)setStep(phrase.length);return;}if(step>=phrase.length){setRunning(false);return;}const timer=setTimeout(()=>setStep(value=>value+1),55);return()=>clearTimeout(timer);},[step,running,reduced]);
  return <div className="stack"><div className="motion-stage"><p className="motion-phrase" aria-label={phrase}><span aria-hidden="true">{reduced?phrase:phrase.slice(0,step)}<span className="type-cursor">▏</span></span></p></div><div className="cluster"><Button variant="outline" onClick={()=>{setStep(reduced?phrase.length:0);setRunning(!reduced);}}>Replay typing</Button><label className="check-label"><input type="checkbox" checked={staticMode} onChange={event=>setStatic(event.target.checked)}/>Static preview</label></div><DemoState>{reduced?'Static mode: full text visible.':running?'Typing a short sample.':'Ready. Replay on demand.'}</DemoState></div>;
}
export function Terminal() {
  const [ran,setRan]=useState(false);
  return <div className="stack"><figure className="terminal-specimen"><figcaption>LOCAL SESSION / SCRIPTED</figcaption><pre>{'$ inspect collection\n'+(ran?'✓ Three synthetic studies found.\n✓ All changes stay in this preview.':'Ready for a local demonstration.')}</pre></figure><Button variant="outline" onClick={()=>setRan(value=>!value)}>{ran?'Reset terminal':'Run demonstration'}</Button><DemoState>{ran?'Demonstration complete.':'No shell command is executed.'}</DemoState></div>;
}
export function ScrollProgressStudy() {
  const [progress,setProgress]=useState(0);
  return <div className="stack"><div className="reading-progress" role="progressbar" aria-label="Local reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{width:`${progress}%`}}/></div><div className="reading-preview" tabIndex={0} aria-label="Scrollable reading study" onScroll={event=>{const el=event.currentTarget;setProgress(Math.round(el.scrollTop/(el.scrollHeight-el.clientHeight)*100));}}>{['Start with the context.','Make the next step clear.','Give the details some room.','Return to the important things.'].map(text=><section key={text}><h3>{text}</h3><p>A synthetic reading passage demonstrates progress within its own scroll area. Native scroll, touch and keyboard behavior stay intact.</p></section>)}</div><DemoState>{progress}% of this local study.</DemoState></div>;
}
export function MarqueeStudy() {
  const reduced=useMotionPreference();const [playing,setPlaying]=useState(false);
  return <div className="stack"><div className="marquee-window" tabIndex={0} aria-label="Pausable label sequence" data-playing={playing&&!reduced}><div className="marquee-track">{[0,1].map(copy=><div className="cluster" key={copy} aria-hidden={copy===1?true:undefined}>{['Field notes','Useful tools','Quiet details','Clear intent'].map(text=><span key={text}>{text} / </span>)}</div>)}</div></div><Button variant="outline" disabled={reduced} onClick={()=>setPlaying(value=>!value)}>{playing&&!reduced?'Pause marquee':'Play marquee'}</Button><DemoState>{reduced?'Static mode: all labels remain readable.':'Starts still. Pause at any time; hover and focus also pause.'}</DemoState></div>;
}
export function CodeComparison() { const [after,setAfter]=useState(false);return <div className="stack"><div className="cluster" role="group" aria-label="Code comparison"><Button variant="outline" aria-pressed={!after} onClick={()=>setAfter(false)}>Before</Button><Button variant="outline" aria-pressed={after} onClick={()=>setAfter(true)}>After</Button></div><CodeBlock code={after?'const label = "Save collection";':'const label = "Submit";'} language={after?'After / clear intent':'Before / vague action'}/><DemoState>{after?'The action names its result.':'A label without context.'}</DemoState></div>; }
export function OnboardingPattern() {
  const [step,setStep]=useState(0);const labels=['Name your collection','Choose a reference','Make room for the next idea'];
  return <div className="stack"><ol className="steps">{labels.map((label,index)=><li key={label} aria-current={step===index?'step':undefined}><span>0{index+1}</span>{label}</li>)}</ol><h3>{labels[step]}</h3><p className="muted">A local guided introduction with explicit steps and a way back.</p><div className="cluster"><Button variant="outline" disabled={step===0} onClick={()=>setStep(value=>value-1)}>Previous step</Button><Button onClick={()=>setStep(value=>value===2?0:value+1)}>{step===2?'Start again':'Next step'}</Button></div><DemoState>Step {step+1} of {labels.length}</DemoState></div>;
}

export const curatedRenderers = {
  'marquee': MarqueeStudy,
  'dropzone': Dropzone,
  'reveal': RevealVariants,
  'tags-input': TagsInput,
  'color-picker': ColorPicker,
  'rating': Rating,
  'terminal': Terminal,
  'chroma-project-grid': ChromaProjectGrid,
  'onboarding': OnboardingPattern,
  'code-comparison': CodeComparison,
  'text-type': TextType,
  'scroll-progress': ScrollProgressStudy,
};
export function CuratedSpecimen({ slug }: { slug: string }) { return renderSpecimen(slug, curatedRenderers); }
