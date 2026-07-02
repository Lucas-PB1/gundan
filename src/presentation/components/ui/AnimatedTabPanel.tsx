import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { fadeUp, hudTween } from '../../motion/hudMotion';

export function AnimatedTabPanel({ tabKey, children }: { tabKey: string; children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={tabKey}
        className="animated-tab-panel"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={hudTween(!!reduced)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
