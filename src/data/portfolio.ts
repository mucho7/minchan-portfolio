import type {
  FeaturedProjectSlug,
  ProjectPresentation,
  ProjectPreviewKey
} from '../types/portfolio';

export const HERO_LINES = ['복잡한 B2B 업무를', '안정적인 도구로.'] as const;

export const PROJECT_PRESENTATIONS = {
  'manufacturing-monitoring-poc': {
    label: '제조 관제',
    accent: '#16914f',
    contrast: '#ffffff',
    headline: ['다른 주기의 현장 상태를,', '하나의 검증 일정으로.']
  },
  'time-series-performance': {
    label: '시계열',
    accent: '#0073eb',
    contrast: '#ffffff',
    headline: ['5천만 건의 시계열을,', '탐색 가능한 제품 흐름으로.']
  },
  'agent-ui-reuse': {
    label: 'Agent UI',
    accent: '#f26130',
    contrast: '#ffffff',
    headline: ['반복 구현 영역을,', '공통 제품 언어로.']
  },
  'tooling-ui-flow': {
    label: 'Workflow',
    accent: '#16914f',
    contrast: '#ffffff',
    headline: ['멈추던 워크플로우를,', '20ms 이하의 흐름으로.']
  },
  'web-ide-rendering': {
    label: 'Web IDE',
    accent: '#f20151',
    contrast: '#ffffff',
    headline: ['브라우저 저장 한계를,', 'IndexedDB 구조로.']
  }
} as const satisfies Record<FeaturedProjectSlug, ProjectPresentation>;

export const PROJECT_PREVIEW_LABELS = {
  problem: 'Problem',
  decision: 'Decision',
  result: 'Result'
} as const satisfies Record<ProjectPreviewKey, string>;
