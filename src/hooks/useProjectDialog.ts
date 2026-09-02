import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ProjectIdentity = { slug: string };

export function readProjectSlug(search: string, validSlugs: ReadonlySet<string>): string | null {
  const slug = new URLSearchParams(search).get('project');
  return slug && validSlugs.has(slug) ? slug : null;
}

export function createProjectUrl(currentUrl: string, slug: string | null): string {
  const url = new URL(currentUrl);
  if (slug) url.searchParams.set('project', slug);
  else url.searchParams.delete('project');
  return url.toString();
}

export function useProjectDialog<TProject extends ProjectIdentity>(projects: readonly TProject[]) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const selectionWasOpenRef = useRef(false);
  const validSlugs = useMemo(
    () => new Set(projects.map(({ slug }) => slug)),
    [projects]
  );
  const selectedIndex = projects.findIndex(({ slug }) => slug === selectedSlug);
  const selectedProject = selectedIndex >= 0 ? projects[selectedIndex] : null;

  useEffect(() => {
    const syncFromUrl = () => {
      const nextSlug = readProjectSlug(window.location.search, validSlugs);
      if (selectionWasOpenRef.current && !nextSlug) {
        requestAnimationFrame(() => openerRef.current?.focus());
      }
      selectionWasOpenRef.current = Boolean(nextSlug);
      setSelectedSlug(nextSlug);
    };
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [validSlugs]);

  const openProject = useCallback((project: TProject, trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
    selectionWasOpenRef.current = true;
    window.history.pushState({}, '', createProjectUrl(window.location.href, project.slug));
    setSelectedSlug(project.slug);
  }, []);

  const closeProject = useCallback(() => {
    window.history.replaceState({}, '', createProjectUrl(window.location.href, null));
    selectionWasOpenRef.current = false;
    setSelectedSlug(null);
    requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  return { selectedSlug, selectedIndex, selectedProject, openProject, closeProject } as const;
}
