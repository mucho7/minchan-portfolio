import { motion, useReducedMotion } from 'framer-motion';
import type { ProjectViewModel } from '../../types/portfolio';
import {
  PROJECT_BUTTON_BASE_CLASSNAME,
  PROJECT_BUTTON_CLOSED_CLASSNAME,
  PROJECT_BUTTON_OPEN_CLASSNAME
} from './styles';

type ProjectListProps = {
  projects: readonly ProjectViewModel[];
  selectedSlug: string | null;
  onSelect: (project: ProjectViewModel, trigger: HTMLButtonElement) => void;
};

export function ProjectList({ projects, selectedSlug, onSelect }: ProjectListProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="border-b border-black/25">
      {projects.map((project, index) => {
        const isOpen = selectedSlug === project.slug;
        const stateClassName = isOpen
          ? PROJECT_BUTTON_OPEN_CLASSNAME
          : PROJECT_BUTTON_CLOSED_CLASSNAME;

        return (
          <motion.button
            key={project.slug}
            type="button"
            className={`${PROJECT_BUTTON_BASE_CLASSNAME} ${stateClassName}`}
            onClick={(event) => onSelect(project, event.currentTarget)}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            whileTap={reduceMotion ? undefined : { scale: 0.995 }}
          >
            <span className="font-mono text-xs text-black/40">0{index + 1}</span>
            <span>
              <span className="block text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
                {project.title}
              </span>
              <span className="mt-2 block max-w-2xl text-sm leading-6 text-black/55">
                {project.summary}
              </span>
            </span>
            <span className="flex items-center gap-3 text-sm text-black/45">
              <span className="hidden sm:inline">Detail</span>
              <span className="text-xl transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
