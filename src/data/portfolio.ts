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
    headline: ['리포트와 공장 맵을,', '같은 시간축으로.']
  },
  'time-series-performance': {
    label: '시계열',
    accent: '#0073eb',
    contrast: '#ffffff',
    headline: ['5천만 건 시계열을,', 'LTTB로 탐색 가능하게.']
  },
  'agent-ui-reuse': {
    label: 'Agent UI',
    accent: '#f26130',
    contrast: '#ffffff',
    headline: ['반복하던 Agent UI를,', '공통 패키지로.']
  },
  'tooling-ui-flow': {
    label: 'Workflow',
    accent: '#16914f',
    contrast: '#ffffff',
    headline: ['노드 생성 지연을,', '20ms 이하로.']
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
