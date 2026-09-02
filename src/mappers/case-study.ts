import type { CaseStudyEntry, ProjectViewModel } from '../types/portfolio';

type CaseStudySource = Pick<CaseStudyEntry, 'id' | 'data'>;

export function toProjectViewModel(
  study: CaseStudySource,
  createHref: (slug: string) => string
): ProjectViewModel {
  return {
    slug: study.id,
    ...study.data,
    href: createHref(study.id)
  };
}
