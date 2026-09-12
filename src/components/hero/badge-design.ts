/** Shared physical dimensions in CSS pixels, never overridden per card. */
export const BADGE_SIZE = { width: 224, height: 304, strapWidth: 24, strapBorder: 2, pullThreshold: 100, maxPull: 112 } as const;
export const BADGE_STAGE = { height: 568, cardTop: 124, strapRest: 144 } as const;

export type BadgeDesign = {
  strapColor?: string;
  strapBorderColor?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  borderColor?: string;
  textColor?: string;
  footer?: { colors: readonly [string, string]; split: number };
};

export function resolveBadgeDesign(design: BadgeDesign = {}) {
  const strapColor = design.strapColor ?? '#696b70';
  return {
    strapColor,
    strapBorderColor: design.strapBorderColor ?? strapColor,
    backgroundColor: design.backgroundColor ?? '#fafafa',
    backgroundImage: design.backgroundImage,
    borderColor: design.borderColor ?? 'transparent',
    textColor: design.textColor ?? '#252629',
    footer: design.footer
  };
}

export type BadgeDrag = {
  active: boolean; sequence: number; dx: number; dy: number;
};
