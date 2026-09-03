import type {
  EvidenceItem,
  ProjectPreviewKey,
  ProjectTone,
  SectionNavigationItem
} from '../types/portfolio';

export const HERO_LINES = ['복잡한 데이터를', '명료한 제품흐름으로'] as const;

export const EVIDENCE = [
  { value: '4주', label: 'AI Agent MVP · FE 구현' },
  { value: '50M+', label: '시계열 데이터 탐색 경험' },
  { value: '20–30 → 2', label: 'Web IDE 주요 갱신 렌더링' },
  { value: '1h → 10–13m', label: 'AI 태스크 자동화 · 검토 포함' }
] as const satisfies readonly EvidenceItem[];

export const SECTION_NAVIGATION = [
  { number: '01', label: 'Intro', href: '#hero' },
  { number: '02', label: 'Project', href: '#work' },
  { number: '03', label: 'Approach', href: '#approach' },
  { number: '04', label: 'Contact', href: '#contact' }
] as const satisfies readonly SectionNavigationItem[];

export const PROJECT_TONES = [
  'bg-[#dce6cf]',
  'bg-[#d6e2e8]',
  'bg-[#e9d8c7]',
  'bg-[#ded8e9]'
] as const satisfies readonly ProjectTone[];

export const PROJECT_PREVIEW_LABELS = {
  problem: 'Problem',
  decision: 'Decision',
  result: 'Result'
} as const satisfies Record<ProjectPreviewKey, string>;
