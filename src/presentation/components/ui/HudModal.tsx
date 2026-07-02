import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

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

  if (!open) return null;

  return createPortal(
    <div className="hud-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="hud-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hud-modal-title"
        onClick={(e) => e.stopPropagation()}
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
      </div>
    </div>,
    document.body,
  );
}
