import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { BADGE_SIZE, BADGE_STAGE } from './badge-design';
import type { LanyardRuntime } from './lanyard-runtime';
import { StaticBadgeFallback, type BadgeContentProps } from './StaticBadgeFallback';

type LanyardProps = BadgeContentProps & {
  item: LanyardRuntime;
  href: string;
  onOpen: () => void;
  physicsReady: boolean;
  loading: boolean;
  dragDisabled: boolean;
  cancelSignal: number;
  horizontalBounds?: { min: number; max: number };
};

export function Lanyard({ item, href, onOpen, physicsReady, loading, dragDisabled, cancelSignal, horizontalBounds, ...content }: LanyardProps) {
  const [armed, setArmed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const pointer = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const armedRef = useRef(false);
  const resetAnimation = useRef<Animation | null>(null);
  const fallbackStyle = {
    '--strap-color': item.design.strapColor, '--strap-border': item.design.strapBorderColor,
    '--badge-width': `${BADGE_SIZE.width}px`, '--badge-height': `${BADGE_SIZE.height}px`,
    '--strap-width': `${BADGE_SIZE.strapWidth}px`, '--strap-border-width': `${BADGE_SIZE.strapBorder}px`,
    '--strap-pattern': item.design.strapPattern ? `url(${JSON.stringify(item.design.strapPattern.src)})` : 'none',
    '--strap-pattern-size': `${(item.design.strapPattern?.repeatLength ?? 108) / BADGE_STAGE.strapRest * 100}%`
  } as CSSProperties;

  function finish(cancelled = false) {
    const current = pointer.current;
    if (!current) return;
    pointer.current = null;
    const shouldOpen = !cancelled && item.drag.current.dy >= BADGE_SIZE.pullThreshold;
    suppressClick.current = current.moved || cancelled || shouldOpen;
    item.drag.current.active = false;
    armedRef.current = false;
    setArmed(false);
    setDragging(false);
    if (item.face.current?.hasPointerCapture(current.id)) item.face.current.releasePointerCapture(current.id);
    if (!physicsReady && item.face.current) {
      const transform = item.face.current.style.transform;
      item.face.current.style.transform = '';
      item.root.current?.style.setProperty('--pull', '0px');
      if (matchMedia('(prefers-reduced-motion: no-preference)').matches && typeof item.face.current.animate === 'function') {
        resetAnimation.current = item.face.current.animate(
          [{ transform }, { transform: 'translate3d(0,0,0) rotate(0deg)' }],
          { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' }
        );
      }
    }
    if (shouldOpen) onOpen();
  }
  const finishRef = useRef(finish);
  finishRef.current = finish;

  useEffect(() => { finishRef.current(true); }, [cancelSignal]);
  useEffect(() => { if (dragDisabled) finishRef.current(true); }, [dragDisabled]);
  useEffect(() => {
    if (!physicsReady && item.face.current && !pointer.current) item.face.current.style.transform = '';
  }, [item.face, physicsReady]);
  useEffect(() => () => resetAnimation.current?.cancel(), []);

  function move(event: PointerEvent<HTMLAnchorElement>) {
    const current = pointer.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    current.moved ||= Math.hypot(dx, dy) > 8;
    item.drag.current.dx = Math.max(horizontalBounds?.min ?? -42, Math.min(horizontalBounds?.max ?? 42, dx));
    item.drag.current.dy = Math.max(-18, Math.min(BADGE_SIZE.maxPull, dy));
    const nextArmed = item.drag.current.dy >= BADGE_SIZE.pullThreshold;
    if (nextArmed !== armedRef.current) {
      armedRef.current = nextArmed;
      setArmed(nextArmed);
    }
    if (!physicsReady && item.face.current) {
      item.face.current.style.transform = `translate3d(${item.drag.current.dx * .35}px,${item.drag.current.dy}px,0) rotate(${item.drag.current.dx * .05}deg)`;
      item.root.current?.style.setProperty('--pull', `${item.drag.current.dy}px`);
    }
  }

  return <div ref={item.root} className="lanyard" style={fallbackStyle} data-armed={armed} data-dragging={dragging} data-loading={loading}>
    <div className="lanyard-stage">
      <div className="static-strap" aria-hidden="true" />
      <a ref={item.face} id={`career-card-${item.id}`} href={href} className="badge-anchor" aria-label={`${content.title} 상세 보기`}
        aria-describedby={`career-meta-${item.id}`} onDragStart={event => event.preventDefault()}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0 || pointer.current) return;
          if (dragDisabled) return;
          resetAnimation.current?.cancel();
          suppressClick.current = false;
          setDragging(true);
          pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
          item.drag.current = { active: true, sequence: item.drag.current.sequence + 1, dx: 0, dy: 0 };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={move} onPointerUp={() => finish()} onPointerCancel={() => finish(true)} onLostPointerCapture={() => finish(true)}
        onKeyDown={event => { if (event.key === 'Escape') finish(true); }}
        onClick={event => { event.preventDefault(); if (event.detail === 0 || !suppressClick.current) onOpen(); suppressClick.current = false; }}>
        <StaticBadgeFallback {...content} metaId={`career-meta-${item.id}`} interactionState={dragging ? (armed ? 'release' : 'pull') : 'idle'} />
        <span className="badge-loading" aria-hidden="true"><span className="badge-spinner" /></span>
      </a>
    </div>
    <span className="lanyard-status" aria-live="polite" aria-atomic="true">{dragging ? (armed ? '놓아서 상세 보기' : '아래로 당겨서 열기') : ''}</span>
  </div>;
}
