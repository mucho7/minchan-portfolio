import type {
  FeaturedProjectSlug,
  ProjectPresentation,
  ProjectPreviewKey
} from '../types/portfolio';

export const HERO_LINES = ['복잡한 데이터를', '명료한 제품 흐름으로.'] as const;

export const PROJECT_PRESENTATIONS = {
  'time-series-performance': {
    label: '시계열',
    accent: '#0073eb',
    contrast: '#ffffff',
    headline: ['5천만 건의 시계열을,', '탐색 가능한 제품 흐름으로.']
  },
  'agent-ui-reuse': {
    label: 'Agent UI',
    accent: '#f26130',
    contrast: '#1d1d1f',
    headline: ['반복 구현 영역을,', '공통 제품 언어로.']
  },
  'web-ide-rendering': {
    label: 'Web IDE',
    accent: '#f20151',
    contrast: '#1d1d1f',
    headline: ['주요 갱신 렌더링을,', '20-30회에서 2회로.']
  },
  'tooling-ui-flow': {
    label: 'Workflow',
    accent: '#16914f',
    contrast: '#1d1d1f',
    headline: ['멈추던 워크플로우를,', '20ms 이하의 흐름으로.']
  }
} as const satisfies Record<FeaturedProjectSlug, ProjectPresentation>;

export const PROJECT_PREVIEW_LABELS = {
  problem: 'Problem',
  decision: 'Decision',
  result: 'Result'
} as const satisfies Record<ProjectPreviewKey, string>;
