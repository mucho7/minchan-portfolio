import { motion, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { PROJECT_PREVIEW_LABELS, PROJECT_TONES } from '../../data/portfolio';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { DIALOG_PANEL_VARIANTS, EMPHASIZED_EASE } from '../../motion/variants';
import type { ProjectViewModel } from '../../types/portfolio';
import { CLOSE_BUTTON_CLASSNAME, CTA_CLASSNAME, EYEBROW_CLASSNAME } from './styles';

type ProjectDetailDialogProps = {
  project: ProjectViewModel;
  index: number;
  onClose: () => void;
};

export function ProjectDetailDialog({ project, index, onClose }: ProjectDetailDialogProps) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tone = PROJECT_TONES[index % PROJECT_TONES.length];

  useFocusTrap({ containerRef: dialogRef, initialFocusRef: closeRef, onEscape: onClose });

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 p-3 sm:p-7 lg:p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22 }}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-${project.slug}-title`}
        aria-describedby={`project-${project.slug}-summary`}
        className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-6xl bg-[var(--paper)] shadow-2xl sm:min-h-0"
        variants={reduceMotion ? undefined : DIALOG_PANEL_VARIANTS}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        exit={reduceMotion ? undefined : 'exit'}
        transition={{ duration: reduceMotion ? 0 : 0.34, ease: EMPHASIZED_EASE }}
      >
        <header className={`${tone} relative min-h-[23rem] overflow-hidden p-6 sm:p-10 lg:p-14`}>
          <div className="flex items-start justify-between gap-8">
            <p className={EYEBROW_CLASSNAME}>Project detail · 0{index + 1}</p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className={CLOSE_BUTTON_CLASSNAME}
              aria-label="프로젝트 상세 닫기"
            >
              ×
            </button>
          </div>
          <div className="mt-16 max-w-4xl sm:mt-24">
            <p className="mb-5 text-sm text-black/55">{project.period} · {project.role}</p>
            <h2
              id={`project-${project.slug}-title`}
              className="text-[clamp(2.6rem,7vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.07em]"
            >
              {project.title}
            </h2>
          </div>
        </header>

        <div className="grid gap-12 p-6 sm:p-10 lg:grid-cols-[1fr_18rem] lg:p-14">
          <div>
            <p
              id={`project-${project.slug}-summary`}
              className="max-w-3xl text-xl leading-8 tracking-[-0.025em] sm:text-2xl sm:leading-9"
            >
              {project.summary}
            </p>
            <dl className="mt-12 divide-y divide-black/20 border-y border-black/20">
              {Object.entries(project.preview).map(([key, value]) => (
                <div key={key} className="grid gap-3 py-7 sm:grid-cols-[8rem_1fr]">
                  <dt className={EYEBROW_CLASSNAME}>
                    {PROJECT_PREVIEW_LABELS[key as keyof typeof PROJECT_PREVIEW_LABELS]}
                  </dt>
                  <dd className="max-w-2xl leading-7 text-black/70">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="border-t border-black/25 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <p className={EYEBROW_CLASSNAME}>Evidence</p>
            <ul className="mt-4 space-y-3">
              {project.metrics.map((metric) => (
                <li key={metric} className="text-lg font-semibold tracking-[-0.03em]">{metric}</li>
              ))}
            </ul>
            <p className={`${EYEBROW_CLASSNAME} mt-10`}>Stack</p>
            <p className="mt-4 text-sm leading-7 text-black/60">{project.skills.join(' · ')}</p>
          </aside>
        </div>

        <footer className="flex flex-col gap-5 border-t border-black/25 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10 lg:px-14">
          <p className="text-sm text-black/50">구현 과정과 한계까지 정리한 전체 기록</p>
          <a href={project.href} className={CTA_CLASSNAME}>
            전체 Case Study 읽기 <span aria-hidden="true">↗</span>
          </a>
        </footer>
      </motion.div>
    </motion.div>
  );
}
