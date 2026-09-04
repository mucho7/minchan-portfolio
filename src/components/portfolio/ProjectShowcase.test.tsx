import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { ProjectViewModel } from '../../types/portfolio';
import { ProjectShowcase } from './ProjectShowcase';

const projects = [
  {
    slug: 'time-series-performance',
    title: '시계열 성능 개선',
    company: '(주) 아하랩스',
    summary: '대량 시계열 탐색 성능을\n개선했습니다.',
    order: 1,
    period: '2024',
    role: 'Frontend Engineer',
    skills: ['React'],
    metrics: ['5천만 포인트급 시계열 탐색'],
    preview: { problem: '느린\n탐색', decision: '렌더 분리', result: '지연 감소' },
    href: '/case-studies/time-series-performance/'
  },
  {
    slug: 'agent-ui-reuse',
    title: 'Agent UI 공통화',
    company: '(주) 아하랩스',
    summary: '반복 구현을 공통 패키지로 전환했습니다.',
    order: 2,
    period: '2024',
    role: 'Frontend Engineer',
    skills: ['TypeScript'],
    metrics: ['약 60% 재사용'],
    preview: { problem: '반복 구현', decision: '패키지 분리', result: '재사용' },
    href: '/case-studies/agent-ui-reuse/'
  }
] satisfies ProjectViewModel[];

describe('ProjectShowcase', () => {
  it('선택한 탭과 패널 및 CTA를 함께 바꾼다', async () => {
    render(<ProjectShowcase projects={projects} />);
    const agentTab = screen.getByRole('tab', { name: 'Agent UI' });

    await userEvent.click(agentTab);

    expect(agentTab).toHaveAttribute('aria-selected', 'true');
    expect(agentTab).toHaveStyle({ backgroundColor: '#f26130', color: '#ffffff' });
    expect(screen.getByRole('tabpanel')).toHaveTextContent('반복 구현 영역,');
    expect(screen.getByRole('link', { name: '전체 Case Study 읽기' })).toHaveAttribute('href', '/case-studies/agent-ui-reuse/');
  });

  it('방향키로 다음 탭을 선택하고 포커스를 이동한다', async () => {
    render(<ProjectShowcase projects={projects} />);
    const firstTab = screen.getByRole('tab', { name: '시계열' });
    const secondTab = screen.getByRole('tab', { name: 'Agent UI' });
    firstTab.focus();

    await userEvent.keyboard('{ArrowRight}');

    expect(secondTab).toHaveFocus();
    expect(secondTab).toHaveAttribute('aria-selected', 'true');
  });

  it('Summary와 preview의 줄바꿈을 화면에 반영한다', () => {
    render(<ProjectShowcase projects={projects} />);

    expect(screen.getByText(/대량 시계열 탐색 성능을/)).toHaveClass('whitespace-pre-line');
    expect(screen.getByText(/느린/)).toHaveClass('whitespace-pre-line');
  });
});
