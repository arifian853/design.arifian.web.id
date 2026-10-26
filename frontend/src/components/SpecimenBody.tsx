import type { ComponentType } from 'react';
export function renderSpecimen(slug: string, renderers: Record<string, ComponentType>) {
  const Renderer = renderers[slug];
  if (!Renderer) throw new Error('Unknown showcase specimen');
  return <div className="specimen-body" data-specimen={slug}><Renderer/></div>;
}
