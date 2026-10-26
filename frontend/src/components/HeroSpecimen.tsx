import { useId, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Field, FieldLabel } from './ui/field';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export default function HeroSpecimen() {
  const id = useId(); const [name,setName] = useState('Field notes'); const [saved,setSaved]=useState(false);
  return <div className="hero-specimen" data-hero-specimen>
    <div className="specimen-topline"><span>THE SYSTEM, IN PRACTICE</span><span aria-hidden="true">↗</span></div>
    <div className="hero-specimen-grid"><section className="hero-mini-card"><span className="eyebrow">A LITTLE CLARITY</span><h2>Make room.<br /><span>For good work.</span></h2><p>Start small. Keep what matters.</p><Badge variant="outline"><span className="status-dot" aria-hidden="true" />Ready to begin</Badge></section>
    <form className="hero-mini-form" onSubmit={event=>{event.preventDefault();setSaved(true);}}><Field><FieldLabel htmlFor={id}>Collection name</FieldLabel><Input id={id} name="hero-collection" value={name} required maxLength={60} onChange={event=>{setName(event.target.value);setSaved(false);}} autoComplete="off" /></Field><Button type="submit">{saved ? 'Collection created' : 'Create collection'}{saved ? <Check data-icon="inline-end" /> : <ArrowRight data-icon="inline-end" />}</Button><p role="status">{saved ? `“${name}” is ready in this preview.` : 'One clear action. A useful next step.'}</p></form>
    <div className="hero-mini-table"><div className="mini-table-label"><span>RECENT COLLECTIONS</span><span>03</span></div><Table><caption className="sr-only">Synthetic recent collections</caption><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{[['Atlas','Ready'],['Fieldwork','In review'],['Index','Draft']].map(([name,status])=><TableRow key={name}><TableCell>{name}</TableCell><TableCell><Badge variant="outline">{status}</Badge></TableCell></TableRow>)}</TableBody></Table></div></div>
    <div className="hero-mini-metric"><div><span className="eyebrow">READING THIS WEEK</span><strong>248 <small>minutes</small></strong></div><span>↑ 18 from last week<br /><small>Synthetic metric</small></span></div>
    <div className="specimen-bottomline"><span>SHARP EDGES. WARM INTENT.</span><span>01 / LIVE SPECIMEN</span></div>
  </div>;
}
