import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { createProjectUrl, readProjectSlug, useProjectDialog } from './useProjectDialog';

const projects = [{ slug: 'alpha' }, { slug: 'beta' }] as const;

describe('project URL helpers', () => {
  it('등록된 slug만 URL 상태로 허용한다', () => {
    const validSlugs = new Set(['alpha', 'beta']);
    expect(readProjectSlug('?project=alpha', validSlugs)).toBe('alpha');
    expect(readProjectSlug('?project=unknown', validSlugs)).toBeNull();
  });

  it('다른 query를 보존하면서 project query만 변경한다', () => {
    const opened = createProjectUrl('https://example.com/?source=portfolio', 'alpha');
    const closed = createProjectUrl(opened, null);
    expect(opened).toContain('source=portfolio&project=alpha');
    expect(closed).toBe('https://example.com/?source=portfolio');
  });
});

describe('useProjectDialog', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/minchan-portfolio/');
  });

  it('열기와 닫기를 URL, 선택 상태, 포커스 복귀와 함께 동기화한다', async () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    const { result } = renderHook(() => useProjectDialog(projects));

    act(() => result.current.openProject(projects[0], trigger));
    expect(result.current.selectedProject).toEqual(projects[0]);
    expect(window.location.search).toBe('?project=alpha');

    act(() => result.current.closeProject());
    expect(result.current.selectedProject).toBeNull();
    expect(window.location.search).toBe('');
    await waitFor(() => expect(trigger).toHaveFocus());
    trigger.remove();
  });

  it('브라우저 뒤로가기로 query가 사라질 때도 trigger로 포커스를 복귀한다', async () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    const { result } = renderHook(() => useProjectDialog(projects));

    act(() => result.current.openProject(projects[1], trigger));
    act(() => {
      window.history.replaceState({}, '', '/minchan-portfolio/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current.selectedProject).toBeNull();
    await waitFor(() => expect(trigger).toHaveFocus());
    trigger.remove();
  });
});
