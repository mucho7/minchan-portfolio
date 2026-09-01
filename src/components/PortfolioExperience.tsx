import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Project = {
  slug: string;
  title: string;
  summary: string;
  period: string;
  role: string;
  skills: string[];
  metrics: string[];
  preview: { problem: string; decision: string; result: string };
  href: string;
};

type Props = {
  projects: Project[];
  homeHref: string;
  aboutHref: string;
  workHref: string;
  contactHref: string;
};

const EVIDENCE = [
  { value: '4주', label: 'AI Agent MVP · FE 단독 개발' },
  { value: '50M+', label: '시계열 데이터 탐색 경험' },
  { value: '20–30 → 2', label: 'Web IDE 주요 갱신 렌더링' },
  { value: '1h → 10–13m', label: 'AI 태스크 자동화 · 검토 포함' }
];
const HERO_LINES = ['복잡한 데이터와', '상태를 명료한', '제품 흐름으로.'];
const PROJECT_TONES = ['bg-[#dce6cf]', 'bg-[#d6e2e8]', 'bg-[#e9d8c7]', 'bg-[#ded8e9]'];
const ROOT_CLASS = 'min-h-screen overflow-clip bg-[var(--paper)] text-[var(--ink)]';
const SHELL_CLASS = 'mx-auto max-w-[100rem] px-5 sm:px-8 lg:px-14 xl:pr-52';
const EYEBROW_CLASS = 'font-mono text-[0.68rem] uppercase tracking-[0.18em] text-black/45';
const FOCUS_CLASS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]';
const PROJECT_BUTTON_CLASS = `group grid w-full gap-5 border-t border-black/25 py-7 text-left transition-colors hover:bg-black/[0.035] sm:grid-cols-[4rem_1fr_auto] sm:items-center sm:px-4 ${FOCUS_CLASS}`;
const CLOSE_BUTTON_CLASS = `grid h-12 w-12 place-items-center rounded-full border border-black/35 bg-[var(--paper)] text-2xl transition hover:bg-black hover:text-[var(--paper)] ${FOCUS_CLASS}`;
const CTA_CLASS = `inline-flex items-center gap-3 border-b border-current pb-1 text-sm font-medium transition hover:text-[var(--accent)] ${FOCUS_CLASS}`;

