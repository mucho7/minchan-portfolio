import { motion, useReducedMotion } from 'framer-motion';
import { HERO_LINES } from '../data/portfolio';
import { EMPHASIZED_EASE, SECTION_REVEAL_TRANSITION, SECTION_REVEAL_VARIANTS } from '../motion/variants';
import type { ProjectViewModel } from '../types/portfolio';
import { ProjectShowcase } from './portfolio/ProjectShowcase';
import { FOCUS_CLASSNAME } from './portfolio/styles';
import { SiteHeader } from './SiteHeader';

type PortfolioExperienceProps = {
  projects: readonly ProjectViewModel[];
  homeHref: string;
  aboutHref: string;
  workHref: string;
  engineeringHref: string;
  contactHref: string;
};

const ROOT_CLASSNAME = 'min-h-[100dvh] overflow-clip bg-[var(--paper)] text-[var(--ink)]';
const SHELL_CLASSNAME = 'mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-14';

export default function PortfolioExperience({
  projects,
  homeHref,
  aboutHref,
  workHref,
  engineeringHref,
  contactHref
}: PortfolioExperienceProps) {
  const reduceMotion = useReducedMotion();
  const revealProps = reduceMotion
    ? {}
    : {
        variants: SECTION_REVEAL_VARIANTS,
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: { once: true, amount: 0.18 },
        transition: SECTION_REVEAL_TRANSITION
      };

  return (
    <div className={ROOT_CLASSNAME} data-hydrated="true">
      <a href="#hero" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-[var(--ink)] focus:px-4 focus:py-3 focus:text-white">
        본문으로 건너뛰기
      </a>

      <SiteHeader
        homeHref={homeHref}
        workHref={workHref}
        aboutHref={aboutHref}
        contactHref={contactHref}
      />

      <main>
        <section id="hero" className={`${SHELL_CLASSNAME} flex min-h-[calc(88dvh-4rem)] flex-col items-center justify-center py-20 text-center sm:py-24`}>
          <h1 className="max-w-6xl text-[clamp(3.25rem,8.5vw,6rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
            {HERO_LINES.map((line, index) => (
              <span key={line} className={`block overflow-hidden pb-[0.08em] ${index === 1 ? 'text-[var(--accent-blue)]' : ''}`}>
                <motion.span
                  className="block"
                  initial={reduceMotion ? false : { y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.78, delay: index * 0.1, ease: EMPHASIZED_EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <p className="mt-8 max-w-3xl text-base leading-7 text-[var(--ink-secondary)] sm:text-xl sm:leading-8">
            클라우드, 비전 검사, 제조 관제 도메인의 웹 클라이언트를 개발해 왔습니다.
          </p>
        </section>

        <motion.section {...revealProps} id="work" className={`${SHELL_CLASSNAME} scroll-mt-24 pb-24 pt-14 sm:pb-36 sm:pt-20`}>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-[clamp(2.6rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.04em]">주요 성과</h2>
          </div>
          <ProjectShowcase projects={projects} />
        </motion.section>

        <section id="contact" className={`${SHELL_CLASSNAME} flex min-h-[65dvh] flex-col items-center justify-center py-24 text-center sm:py-32`}>
          <h2 className="max-w-5xl text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.98] tracking-[-0.04em]">Contact</h2>
          <a href={contactHref} className={`mt-10 inline-flex min-h-12 items-center rounded-full bg-[var(--accent-blue)] px-6 text-base font-semibold text-white shadow-[0_12px_32px_rgb(0_115_235_/_0.18)] transition-[filter,transform] hover:brightness-95 active:scale-[0.98] ${FOCUS_CLASSNAME}`}>연락처 보기</a>
          <p className="mt-20 text-xs text-[var(--ink-muted)]">© {new Date().getFullYear()} 김민찬</p>
        </section>
      </main>
    </div>
  );
}
