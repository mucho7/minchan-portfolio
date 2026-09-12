import { Component, Suspense, lazy, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { BADGE_SIZE, resolveBadgeDesign, type BadgeDrag } from './badge-design';
import { StaticBadgeFallback, type BadgeContentProps } from './StaticBadgeFallback';

const Scene = lazy(() => import('./LanyardScene'));
let webGLSupported: boolean | undefined;

function supportsWebGL() {
  if (webGLSupported !== undefined) return webGLSupported;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  webGLSupported = Boolean(context);
  context?.getExtension('WEBGL_lose_context')?.loseContext();
  return webGLSupported;
}

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

type LanyardProps = BadgeContentProps & {
  id: string;
  href: string;
  onOpen: () => void;
  motionEnabled: boolean;
  motionActive: boolean;
  onMotionIntent: () => void;
};

export function Lanyard({ id, href, onOpen, motionEnabled, motionActive, onMotionIntent, ...content }: LanyardProps) {
  const [eligible, setEligible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [armed, setArmed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const face = useRef<HTMLAnchorElement>(null);
  const drag = useRef<BadgeDrag>({ active: false, sequence: 0, dx: 0, dy: 0 });
  const pointer = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const armedRef = useRef(false);
  const resetAnimation = useRef<Animation | null>(null);
  const resolved = resolveBadgeDesign(content.design);
  const enabled = eligible && motionEnabled && motionActive && !failed;
  const physical = enabled && ready;
  const fallbackStyle = {
    '--strap-color': resolved.strapColor, '--strap-border': resolved.strapBorderColor,
    '--badge-width': `${BADGE_SIZE.width}px`, '--badge-height': `${BADGE_SIZE.height}px`,
    '--strap-width': `${BADGE_SIZE.strapWidth}px`, '--strap-border-width': `${BADGE_SIZE.strapBorder}px`
  } as CSSProperties;

  function finish(cancelled = false) {
    const current = pointer.current;
    if (!current) return;
    pointer.current = null;
    const shouldOpen = !cancelled && drag.current.dy >= BADGE_SIZE.pullThreshold;
    suppressClick.current = current.moved || cancelled || shouldOpen;
    drag.current.active = false;
    armedRef.current = false; setArmed(false); setDragging(false);
    if (face.current?.hasPointerCapture(current.id)) face.current.releasePointerCapture(current.id);
    if (!physical && face.current) {
      const transform = face.current.style.transform;
      face.current.style.transform = '';
      root.current?.style.setProperty('--pull', '0px');
      if (motionEnabled && typeof face.current.animate === 'function') {
        resetAnimation.current = face.current.animate([{ transform }, { transform: 'translate3d(0,0,0) rotate(0deg)' }], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' });
      }
    }
    if (shouldOpen) onOpen();
  }
  // Keep global termination events current without repeatedly attaching listeners.
  const finishRef = useRef(finish); finishRef.current = finish;
  useEffect(() => {
    const media = matchMedia('(min-width: 960px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => {
      finishRef.current(true);
      const nextEligible = media.matches && supportsWebGL();
      setEligible(nextEligible);
      setFailed(media.matches && !nextEligible);
      setReady(false);
    };
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    let intersecting = false;
    const update = () => { setVisible(intersecting && !document.hidden); if (document.hidden || !intersecting) finishRef.current(true); };
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; update(); });
    if (root.current) observer.observe(root.current);
    const cancel = () => finishRef.current(true);
    document.addEventListener('visibilitychange', update);
    window.addEventListener('blur', cancel);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); window.removeEventListener('blur', cancel); resetAnimation.current?.cancel(); };
  }, []);
  useEffect(() => {
    if (!enabled) { setReady(false); if (face.current) face.current.style.transform = ''; }
  }, [enabled]);
  useEffect(() => {
    if (!enabled || ready || !visible) return;
    const timeout = window.setTimeout(() => setFailed(true), 15000);
    return () => clearTimeout(timeout);
  }, [enabled, ready, visible]);
  function move(event: PointerEvent<HTMLAnchorElement>) {
    const current = pointer.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    current.moved ||= Math.hypot(dx, dy) > 8;
    drag.current.dx = Math.max(-42, Math.min(42, dx));
    drag.current.dy = Math.max(-18, Math.min(BADGE_SIZE.maxPull, dy));
    const nextArmed = drag.current.dy >= BADGE_SIZE.pullThreshold;
    if (nextArmed !== armedRef.current) { armedRef.current = nextArmed; setArmed(nextArmed); }
    if (!physical && face.current) {
      face.current.style.transform = `translate3d(${drag.current.dx * .35}px,${drag.current.dy}px,0) rotate(${drag.current.dx * .05}deg)`;
      root.current?.style.setProperty('--pull', `${drag.current.dy}px`);
    }
  }
  return <div ref={root} className="lanyard" style={fallbackStyle} data-physics={failed ? 'fallback' : physical ? 'ready' : 'static'} data-armed={armed}>
    <div className="lanyard-stage">
      <div className="static-strap" aria-hidden="true" />
      {enabled && <div className="lanyard-canvas" aria-hidden="true"><SceneBoundary onError={() => setFailed(true)}><Suspense fallback={null}>
        <Scene face={face} drag={drag} design={resolved} active={visible} onReady={() => setReady(true)} onFailure={() => setFailed(true)} />
      </Suspense></SceneBoundary></div>}
      <a ref={face} id={`career-card-${id}`} href={href} className="badge-anchor" aria-label={`${content.title} 상세 보기`}
        aria-describedby={`career-meta-${id}`} onDragStart={event => event.preventDefault()}
        onPointerEnter={onMotionIntent} onFocus={onMotionIntent}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0 || pointer.current) return;
          onMotionIntent();
          resetAnimation.current?.cancel(); suppressClick.current = false;
          setDragging(true);
          pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
          drag.current = { active: true, sequence: drag.current.sequence + 1, dx: 0, dy: 0 };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={move} onPointerUp={() => finish()} onPointerCancel={() => finish(true)} onLostPointerCapture={() => finish(true)}
        onKeyDown={event => { if (event.key === 'Escape') finish(true); }}
        onClick={event => { event.preventDefault(); if (event.detail === 0 || !suppressClick.current) onOpen(); suppressClick.current = false; }}>
        <StaticBadgeFallback {...content} metaId={`career-meta-${id}`} interactionState={dragging ? (armed ? 'release' : 'pull') : 'idle'} />
      </a>
    </div>
    <span className="lanyard-status" aria-live="polite" aria-atomic="true">{dragging ? (armed ? '놓아서 상세 보기' : '아래로 당겨서 열기') : ''}</span>
  </div>;
}
