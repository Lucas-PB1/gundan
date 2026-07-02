import { motion, useReducedMotion } from 'motion/react';
import { hudSpring } from '../../motion/hudMotion';

export function DiceFace({ value, highlight, index = 0 }: { value: number; highlight?: boolean; index?: number }) {
  const reduced = useReducedMotion();

  return (
    <motion.span
      className={`dice-face ${highlight ? 'dice-face--best' : ''} ${value === 6 ? 'dice-face--six' : ''}`}
      aria-label={`dado ${value}`}
      initial={reduced ? false : { opacity: 0, scale: 0.55, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={reduced ? { duration: 0 } : { ...hudSpring, delay: index * 0.05 }}
      whileHover={reduced ? undefined : { scale: 1.06 }}
    >
      {value}
    </motion.span>
  );
}
