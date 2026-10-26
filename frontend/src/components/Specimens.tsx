import type { ComponentType } from 'react';
import type { SpecimenId } from '../lib/specimen-ids';
import { coreRenderers } from './CoreSpecimens';
import { portfolioRenderers } from './PortfolioSpecimens';
import { primitiveRenderers } from './PrimitiveSpecimens';
import { curatedRenderers } from './CuratedSpecimens';
import { chartRenderers } from './ChartGallery';
import { renderSpecimen } from './SpecimenBody';

/** Test/build registry. Browser islands import only their implementation group. */
export const specimenRenderers: Record<SpecimenId, ComponentType> = {
  ...coreRenderers, ...portfolioRenderers, ...primitiveRenderers, ...curatedRenderers, ...chartRenderers,
};
export function Specimen({ slug }: { slug: string }) { return renderSpecimen(slug, specimenRenderers); }
