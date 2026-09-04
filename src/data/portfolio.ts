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
    headline: ['다양한 현장 상태,', '한 솔루션에서.']
  },
  'time-series-performance': {
    label: '시계열',
    accent: '#0073eb',
    contrast: '#ffffff',
    headline: ['5천만의 시계열 정보,', '탐색 가능한 화면으로.']
  },
  'agent-ui-reuse': {
    label: 'Agent UI',
    accent: '#f26130',
    contrast: '#ffffff',
    headline: ['반복 구현 영역,', '공통 제품 언어로.']
  },
  'tooling-ui-flow': {
    label: 'Workflow',
    accent: '#16914f',
    contrast: '#ffffff',
    headline: ['멈추던 워크플로우를,', '60FPS로.']
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
