import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { MotionConfig, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { applyProfile, parseProfiles, type DesignProfile } from '@/lib/profile';

const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(onChange: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}
function motionSnapshot() { return window.matchMedia(motionQuery).matches; }
const samples = [
  { name: 'Field notes', kind: 'Reading', count: 12 },
  { name: 'Small experiments', kind: 'Making', count: 8 },
  { name: 'Useful references', kind: 'Collecting', count: 16 },
];
export default function Workbench({ source }: { source: string }) {
  const [profiles, setProfiles] = useState<DesignProfile[]>([]);
  const [selected, setSelected] = useState('');
  const [status, setStatus] = useState('Loading private design profiles…');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState(false);
  const [staticMode, setStaticMode] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion, motionSnapshot, () => true);
  useEffect(() => {
    if (!source) {
      setStatus('Public specimen preview is not configured.');
      return;
    }
    const controller = new AbortController();
    fetch(source, { signal: controller.signal, cache: 'no-store', credentials: 'omit' })
      .then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); })
      .then(data => { const items = parseProfiles(data); setProfiles(items); setSelected(items[0].key); setStatus(''); })
      .catch(() => { if (!controller.signal.aborted) setStatus('Public specimen data is unavailable. Refresh to try again.'); });
    return () => controller.abort();
  }, [source]);
  const profile = profiles.find(item => item.key === selected);
  if (!profile) return <section className="library-boundary"><h1>Design workbench</h1><p role="status">{status}</p></section>;
  const state = applyProfile(profile, reduced !== false || staticMode);
  const rows = samples.filter(item => `${item.name} ${item.kind}`.toLowerCase().includes(query.toLowerCase()));
  return <MotionConfig reducedMotion={state.duration ? "never" : "always"}>
    <div className="workbench" data-recipe={state.recipe} data-motion={state.duration ? 'active' : 'static'} style={state.style as CSSProperties}>
      <a className="skip-link" href="#specimen">Skip to specimen</a>
      <header className="bench-header">
        <a className="wordmark" href="#specimen">Design workbench</a>
        <p className="local-note">Two curated source profiles</p>
        <nav aria-label="Workbench"><a href="#specimen">Specimen</a><a href="#collection">Collection</a><a href="#changes">Profile details</a></nav>
      </header>
      <aside className="controls" aria-label="Specimen controls">
        <div><label htmlFor="profile">Design profile</label>
          <select id="profile" value={selected} onChange={event => setSelected(event.target.value)}>
            {profiles.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select>
        </div>
        <label className="motion-control"><input type="checkbox" checked={staticMode} onChange={event => setStaticMode(event.target.checked)} /> Static preview</label>
        <p className="quiet">Two profiles. One set of sample content.</p>
        <p role="status" className="selection-status">Selected: {profile.label}. {state.recipe === 'flow' ? 'Flow composition' : 'Tile composition'}. {state.duration ? 'Motion enabled' : 'Static motion'}.</p>
      </aside>
      <section id="specimen" tabIndex={-1} className="specimen">
        <section className="intro" aria-labelledby="intro-title">
          <div><p className="quiet">A personal collection</p><h1 id="intro-title">Keep room<br />for ideas.</h1></div>
          <div className="intro-copy"><p>A little space for things worth reading, making, and returning to.</p>
            <div className="actions"><Button onClick={() => setSaved(value => !value)} aria-pressed={saved}>{saved ? 'Saved to collection' : 'Save collection'}</Button><Button variant="outline" onClick={() => { setQuery(''); document.getElementById('search')?.focus(); }}>Explore notes</Button></div>
            <p role="status" className="save-status">{saved ? 'Collection saved for this session.' : 'Sample content for a local design study.'}</p>
          </div>
        </section>
        <div className="specimen-grid">
          <section className="panel collection" id="collection" aria-labelledby="collection-title">
            <div className="panel-heading"><h2 id="collection-title">On the shelf</h2><span>{samples.length} collections</span></div>
            <label htmlFor="search">Find a collection</label><Input id="search" type="search" placeholder="Search by name or activity" value={query} onChange={event => setQuery(event.target.value)} />
            <ul className="collection-list">{rows.map(item => <li key={item.name}><div><h3>{item.name}</h3><p>{item.kind}</p></div><span>{item.count} notes</span></li>)}</ul>
            {rows.length === 0 ? <p role="status">No collections match. Try another search.</p> : null}
          </section>
          <section className="panel activity" aria-labelledby="activity-title"><h2 id="activity-title">A week of ideas</h2><p>Notes collected each day</p>
            <figure><figcaption className="sr-only">Monday 3, Tuesday 7, Wednesday 4, Thursday 9, Friday 6 notes.</figcaption><div className="chart" aria-hidden="true">{[3,7,4,9,6].map((value, index) => <div className="chart-column" key={index}><span>{value}</span><div className="bar" style={{height: `${value * 10}px`}} /><span>{['Mon','Tue','Wed','Thu','Fri'][index]}</span></div>)}</div></figure>
          </section>
          <section className="panel reflection" aria-labelledby="reflection-title"><h2 id="reflection-title">A thought to keep</h2>
            <motion.p key={`${state.key}-${staticMode}-${reduced}`} initial={state.duration ? { opacity: 1, y: state.distance } : false} animate={{opacity: 1, y: 0}} transition={{duration: state.duration / 1000}}>Good ideas need somewhere to land.</motion.p>
            <p className="quiet">A small motion study, replayed when the profile changes.</p>
          </section>
        </div>
        <section className="profile-details" id="changes" aria-labelledby="details-title"><h2 id="details-title">What changed</h2>
          <dl>{[['Composition',state.recipe === 'flow' ? 'Flow with side controls' : 'Tiles with top controls'], ['Typography', 'Profile heading and body families'], ['Shape', 'Profile corners and border weight'], ['Surface', 'Profile fill and elevation'], ['Density', 'Profile spacing and panel padding'], ['Motion', state.duration ? 'Profile transition timing' : 'Static fallback']].map(([term,description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl>
        </section>
        <footer>These curated specimen profiles are public. Original design documents and the other source profiles remain private.</footer>
      </section>
    </div>
  </MotionConfig>;
}
