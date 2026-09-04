import { describe, expect, it } from 'vitest';
import type { CaseStudyData } from '../types/portfolio';
import { toProjectViewModel } from './case-study';

const caseStudyData = {
  title: 'Typed portfolio',
  company: '테스트 회사',
  summary: '콘텐츠와 UI 사이의 계약을 검증합니다.',
  order: 1,
  period: '2026',
  role: 'Frontend Engineer',
  skills: ['TypeScript', 'Astro'],
  metrics: ['strict mode'],
  preview: {
    problem: '중복 타입',
    decision: '스키마 기반 타입 추론',
    result: '변경 시 컴파일 단계에서 오류 발견'
  }
} satisfies CaseStudyData;

describe('toProjectViewModel', () => {
  it('콘텐츠 엔트리를 클라이언트가 사용할 링크 포함 모델로 변환한다', () => {
    const project = toProjectViewModel(
      { id: 'typed-portfolio', data: caseStudyData },
      (slug) => `/minchan-portfolio/case-studies/${slug}/`
    );

    expect(project).toMatchObject({
      slug: 'typed-portfolio',
      title: 'Typed portfolio',
      href: '/minchan-portfolio/case-studies/typed-portfolio/'
    });
  });
});
