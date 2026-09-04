import type { Transition, Variants } from 'framer-motion';

export const EMPHASIZED_EASE = [0.22, 1, 0.36, 1] satisfies [number, number, number, number];

export const SECTION_REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
} satisfies Variants;

export const SECTION_REVEAL_TRANSITION = {
  duration: 0.65,
  ease: EMPHASIZED_EASE
} satisfies Transition;
