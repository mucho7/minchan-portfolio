import type { RefObject } from 'react';
import type { BadgeDrag, resolveBadgeDesign } from './badge-design';

export type LanyardRuntime = {
  id: string;
  root: RefObject<HTMLDivElement | null>;
  face: RefObject<HTMLAnchorElement | null>;
  drag: RefObject<BadgeDrag>;
  design: ReturnType<typeof resolveBadgeDesign>;
};

export type LanyardLayout = {
  restX: number;
  minX: number;
  maxX: number;
  minDx: number;
  maxDx: number;
};

export type LanyardSceneItem = LanyardRuntime & LanyardLayout;
