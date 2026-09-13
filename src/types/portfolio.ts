import type { CollectionEntry } from 'astro:content';

export const CAREER_PROJECT_SLUGS = [
  'manufacturing-monitoring-poc',
  'time-series-performance',
  'agent-ui-reuse',
  'tooling-ui-flow',
  'web-ide-rendering',
  'portfolio-engineering'
] as const;

export type CareerProjectSlug = (typeof CAREER_PROJECT_SLUGS)[number];
export type CaseStudyEntry = CollectionEntry<'case-studies'>;
export type CaseStudyData = CaseStudyEntry['data'];

export type ProjectViewModel = CaseStudyData & {
  slug: string;
  href: string;
};
