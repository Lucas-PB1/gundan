import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { createPortal } from 'react-dom';
import { hudSpring, modalBackdrop, modalSheet } from '../../motion/hudMotion';

export function HudModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="hud-modal-backdrop"
          role="presentation"
          onClick={onClose}
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={reduced ? { duration: 0 } : { duration: 0.2 }}
        >
          <motion.div
            className="hud-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hud-modal-title"
            onClick={(e) => e.stopPropagation()}
            variants={modalSheet}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={reduced ? { duration: 0 } : hudSpring}
          >
            <header className="hud-modal__header">
              <h3 id="hud-modal-title" className="hud-modal__title">
                {title}
              </h3>
              <button type="button" className="hud-modal__close hud-btn" onClick={onClose} aria-label="Fechar">
                ×
              </button>
            </header>
            <div className="hud-modal__body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
