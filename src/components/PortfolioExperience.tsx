import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { EVIDENCE, HERO_LINES, SECTION_NAVIGATION } from '../data/portfolio';
import { useProjectDialog } from '../hooks/useProjectDialog';
import { EMPHASIZED_EASE, SECTION_REVEAL_TRANSITION, SECTION_REVEAL_VARIANTS } from '../motion/variants';
import type { ProjectViewModel } from '../types/portfolio';
import { ProjectDetailDialog } from './portfolio/ProjectDetailDialog';
import { ProjectList } from './portfolio/ProjectList';
import { CTA_CLASSNAME, EYEBROW_CLASSNAME, FOCUS_CLASSNAME } from './portfolio/styles';

type PortfolioExperienceProps = {
  projects: readonly ProjectViewModel[];
  homeHref: string;
  aboutHref: string;
  workHref: string;
  engineeringHref: string;
  contactHref: string;
};

const ROOT_CLASSNAME = 'min-h-screen overflow-clip bg-[var(--paper)] text-[var(--ink)]';
const SHELL_CLASSNAME = 'mx-auto max-w-[100rem] px-5 sm:px-8 lg:px-14 xl:pr-52';
const HEADER_CLASSNAME = 'fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 mix-blend-difference text-white sm:px-8 lg:px-14';
const HERO_TITLE_CLASSNAME = 'max-w-6xl text-[clamp(3.4rem,9.5vw,9rem)] font-semibold leading-[0.84] tracking-[-0.075em]';
const CONTACT_TITLE_CLASSNAME = 'max-w-5xl text-[clamp(3.2rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.075em]';

