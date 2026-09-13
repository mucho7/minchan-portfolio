import type { CareerProjectSlug } from '../types/portfolio';

export const PROFILE = {
  name: '김민찬', englishName: 'Minchan Kim', role: 'Frontend Engineer',
  stack: 'React / TypeScript',
  email: 'mailto:ydjm1994@gmail.com', github: 'https://github.com/mucho7'
} as const;

export type CareerBadge = {
  id: string;
  title: string;
  period?: string;
  role: string;
  design?: import('../components/hero/badge-design').BadgeDesign;
  summary: string;
  projects: readonly CareerProjectSlug[];
};

export const CAREER_BADGES: readonly CareerBadge[] = [
  {
    id: 'ahha', title: '아하랩스', period: '2024.11 – 재직 중', role: 'Frontend 연구원',
    design: { strapColor: '#000000', strapBorderColor: '#e60027', strapPattern: { src: `${import.meta.env.BASE_URL}assets/ahha-strap.svg`, repeatLength: 108 } },
    summary: 'AI 워크플로우와 제조 관제 제품에서 복잡한 데이터와 상태를 다룹니다. 노드 UI의 응답성을 개선하고, 여러 화면이 같은 시간과 위치를 보여주도록 재생 구조를 설계했습니다.',
    projects: ['tooling-ui-flow', 'manufacturing-monitoring-poc', 'time-series-performance', 'agent-ui-reuse']
  },
  {
    id: 'tmax', title: '티맥스 클라우드', period: '2023.08 – 2024.11', role: 'Frontend 연구원',
    design: {
      backgroundColor: '#ffffff', strapColor: '#183b80', strapBorderColor: '#bd2839',
      strapPattern: { src: `${import.meta.env.BASE_URL}assets/tmax-strap.svg`, repeatLength: 108 },
      footer: { colors: ['#bd2839', '#183b80'], split: 70 }
    },
    summary: '브라우저에서 파일을 탐색하고 편집·저장·복원하는 Web IDE와 클라우드 플랫폼 관리 화면을 개발했습니다. IndexedDB 저장 구조와 AST 분석 결과를 편집 흐름에 연결했습니다.',
    projects: ['web-ide-rendering']
  },
  {
    id: 'personal', title: '개인 프로젝트', role: '포트폴리오 · 사이드 프로젝트',
    summary: 'Vercel Ship 2024에서 직접 접한 인터랙티브 출입증이 오래 기억에 남았습니다. 그 경험을 효과로 복제하기보다, 회사와 개인 작업을 실제 사원증처럼 당겨서 탐색하는 포트폴리오 구조로 바꿔 보았습니다.',
    projects: ['portfolio-engineering']
  }
];
