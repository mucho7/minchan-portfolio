import type { CSSProperties } from 'react';
import { resolveBadgeDesign, type BadgeDesign } from './badge-design';

export type BadgeContentProps = { title: string; role: string; period?: string; design?: BadgeDesign; metaId?: string };

/** The same readable DOM face is used with physics, without WebGL, and during SSR. */
export function StaticBadgeFallback({ title, role, period, design, metaId }: BadgeContentProps) {
  const resolved = resolveBadgeDesign(design);
  const style = {
    '--badge-paper': resolved.backgroundColor, '--badge-ink': resolved.textColor,
    backgroundImage: resolved.backgroundImage ? `url(${JSON.stringify(resolved.backgroundImage)})` : undefined
  } as CSSProperties;
  return <div className="badge-face" style={style}>
    <span className="badge-slot" aria-hidden="true" />
    <div className="badge-title">{title}</div>
    <div className="badge-information" id={metaId}><span className="badge-role">{role}</span>{period && <span className="badge-period">{period}</span>}</div>
    {resolved.footer && <span className="badge-footer" aria-hidden="true" style={{ background: resolved.footer.colors[1] }}>
      <span style={{ width: `${resolved.footer.split}%`, background: resolved.footer.colors[0] }} />
    </span>}
  </div>;
}
