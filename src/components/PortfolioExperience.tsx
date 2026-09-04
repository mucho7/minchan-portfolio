import { motion, useReducedMotion } from 'framer-motion';
import { HERO_LINES } from '../data/portfolio';
import { EMPHASIZED_EASE, SECTION_REVEAL_TRANSITION, SECTION_REVEAL_VARIANTS } from '../motion/variants';
import type { ProjectViewModel } from '../types/portfolio';
import { ProjectShowcase } from './portfolio/ProjectShowcase';
import { FOCUS_CLASSNAME } from './portfolio/styles';

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

      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-xl">
        <div className={`${SHELL_CLASSNAME} flex h-16 items-center justify-between gap-6`}>
          <a href={homeHref} className={`text-sm font-semibold tracking-[-0.02em] ${FOCUS_CLASSNAME}`}>김민찬</a>
          <nav aria-label="주요 메뉴" className="flex items-center gap-4 text-xs font-medium text-[var(--ink-muted)] sm:gap-7 sm:text-sm">
            <a href={workHref} className={`transition-colors hover:text-[var(--ink)] ${FOCUS_CLASSNAME}`}>Work</a>
            <a href={aboutHref} className={`transition-colors hover:text-[var(--ink)] ${FOCUS_CLASSNAME}`}>About</a>
            <a href={engineeringHref} className={`hidden transition-colors hover:text-[var(--ink)] sm:inline ${FOCUS_CLASSNAME}`}>Engineering</a>
            <a href={contactHref} className={`rounded-full bg-[var(--ink)] px-4 py-2 text-white transition-transform active:scale-[0.98] ${FOCUS_CLASSNAME}`}>Contact</a>
          </nav>
        </div>
      </header>

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
            React와 TypeScript로 대용량 데이터와 복잡한 상태를 사용자가 판단하고 실행할 수 있는 화면으로 연결합니다.
          </p>
        </section>

        <motion.section {...revealProps} id="work" className={`${SHELL_CLASSNAME} scroll-mt-24 pb-24 pt-14 sm:pb-36 sm:pt-20`}>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-[clamp(2.6rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.04em]">판단과 실행을 바꾼 작업.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--ink-secondary)] sm:text-lg sm:leading-8">
              문제를 어떻게 정의했고, 어떤 선택을 했으며, 결과를 무엇으로 확인했는지 보여드립니다.
            </p>
          </div>
          <ProjectShowcase projects={projects} />
        </motion.section>

        <motion.section {...revealProps} id="approach" className="bg-[var(--surface)]">
          <div className={`${SHELL_CLASSNAME} py-24 sm:py-32`}>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.03] tracking-[-0.04em]">기술보다 먼저, 문제와 행동을 봅니다.</h2>
              <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-[var(--ink-secondary)] sm:text-lg">
                익숙한 기술에 답을 맞추지 않습니다. 응답성, 시스템 비용, 사용자의 실제 행동을 기준으로 선택하고 결과를 검증합니다.
              </p>
            </div>
            <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">
              <a href={aboutHref} className={`inline-flex min-h-11 items-center rounded-full border border-[var(--line-strong)] bg-[var(--paper)] px-5 text-sm font-semibold transition-colors hover:bg-[var(--nav-surface)] ${FOCUS_CLASSNAME}`}>경력과 작업 방식</a>
              <a href={engineeringHref} className={`inline-flex min-h-11 items-center rounded-full border border-[var(--line-strong)] bg-[var(--paper)] px-5 text-sm font-semibold transition-colors hover:bg-[var(--nav-surface)] ${FOCUS_CLASSNAME}`}>이 사이트의 설계 기록</a>
            </div>
          </div>
        </motion.section>

        <section id="contact" className={`${SHELL_CLASSNAME} flex min-h-[65dvh] flex-col items-center justify-center py-24 text-center sm:py-32`}>
          <h2 className="max-w-5xl text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.98] tracking-[-0.04em]">복잡한 문제를<br />함께 풀어봅시다.</h2>
          <a href={contactHref} className={`mt-10 inline-flex min-h-12 items-center rounded-full bg-[var(--accent-blue)] px-6 text-base font-semibold text-white shadow-[0_12px_32px_rgb(0_115_235_/_0.18)] transition-[filter,transform] hover:brightness-95 active:scale-[0.98] ${FOCUS_CLASSNAME}`}>연락처 보기</a>
          <p className="mt-20 text-xs text-[var(--ink-muted)]">© {new Date().getFullYear()} 김민찬</p>
        </section>
      </main>
    </div>
  );
}
