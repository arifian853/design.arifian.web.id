import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Field, FieldLabel } from './ui/field';
import { categories, catalog, searchCatalog, type CatalogEntry } from '../lib/catalog';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from './ui/empty';
import { Button } from './ui/button';

function specimenHref(entry: CatalogEntry) {
  return `${entry.kind === 'component' ? `/components/${entry.category}/` : entry.kind === 'motion' ? '/motion/' : '/patterns/'}#${entry.slug}`;
}
export default function ComponentCatalog({ entries = catalog.filter(entry => entry.kind === 'component') }: { entries?: CatalogEntry[]; profileName?: string }) {
  const [query, setQuery] = useState(''); const [category, setCategory] = useState('all');
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get('q') ?? '');
    const value = params.get('category');
    if (categories.some(item => item.slug === value)) setCategory(value!);
    const onPop = () => { const next = new URLSearchParams(location.search); setQuery(next.get('q') ?? ''); setCategory(next.get('category') ?? 'all'); };
    window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop);
  }, []);
  function update(nextQuery: string, nextCategory: string) {
    setQuery(nextQuery); setCategory(nextCategory);
    const url = new URL(location.href);
    nextQuery ? url.searchParams.set('q', nextQuery) : url.searchParams.delete('q');
    nextCategory === 'all' ? url.searchParams.delete('category') : url.searchParams.set('category', nextCategory);
    history.replaceState(null, '', url);
  }
  const matches = searchCatalog(query, category, entries);
  return <section className="catalog-browser" aria-label="Component collection"><div className="catalog-tools"><Field><FieldLabel htmlFor="component-search">Find a component</FieldLabel><div className="search-field"><Search aria-hidden="true" /><Input id="component-search" name="q" type="search" autoComplete="off" placeholder="Search names, purpose or behavior…" value={query} onChange={event => update(event.target.value, category)} /></div></Field><div className="category-filters" role="group" aria-label="Filter by category"><button type="button" aria-pressed={category === 'all'} onClick={() => update(query, 'all')}>All components</button>{categories.map(item => <button key={item.slug} type="button" aria-pressed={category === item.slug} onClick={() => update(query, item.slug)}>{item.name}</button>)}</div></div><p className="result-count" role="status">{matches.length} {matches.length === 1 ? 'component' : 'components'}{query ? ` matching “${query}”` : ' to explore'}</p><div className="catalog-index">{matches.map((entry,index) => <a key={entry.slug} href={specimenHref(entry)} className="index-card"><div className="index-card-meta"><span>{entry.category.replace('-', ' ')}</span><span>{String(index+1).padStart(2,'0')}</span></div><h2>{entry.name}<span aria-hidden="true">↗</span></h2><p>{entry.summary}</p><span className="index-card-origin">{entry.original ? 'Arifian Original' : entry.origin}</span></a>)}</div>{!matches.length && <Empty><EmptyHeader><EmptyTitle>No matching components</EmptyTitle><EmptyDescription>Try a broader term or explore another category.</EmptyDescription></EmptyHeader><EmptyContent><Button variant="outline" onClick={() => update('', 'all')}>Clear filters</Button></EmptyContent></Empty>}</section>;
}
