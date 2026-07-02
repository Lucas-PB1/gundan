import { motion, useReducedMotion } from 'motion/react';
import { hudSpring, tapScale } from '../../motion/hudMotion';

export function ActionRatingPicker({
  value,
  max = 4,
  onChange,
}: {
  value: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  const reduced = useReducedMotion();

  return (
    <div className="action-rating" role="group" aria-label={`Rating ${value} de ${max}`}>
      {Array.from({ length: max + 1 }, (_, i) => {
        const active = value === i;
        return (
          <motion.button
            key={i}
            type="button"
            aria-label={`${i}`}
            aria-pressed={active}
            onClick={() => onChange(i)}
            className={`action-rating__btn ${active ? 'action-rating__btn--active' : ''}`}
            layout
            transition={reduced ? { duration: 0 } : hudSpring}
            whileTap={reduced ? undefined : tapScale}
            animate={
              active && !reduced
                ? { scale: 1.05, boxShadow: '0 0 10px rgba(0, 212, 255, 0.35)' }
                : { scale: 1, boxShadow: '0 0 0px rgba(0, 212, 255, 0)' }
            }
          >
            {i}
          </motion.button>
        );
      })}
    </div>
  );
}
