import type { CollectionEntry } from 'astro:content';

export const FEATURED_PROJECT_SLUGS = [
  'manufacturing-monitoring-poc',
  'time-series-performance',
  'agent-ui-reuse',
  'tooling-ui-flow',
  'web-ide-rendering'
] as const;

export type FeaturedProjectSlug = (typeof FEATURED_PROJECT_SLUGS)[number];
export type CaseStudyEntry = CollectionEntry<'case-studies'>;
export type CaseStudyData = CaseStudyEntry['data'];
export type ProjectPreviewKey = keyof CaseStudyData['preview'];

export type ProjectViewModel = CaseStudyData & {
  slug: string;
  href: string;
};

export type ProjectPresentation = {
  label: string;
  accent: `#${string}`;
  contrast: `#${string}`;
  headline: readonly [string, string];
};
