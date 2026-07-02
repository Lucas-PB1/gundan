import type { Transition, Variants } from 'motion/react';

export const HUD_EASE = [0.22, 1, 0.36, 1] as const;

export const hudSpring: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 34,
};

export const hudTween = (reduced = false): Transition =>
  reduced ? { duration: 0 } : { duration: 0.22, ease: HUD_EASE };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slidePanel: Variants = {
  hidden: { opacity: 0, x: 14 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
};

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalSheet: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.98 },
};

export const drawerPanel: Variants = {
  hidden: { x: '-105%' },
  visible: { x: 0 },
  exit: { x: '-105%' },
};

export const staggerList: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.03 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export const checklistRow: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

export const dicePop = (index: number, reduced: boolean): Transition =>
  reduced
    ? { duration: 0 }
    : {
        ...hudSpring,
        delay: index * 0.05,
      };

export const tapScale = { scale: 0.94 };
export const hoverLift = { scale: 1.02 };

export function flashCreationAnchor(el: HTMLElement, reduced: boolean): void {
  if (reduced) return;
  void import('motion').then(({ animate }) => {
    animate(
      el,
      {
        boxShadow: [
          '0 0 0 0px rgba(0, 212, 255, 0)',
          '0 0 0 2px rgba(0, 212, 255, 0.55)',
          '0 0 0 0px rgba(0, 212, 255, 0)',
        ],
      },
      { duration: 1.35, ease: 'easeInOut' },
    );
  });
}