export default function PortfolioExperience({
  projects,
  homeHref,
  aboutHref,
  workHref,
  engineeringHref,
  contactHref
}: PortfolioExperienceProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const { selectedSlug, selectedIndex, selectedProject, openProject, closeProject } = useProjectDialog(projects);
  const revealProps = reduceMotion
    ? {}
    : {
        variants: SECTION_REVEAL_VARIANTS,
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: { once: true, amount: 0.18 },
        transition: SECTION_REVEAL_TRANSITION
      };

  useEffect(() => {
    rootRef.current?.setAttribute('data-hydrated', 'true');
  }, []);

  return (
    <div ref={rootRef} className={ROOT_CLASSNAME} data-hydrated="false">
      <div id="portfolio-page-content" inert={Boolean(selectedProject)} aria-hidden={selectedProject ? true : undefined}>
        <a href="#hero" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:bg-[var(--paper)] focus:px-4 focus:py-3">본문으로 건너뛰기</a>

        <header className={HEADER_CLASSNAME}>
          <a href={homeHref} className={`text-sm font-semibold tracking-[-0.02em] ${FOCUS_CLASSNAME}`}>
            김민찬 <span className="font-normal opacity-60">/ FE</span>
          </a>
        </header>

        <nav aria-label="페이지 섹션" className="fixed right-7 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
          <ol className="space-y-5 text-right text-xs">
            {SECTION_NAVIGATION.map(({ number, label, href }) => (
              <li key={href}>
                <a className={`group flex items-center justify-end gap-3 text-black/55 hover:text-black ${FOCUS_CLASSNAME}`} href={href}>
                  <span>{number}</span><span className="w-14 transition group-hover:w-20">{label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="hero" className={`${SHELL_CLASSNAME} flex min-h-screen flex-col justify-end pb-14 pt-28 sm:pb-20`}>
          <p className={`${EYEBROW_CLASSNAME} mb-8`}>Frontend Engineer · Industrial data · AI product</p>
          <h1 className={HERO_TITLE_CLASSNAME}>
            {HERO_LINES.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={reduceMotion ? false : { y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.82, delay: index * 0.11, ease: EMPHASIZED_EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <div className="mt-10 grid gap-8 border-t border-black/25 pt-6 sm:grid-cols-[1fr_18rem]">
            <p className="max-w-3xl text-base leading-7 text-black/65 sm:text-lg">
              <span className="block">React와 TypeScript로 대용량 데이터, 복잡한 상태, 현장 제약을</span>
              <span className="block">사용자가 판단하고 실행할 수 있는 화면으로 연결합니다.</span>
            </p>
            <p className="text-sm leading-6 text-black/55">AHHA Labs<br />Frontend Engineer<br />2024.11 — Present</p>
          </div>
        </section>

        <motion.section {...revealProps} aria-label="대표 성과" className={`${SHELL_CLASSNAME} grid border-y border-black/25 py-3 sm:grid-cols-2 lg:grid-cols-4`}>
          {EVIDENCE.map(({ value, label }, index) => (
            <div key={value} className={`py-6 sm:px-6 ${index > 0 ? 'border-t border-black/20 sm:border-t-0 sm:border-l' : ''}`}>
              <p className="text-3xl font-semibold tracking-[-0.05em]">{value}</p>
              <p className="mt-2 text-xs leading-5 text-black/50">{label}</p>
            </div>
          ))}
        </motion.section>

        <motion.section {...revealProps} id="work" className={`${SHELL_CLASSNAME} py-24 sm:py-32`}>
          <div className="mb-12 flex items-end justify-between gap-8">
            <div>
              <p className={EYEBROW_CLASSNAME}>Selected work</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">판단과 실행을 바꾼 작업</h2>
            </div>
            <a href={workHref} className={`hidden text-sm underline sm:block ${FOCUS_CLASSNAME}`}>전체 목록</a>
          </div>
          <ProjectList projects={projects} selectedSlug={selectedSlug} onSelect={openProject} />
        </motion.section>

        <motion.section {...revealProps} id="approach" className="bg-[#17231d] text-[#f4f1ea]">
          <div className={`${SHELL_CLASSNAME} grid gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_1.1fr]`}>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/45">Approach</p>
              <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-6xl">
                <span className="block">기술보단</span>
                <span className="block">데이터와 행동을</span>
              </h2>
            </div>
            <div className="max-w-2xl space-y-6 text-base leading-8 text-white/65 sm:text-lg">
              <p>TanStack Query, Zustand, Canvas, SSE와 WebSocket은 목적이 아니라 선택지입니다. 응답성과 시스템 비용, 사용자의 실제 행동을 기준으로 고릅니다.</p>
              <p>AI가 제안한 코드도 같은 기준으로 봅니다. 맥락과 제약을 제공하고, diff를 직접 읽은 뒤 타입·테스트·브라우저 동작을 확인합니다.</p>
              <div className="flex flex-wrap gap-6">
                <a href={aboutHref} className={`inline-flex border-b border-white/60 pb-1 text-sm text-white ${FOCUS_CLASSNAME}`}>경력과 작업 방식 ↗</a>
                <a href={engineeringHref} className={`inline-flex border-b border-white/60 pb-1 text-sm text-white ${FOCUS_CLASSNAME}`}>이 사이트의 설계 기록 ↗</a>
              </div>
            </div>
          </div>
        </motion.section>

        <section id="contact" className={`${SHELL_CLASSNAME} flex min-h-[70vh] flex-col justify-between py-24 sm:py-32`}>
          <p className={EYEBROW_CLASSNAME}>Contact</p>
          <div>
            <h2 className={CONTACT_TITLE_CLASSNAME}>복잡한 문제를<br />함께 풀어봅시다.</h2>
            <a href={contactHref} className={`${CTA_CLASSNAME} mt-12 text-base`}>연락처 보기 <span aria-hidden="true">↗</span></a>
          </div>
          <p className="mt-20 text-xs text-black/45">© {new Date().getFullYear()} 김민찬 · Seoul, Korea</p>
        </section>
      </div>

      <AnimatePresence>
        {selectedProject ? (
          <ProjectDetailDialog key={selectedProject.slug} project={selectedProject} index={selectedIndex} onClose={closeProject} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