function ProjectModal({ project, index, onClose }: { project: Project; index: number; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 p-3 sm:p-7 lg:p-12"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22 }}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        ref={dialogRef} role="dialog" aria-modal="true"
        aria-labelledby={`project-${project.slug}-title`} aria-describedby={`project-${project.slug}-summary`}
        className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-6xl bg-[var(--paper)] shadow-2xl sm:min-h-0"
        initial={reduceMotion ? false : { y: 48, scale: 0.985 }} animate={{ y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { y: 30, scale: 0.99 }}
        transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className={`${PROJECT_TONES[index % PROJECT_TONES.length]} relative min-h-[23rem] overflow-hidden p-6 sm:p-10 lg:p-14`}>
          <div className="flex items-start justify-between gap-8">
            <p className={EYEBROW_CLASS}>Project detail · 0{index + 1}</p>
            <button ref={closeRef} type="button" onClick={onClose} className={CLOSE_BUTTON_CLASS} aria-label="프로젝트 상세 닫기">×</button>
          </div>
          <div className="mt-16 max-w-4xl sm:mt-24">
            <p className="mb-5 text-sm text-black/55">{project.period} · {project.role}</p>
            <h2 id={`project-${project.slug}-title`} className="text-[clamp(2.6rem,7vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.07em]">{project.title}</h2>
          </div>
        </header>
        <div className="grid gap-12 p-6 sm:p-10 lg:grid-cols-[1fr_18rem] lg:p-14">
          <div>
            <p id={`project-${project.slug}-summary`} className="max-w-3xl text-xl leading-8 tracking-[-0.025em] sm:text-2xl sm:leading-9">{project.summary}</p>
            <dl className="mt-12 divide-y divide-black/20 border-y border-black/20">
              {Object.entries(project.preview).map(([key, value]) => (
                <div key={key} className="grid gap-3 py-7 sm:grid-cols-[8rem_1fr]">
                  <dt className={EYEBROW_CLASS}>{key}</dt><dd className="max-w-2xl leading-7 text-black/70">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <aside className="border-t border-black/25 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <p className={EYEBROW_CLASS}>Evidence</p>
            <ul className="mt-4 space-y-3">{project.metrics.map((metric) => <li key={metric} className="text-lg font-semibold tracking-[-0.03em]">{metric}</li>)}</ul>
            <p className={`${EYEBROW_CLASS} mt-10`}>Stack</p>
            <p className="mt-4 text-sm leading-7 text-black/60">{project.skills.join(' · ')}</p>
          </aside>
        </div>
        <footer className="flex flex-col gap-5 border-t border-black/25 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10 lg:px-14">
          <p className="text-sm text-black/50">구현 과정과 한계까지 정리한 전체 기록</p>
          <a href={project.href} className={CTA_CLASS}>전체 Case Study 읽기 <span aria-hidden="true">↗</span></a>
        </footer>
      </motion.div>
    </motion.div>
  );
}

export default function PortfolioExperience({ projects, homeHref, aboutHref, workHref, contactHref }: Props) {
  const reduceMotion = useReducedMotion();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const selectedIndex = projects.findIndex((project) => project.slug === selectedSlug);
  const selectedProject = selectedIndex >= 0 ? projects[selectedIndex] : null;

  useEffect(() => {
    const syncFromUrl = () => {
      const slug = new URL(window.location.href).searchParams.get('project');
      setSelectedSlug(projects.some((project) => project.slug === slug) ? slug : null);
    };
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [projects]);

  const openProject = (project: Project, trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
    const url = new URL(window.location.href);
    url.searchParams.set('project', project.slug);
    window.history.pushState({}, '', url);
    setSelectedSlug(project.slug);
  };
  const closeProject = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    window.history.replaceState({}, '', url);
    setSelectedSlug(null);
    requestAnimationFrame(() => openerRef.current?.focus());
  };
  const reveal = reduceMotion ? {} : {
    initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 }, transition: { duration: 0.65 }
  };

  return (
    <div className={ROOT_CLASS}>
      <div id="portfolio-page-content" inert={Boolean(selectedProject)} aria-hidden={selectedProject ? true : undefined}>
      <a href="#hero" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:bg-[var(--paper)] focus:px-4 focus:py-3">본문으로 건너뛰기</a>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 mix-blend-difference text-white sm:px-8 lg:px-14">
        <a href={homeHref} className={`text-sm font-semibold tracking-[-0.02em] ${FOCUS_CLASS}`}>김민찬 <span className="font-normal opacity-60">/ FE</span></a>
        <p className="hidden font-mono text-[0.65rem] uppercase tracking-[0.16em] sm:block">Seoul · Available for conversation</p>
      </header>
      <nav aria-label="페이지 섹션" className="fixed right-7 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <ol className="space-y-5 text-right text-xs">
          {[['01', 'Intro', '#hero'], ['02', 'Project', '#work'], ['03', 'Approach', '#approach'], ['04', 'Contact', '#contact']].map(([number, label, href]) => (
            <li key={href}><a className={`group flex items-center justify-end gap-3 text-black/55 hover:text-black ${FOCUS_CLASS}`} href={href}><span>{number}</span><span className="w-14 transition group-hover:w-20">{label}</span></a></li>
          ))}
        </ol>
      </nav>

      <section id="hero" className={`${SHELL_CLASS} flex min-h-screen flex-col justify-end pb-14 pt-28 sm:pb-20`}>
        <p className={`${EYEBROW_CLASS} mb-8`}>Frontend Engineer · Industrial data · AI product</p>
        <h1 className="max-w-6xl text-[clamp(3.4rem,9.5vw,9rem)] font-semibold leading-[0.84] tracking-[-0.075em]">
          {HERO_LINES.map((line, index) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]"><motion.span className="block" initial={reduceMotion ? false : { y: '105%' }} animate={{ y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.82, delay: index * 0.11, ease: [0.22, 1, 0.36, 1] }}>{line}</motion.span></span>
          ))}
        </h1>
        <div className="mt-10 grid gap-8 border-t border-black/25 pt-6 sm:grid-cols-[1fr_18rem]">
          <p className="max-w-2xl text-base leading-7 text-black/65 sm:text-lg">React와 TypeScript로 대용량 데이터, 복잡한 상태, 현장 제약을 사용자가 판단하고 실행할 수 있는 화면으로 연결합니다.</p>
          <p className="text-sm leading-6 text-black/55">AHHA Labs<br />Frontend Engineer<br />2024.11 — Present</p>
        </div>
      </section>

      <motion.section {...reveal} aria-label="대표 성과" className={`${SHELL_CLASS} grid border-y border-black/25 py-3 sm:grid-cols-2 lg:grid-cols-4`}>
        {EVIDENCE.map(({ value, label }, index) => (
          <div key={value} className={`py-6 sm:px-6 ${index > 0 ? 'border-t border-black/20 sm:border-t-0 sm:border-l' : ''}`}><p className="text-3xl font-semibold tracking-[-0.05em]">{value}</p><p className="mt-2 text-xs leading-5 text-black/50">{label}</p></div>
        ))}
      </motion.section>

      <motion.section {...reveal} id="work" className={`${SHELL_CLASS} py-24 sm:py-32`}>
        <div className="mb-12 flex items-end justify-between gap-8">
          <div><p className={EYEBROW_CLASS}>Selected work</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">판단과 실행을 바꾼 작업</h2></div>
          <a href={workHref} className={`hidden text-sm underline sm:block ${FOCUS_CLASS}`}>전체 목록</a>
        </div>
        <div className="border-b border-black/25">
          {projects.map((project, index) => (
            <motion.button key={project.slug} type="button" className={PROJECT_BUTTON_CLASS}
              onClick={(event) => openProject(project, event.currentTarget)}
              aria-haspopup="dialog" aria-expanded={selectedSlug === project.slug}
              whileTap={reduceMotion ? undefined : { scale: 0.995 }}
            >
              <span className="font-mono text-xs text-black/40">0{index + 1}</span>
              <span><span className="block text-xl font-semibold tracking-[-0.035em] sm:text-2xl">{project.title}</span><span className="mt-2 block max-w-2xl text-sm leading-6 text-black/55">{project.summary}</span></span>
              <span className="flex items-center gap-3 text-sm text-black/45"><span className="hidden sm:inline">Detail</span><span className="text-xl transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span></span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      <motion.section {...reveal} id="approach" className="bg-[#17231d] text-[#f4f1ea]">
        <div className={`${SHELL_CLASS} grid gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_1.1fr]`}>
          <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-white/45">Approach</p><h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-6xl">기술보다 먼저 데이터와 행동을 봅니다.</h2></div>
          <div className="max-w-2xl space-y-6 text-base leading-8 text-white/65 sm:text-lg">
            <p>TanStack Query, Zustand, Canvas, SSE와 WebSocket은 목적이 아니라 선택지입니다. 응답성과 시스템 비용, 사용자의 실제 행동을 기준으로 고릅니다.</p>
            <p>AI가 제안한 코드도 같은 기준으로 봅니다. 맥락과 제약을 제공하고, diff를 직접 읽은 뒤 타입·테스트·브라우저 동작을 확인합니다.</p>
            <a href={aboutHref} className={`inline-flex border-b border-white/60 pb-1 text-sm text-white ${FOCUS_CLASS}`}>경력과 작업 방식 보기 ↗</a>
          </div>
        </div>
      </motion.section>

      <section id="contact" className={`${SHELL_CLASS} flex min-h-[70vh] flex-col justify-between py-24 sm:py-32`}>
        <p className={EYEBROW_CLASS}>Contact</p>
        <div><h2 className="max-w-5xl text-[clamp(3.2rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.075em]">복잡한 문제를<br />함께 풀어봅시다.</h2><a href={contactHref} className={`${CTA_CLASS} mt-12 text-base`}>연락처 보기 <span aria-hidden="true">↗</span></a></div>
        <p className="mt-20 text-xs text-black/45">© {new Date().getFullYear()} 김민찬 · Seoul, Korea</p>
      </section>
      </div>

      <AnimatePresence>{selectedProject && <ProjectModal key={selectedProject.slug} project={selectedProject} index={selectedIndex} onClose={closeProject} />}</AnimatePresence>
    </div>
  );
}
