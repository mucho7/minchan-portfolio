import { memo, type CSSProperties } from 'react';
import { resolveBadgeDesign, type BadgeDesign } from './badge-design';

export type BadgeContentProps = { title: string; role: string; period?: string; design?: BadgeDesign; metaId?: string };

type BadgeInteractionState = 'idle' | 'pull' | 'release';

type StaticBadgeFallbackProps = BadgeContentProps & {
  interactionState?: BadgeInteractionState;
};

/** The same readable DOM face is used with physics, without WebGL, and during SSR. */
export const StaticBadgeFallback = memo(function StaticBadgeFallback({ title, role, period, design, metaId, interactionState }: StaticBadgeFallbackProps) {
  const resolved = resolveBadgeDesign(design);
  const style = {
    '--badge-paper': resolved.backgroundColor, '--badge-ink': resolved.textColor, '--badge-border': resolved.borderColor,
    backgroundImage: resolved.backgroundImage ? `url(${JSON.stringify(resolved.backgroundImage)})` : undefined
  } as CSSProperties;
  return <div className="badge-face" style={style} data-interaction={interactionState}>
    <span className="badge-slot" aria-hidden="true" />
    <div className="badge-title">{title}</div>
    <div className="badge-information" id={metaId}>
      <span className="badge-role">{role}</span>
      {period && <span className="badge-period">{period}</span>}
      {interactionState && <span className="badge-drag-hint" aria-hidden="true">
        <span className="badge-drag-hint-clip">
          <span className="badge-drag-hint-pull">아래로 당겨서 열기</span>
          <span className="badge-drag-hint-release">놓아서 상세 보기</span>
        </span>
      </span>}
    </div>
    {resolved.footer && <span className="badge-footer" aria-hidden="true" style={{ background: resolved.footer.colors[1] }}>
      <span style={{ width: `${resolved.footer.split}%`, background: resolved.footer.colors[0] }} />
    </span>}
  </div>;
});
