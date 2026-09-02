import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ProjectViewModel } from '../../types/portfolio';
import { ProjectDetailDialog } from './ProjectDetailDialog';

const project = {
  slug: 'typed-portfolio',
  title: 'Typed portfolio',
  summary: '타입 계약을 보여주는 프로젝트',
  order: 1,
  period: '2026',
  role: 'Frontend Engineer',
  skills: ['TypeScript'],
  metrics: ['strict'],
  preview: { problem: '중복', decision: '통합', result: '검증' },
  href: '/case-studies/typed-portfolio/'
} satisfies ProjectViewModel;

describe('ProjectDetailDialog', () => {
  it('초기 포커스를 닫기 버튼에 두고 Escape로 닫는다', async () => {
    const onClose = vi.fn();
    render(<ProjectDetailDialog project={project} index={0} onClose={onClose} />);
    const closeButton = screen.getByRole('button', { name: '프로젝트 상세 닫기' });
    expect(closeButton).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });
});
