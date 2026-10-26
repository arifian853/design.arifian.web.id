import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Field, FieldLabel } from './ui/field';
import { categories, catalog, origins, originLabel, readCatalogFilters, writeCatalogFilters, specimenHref, searchCatalog, type CatalogEntry } from '../lib/catalog';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from './ui/empty';
import { Button } from './ui/button';

export default function ComponentCatalog({ entries = catalog.filter(entry => entry.kind === 'component') }: { entries?: CatalogEntry[] }) {
  const [filters, setFilters] = useState({ query: '', category: 'all', origin: 'all' });
  useEffect(() => {
    const sync = () => setFilters(readCatalogFilters(location.search));
    sync(); window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  function update(query: string, category: string, origin = filters.origin) {
    const next = { query, category, origin };
    setFilters(next); history.replaceState(null, '', writeCatalogFilters(new URL(location.href), next));
  }
  const { query, category, origin } = filters;
  const matches = searchCatalog(query, category, entries, origin);
  return <section className="catalog-browser" aria-label="Component collection"><div className="catalog-tools"><Field><FieldLabel htmlFor="component-search">Find a component</FieldLabel><div className="search-field"><Search aria-hidden="true" /><Input id="component-search" name="q" type="search" autoComplete="off" placeholder="Search names, purpose or behavior…" value={query} onChange={event => update(event.target.value, category)} /></div></Field><div className="category-filters" role="group" aria-label="Filter by category"><button type="button" aria-pressed={category === 'all'} onClick={() => update(query, 'all')}>All components</button>{categories.map(item => <button key={item.slug} type="button" aria-pressed={category === item.slug} onClick={() => update(query, item.slug)}>{item.name}</button>)}</div><Field><FieldLabel htmlFor="component-origin">Origin</FieldLabel><select id="component-origin" name="origin" className="catalog-origin" value={origin} onChange={event => update(query, category, event.target.value)}><option value="all">All origins</option>{origins.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field></div><p className="result-count" role="status">{matches.length} {matches.length === 1 ? 'component' : 'components'}{query ? ` matching “${query}”` : ' to explore'}</p><div className="catalog-index">{matches.map((entry,index) => <a key={entry.slug} href={specimenHref(entry)} className="index-card"><div className="index-card-meta"><span>{entry.category.replace('-', ' ')}</span><span>{String(index+1).padStart(2,'0')}</span></div><h2>{entry.name}<span aria-hidden="true">↗</span></h2><p>{entry.summary}</p><span className="index-card-origin">{originLabel(entry.origin)}</span></a>)}</div>{!matches.length && <Empty><EmptyHeader><EmptyTitle>No matching components</EmptyTitle><EmptyDescription>Try a broader term or explore another category.</EmptyDescription></EmptyHeader><EmptyContent><Button variant="outline" onClick={() => update('', 'all', 'all')}>Clear filters</Button></EmptyContent></Empty>}</section>;
}
