import { Component, Suspense, createRef, lazy, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import type { CareerBadge } from '../../data/portfolio';
import { BADGE_SIZE, BADGE_STAGE, resolveBadgeDesign, type BadgeDrag } from './badge-design';
import { Lanyard } from './Lanyard';
import type { LanyardLayout, LanyardRuntime, LanyardSceneItem } from './lanyard-runtime';

const Scene = lazy(() => import('./LanyardScene'));
const ZOOM = 100;
const SHELF_GUTTER = 8;
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

type Props = {
  badges: readonly CareerBadge[];
  aboutHref: string;
  engineeringHref: string;
  motionEnabled: boolean;
  onOpen: (badge: CareerBadge) => void;
};

export function LanyardShelf({ badges, aboutHref, engineeringHref, motionEnabled, onOpen }: Props) {
  const shelf = useRef<HTMLDivElement>(null);
  const layoutSignature = useRef('');
  const [layouts, setLayouts] = useState<Record<string, LanyardLayout>>({});
  const [eligible, setEligible] = useState(false);
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cancelSignal, setCancelSignal] = useState(0);
  const items = useMemo<readonly LanyardRuntime[]>(() => badges.map(badge => ({
    id: badge.id,
    root: createRef<HTMLDivElement>(),
    face: createRef<HTMLAnchorElement>(),
    drag: { current: { active: false, sequence: 0, dx: 0, dy: 0 } } as RefObject<BadgeDrag>,
    design: resolveBadgeDesign(badge.design)
  })), [badges]);

  const cancelAll = useCallback(() => setCancelSignal(value => value + 1), []);
  const fail = useCallback(() => {
    setFailed(true);
    setReady(false);
    cancelAll();
  }, [cancelAll]);

  useLayoutEffect(() => {
    const measure = () => {
      const shelfNode = shelf.current;
      if (!shelfNode || items.some(item => !item.root.current)) return;
      const shelfRect = shelfNode.getBoundingClientRect();
      const halfWidth = shelfRect.width / 2;
      const minX = (-halfWidth + BADGE_SIZE.width / 2 + SHELF_GUTTER) / ZOOM;
      const maxX = (halfWidth - BADGE_SIZE.width / 2 - SHELF_GUTTER) / ZOOM;
      const next = Object.fromEntries(items.map(item => {
        const rect = item.root.current!.getBoundingClientRect();
        const restXPixels = rect.left + rect.width / 2 - shelfRect.left - halfWidth;
        const restX = restXPixels / ZOOM;
        return [item.id, {
          restX, minX, maxX,
          minDx: (minX - restX) * ZOOM,
          maxDx: (maxX - restX) * ZOOM
        }];
      }));
      const signature = items.map(item => {
        const value = next[item.id];
        return `${item.id}:${value.restX.toFixed(3)}:${value.minX.toFixed(3)}:${value.maxX.toFixed(3)}`;
      }).join('|');
      if (signature === layoutSignature.current) return;
      layoutSignature.current = signature;
      setReady(false);
      setLayouts(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (shelf.current) observer.observe(shelf.current);
    items.forEach(item => { if (item.root.current) observer.observe(item.root.current); });
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const media = matchMedia('(min-width: 960px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => {
      cancelAll();
      const nextEligible = media.matches && supportsWebGL();
      setEligible(nextEligible);
      setFailed(media.matches && !nextEligible);
      setReady(false);
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [cancelAll]);

  useEffect(() => {
    let intersecting = false;
    const update = () => {
      const nextVisible = intersecting && !document.hidden;
      setVisible(nextVisible);
      if (!nextVisible) cancelAll();
    };
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      update();
    });
    if (shelf.current) observer.observe(shelf.current);
    const blur = () => cancelAll();
    document.addEventListener('visibilitychange', update);
    window.addEventListener('blur', blur);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('blur', blur);
    };
  }, [cancelAll]);

  const sceneItems = useMemo(() => items.flatMap(item => layouts[item.id]
    ? [{ ...item, ...layouts[item.id] } satisfies LanyardSceneItem]
    : []), [items, layouts]);
  const hasLayout = sceneItems.length === items.length;
  const enabled = eligible && motionEnabled && requested && hasLayout && !failed;
  const physicsState = failed ? 'fallback' : enabled && ready ? 'ready' : 'static';
  const worldKey = layoutSignature.current;

  useEffect(() => {
    if (!enabled) setReady(false);
  }, [enabled]);
  useEffect(() => {
    if (!enabled || ready || !visible) return;
    const timeout = window.setTimeout(fail, 15000);
    return () => clearTimeout(timeout);
  }, [enabled, fail, ready, visible]);

  const stageStyle = {
    '--stage-height': `${BADGE_STAGE.height}px`,
    '--badge-top': `${BADGE_STAGE.cardTop}px`,
    '--strap-rest': `${BADGE_STAGE.strapRest}px`
  } as CSSProperties;

  return <div ref={shelf} className="career-shelf" data-physics={physicsState} style={stageStyle}>
    {enabled && <div className="lanyard-canvas" aria-hidden="true">
      <SceneBoundary onError={fail}><Suspense fallback={null}>
        <Scene items={sceneItems} worldKey={worldKey} active={visible} onReady={() => setReady(true)} onFailure={fail} />
      </Suspense></SceneBoundary>
    </div>}
    {badges.map((badge, index) => {
      const layout = layouts[badge.id];
      return <Lanyard key={badge.id} item={items[index]} title={badge.title} role={badge.role} period={badge.period} design={badge.design}
        href={badge.id === 'personal' ? engineeringHref : aboutHref} onOpen={() => onOpen(badge)} motionEnabled={motionEnabled}
        physicsReady={physicsState === 'ready'} onMotionIntent={() => { if (eligible && motionEnabled) setRequested(true); }}
        cancelSignal={cancelSignal} horizontalBounds={eligible && layout ? { min: layout.minDx, max: layout.maxDx } : undefined} />;
    })}
  </div>;
}
