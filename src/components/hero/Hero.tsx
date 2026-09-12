import { useEffect, useRef, useState } from 'react';
import { CAREER_BADGES, PROFILE, type CareerBadge } from '../../data/portfolio';
import type { ProjectViewModel } from '../../types/portfolio';
import { Lanyard } from './Lanyard';
import { StaticBadgeFallback } from './StaticBadgeFallback';
import './hero.css';

type Props = { projects: readonly ProjectViewModel[]; aboutHref: string; engineeringHref: string };

export function Hero({ projects, aboutHref, engineeringHref }: Props) {
  const [selected, setSelected] = useState<CareerBadge | null>(null);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [activeMotionId, setActiveMotionId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const returnTo = useRef<string | null>(null);
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (selected) heading.current?.focus({ preventScroll: true });
    else if (returnTo.current) document.getElementById(`career-card-${returnTo.current}`)?.focus({ preventScroll: true });
  }, [selected]);
  function open(badge: CareerBadge) { returnTo.current = badge.id; setSelected(badge); }
  return <section id="hero" className="career-hero" aria-label="경력과 개인 작업">
    <header className="career-intro">
      <h1>만들어 온 경험들.</h1>
      <p>{PROFILE.name}<span aria-hidden="true"> / </span>{PROFILE.role}</p>
    </header>
    {!selected ? <>
      <div className="career-shelf">
        {CAREER_BADGES.map(badge => <Lanyard key={badge.id} id={badge.id} title={badge.title} role={badge.role} period={badge.period} design={badge.design}
          href={badge.id === 'personal' ? engineeringHref : aboutHref} onOpen={() => open(badge)} motionEnabled={motionEnabled}
          motionActive={activeMotionId === badge.id} onMotionIntent={() => setActiveMotionId(badge.id)} />)}
      </div>
      <div className="career-guidance"><p>카드를 아래로 당겨 경험을 펼쳐 보세요.<span> 클릭이나 Enter로도 열 수 있습니다.</span></p>
        {hydrated && <button type="button" className="career-motion" aria-pressed={!motionEnabled} onClick={() => {
          if (motionEnabled) setActiveMotionId(null);
          setMotionEnabled(value => !value);
        }}>{motionEnabled ? '움직임 끄기' : '움직임 켜기'}</button>}
      </div>
    </> : <section id="career-detail" className="career-detail" aria-labelledby="career-detail-title">
      <button type="button" className="career-back" onClick={() => setSelected(null)}>경력으로 돌아가기</button>
      <div className="career-detail-heading">
        <div className="career-selected-badge" aria-hidden="true"><StaticBadgeFallback title={selected.title} role={selected.role} period={selected.period} design={selected.design} /></div>
        <div><h2 id="career-detail-title" tabIndex={-1} ref={heading}>{selected.title}</h2><p className="career-detail-role">{selected.role}{selected.period && ` · ${selected.period}`}</p><p className="career-summary">{selected.summary}</p></div>
      </div>
      <div className="career-projects">
        {selected.projects.length ? selected.projects.map(slug => {
          const project = projects.find(item => item.slug === slug);
          return project ? <a className="career-project" key={slug} href={project.href}><h3>{project.title}</h3><p>{project.summary}</p><span>Case Study 읽기</span></a> : null;
        }) : <a className="career-project" href={engineeringHref}><h3>이 포트폴리오를 만드는 방법</h3><p>Astro와 React의 역할 분리, 콘텐츠 타입 설계와 인터랙션 구현을 기록합니다.</p><span>구현 기록 읽기</span></a>}
      </div>
    </section>}
  </section>;
}
