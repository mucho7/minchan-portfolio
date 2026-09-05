import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { PROJECT_PRESENTATIONS, PROJECT_PREVIEW_LABELS } from '../../data/portfolio';
import type { FeaturedProjectSlug, ProjectViewModel } from '../../types/portfolio';
import { FOCUS_CLASSNAME } from './styles';

type ProjectShowcaseProps = {
  projects: readonly ProjectViewModel[];
};

const FALLBACK_PRESENTATION = {
  label: 'Project',
  accent: '#0073eb',
  contrast: '#ffffff',
  headline: ['복잡한 문제를,', '명료한 제품 흐름으로.']
} as const;

function getPresentation(slug: string) {
  return PROJECT_PRESENTATIONS[slug as FeaturedProjectSlug] ?? FALLBACK_PRESENTATION;
}

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();
  const activeProject = projects[activeIndex];

  if (!activeProject) {
    return <p className="rounded-2xl bg-[var(--surface)] px-6 py-16 text-center text-[var(--ink-muted)]">표시할 Case Study가 없습니다.</p>;
  }

  const presentation = getPresentation(activeProject.slug);
  const panelStyle = {
    '--project-accent': presentation.accent,
    '--project-contrast': presentation.contrast
  } as CSSProperties;

  function selectTab(index: number, moveFocus = false) {
    const nextIndex = (index + projects.length) % projects.length;
    setActiveIndex(nextIndex);
    if (moveFocus) tabRefs.current[nextIndex]?.focus();
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectTab(index - 1, true);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectTab(index + 1, true);
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectTab(0, true);
    } else if (event.key === 'End') {
      event.preventDefault();
      selectTab(projects.length - 1, true);
    }
  }

  return (
    <div className="mt-10 sm:mt-14">
      <div className="mx-auto w-fit max-w-full overflow-x-auto rounded-full bg-[var(--nav-surface)] p-1.5" role="tablist" aria-label="대표 Case Study 선택">
        <div className="flex min-w-max gap-1">
          {projects.map((project, index) => {
            const item = getPresentation(project.slug);
            const isActive = index === activeIndex;

            return (
              <button
                key={project.slug}
                ref={(element) => { tabRefs.current[index] = element; }}
                id={`project-tab-${project.slug}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`project-panel-${project.slug}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectTab(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-[background-color,color,transform] active:scale-[0.98] sm:px-5 ${FOCUS_CLASSNAME}`}
                style={isActive ? { backgroundColor: item.accent, color: '#ffffff' } : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <motion.article
        key={activeProject.slug}
        id={`project-panel-${activeProject.slug}`}
        role="tabpanel"
        aria-labelledby={`project-tab-${activeProject.slug}`}
        style={panelStyle}
        className="mt-6 overflow-hidden rounded-[2rem] bg-[var(--surface)] sm:mt-8"
        initial={reduceMotion ? false : { opacity: 0.7, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
          <div className="grid gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.65fr)] lg:gap-16 lg:px-16 lg:py-20">
            <div>
              <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold text-[var(--ink-secondary)]">
                <span>{activeProject.company}</span>
                <span className="font-normal text-[var(--ink-muted)]">{activeProject.period}</span>
              </p>
              <h3 className="mt-5 max-w-4xl text-[clamp(2.5rem,6vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
                <span className="block text-[var(--ink-muted)]">{presentation.headline[0]}</span>
                <span className="block text-[var(--project-accent)]">{presentation.headline[1]}</span>
              </h3>
              <p className="mt-8 max-w-2xl whitespace-pre-line text-base leading-7 text-[var(--ink-secondary)] sm:text-lg sm:leading-8">{activeProject.summary}</p>
              <a
                href={activeProject.href}
                className={`mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--project-accent)] px-6 text-sm font-semibold text-[var(--project-contrast)] shadow-[0_10px_28px_color-mix(in_srgb,var(--project-accent)_18%,transparent)] transition-[filter,transform] hover:brightness-95 active:scale-[0.98] sm:text-base ${FOCUS_CLASSNAME}`}
              >
                전체 Case Study 읽기
              </a>
            </div>

            <aside className="self-end border-t border-[var(--line)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-sm font-semibold text-[var(--ink)]">요약 정보</p>
              <ul className="mt-4 space-y-3">
                {activeProject.metrics.map((metric) => (
                  <li key={metric} className="text-lg font-semibold leading-7 tracking-[-0.02em] text-[var(--ink)]">{metric}</li>
                ))}
              </ul>
              <p className="mt-8 text-sm leading-7 text-[var(--ink-muted)]">{activeProject.role}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">{activeProject.skills.join(', ')}</p>
            </aside>
          </div>

          <dl className="grid border-t border-[var(--line)] md:grid-cols-3">
            {Object.entries(activeProject.preview).map(([key, value], index) => (
              <div key={key} className={`px-6 py-8 sm:px-10 lg:px-12 ${index > 0 ? 'border-t border-[var(--line)] md:border-l md:border-t-0' : ''}`}>
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">
                  {PROJECT_PREVIEW_LABELS[key as keyof typeof PROJECT_PREVIEW_LABELS]}
                </dt>
                <dd className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--ink-secondary)]">{value}</dd>
              </div>
            ))}
          </dl>
      </motion.article>
    </div>
  );
}
