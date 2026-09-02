import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ProjectViewModel } from '../../types/portfolio';
import { ProjectList } from './ProjectList';

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

describe('ProjectList', () => {
  it('open 상태와 aria-expanded를 일치시킨다', () => {
    render(<ProjectList projects={[project]} selectedSlug={project.slug} onSelect={() => undefined} />);
    expect(screen.getByRole('button', { name: /Typed portfolio/ })).toHaveAttribute('aria-expanded', 'true');
  });

  it('선택 시 프로젝트와 실제 trigger를 전달한다', async () => {
    const onSelect = vi.fn();
    render(<ProjectList projects={[project]} selectedSlug={null} onSelect={onSelect} />);
    const trigger = screen.getByRole('button', { name: /Typed portfolio/ });
    await userEvent.click(trigger);
    expect(onSelect).toHaveBeenCalledWith(project, trigger);
  });
});
