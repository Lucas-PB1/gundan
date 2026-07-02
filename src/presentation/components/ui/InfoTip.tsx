import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

const TOOLTIP_WIDTH = 224;
const GAP = 8;

export function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({ visibility: 'hidden' });
  const id = useId();
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const btn = btnRef.current;
      const tip = tipRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const tipHeight = tip?.offsetHeight ?? 72;
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const placeBelow = spaceAbove < tipHeight + GAP;

      const top = placeBelow ? rect.bottom + GAP : rect.top - GAP;
      const left = Math.min(
        Math.max(8, rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2),
        window.innerWidth - TOOLTIP_WIDTH - 8,
      );

      setStyle({
        position: 'fixed',
        top,
        left,
        width: TOOLTIP_WIDTH,
        transform: placeBelow ? 'none' : 'translateY(-100%)',
        zIndex: 10000,
        visibility: 'visible',
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, text]);

  const tooltip =
    open &&
    createPortal(
      <span
        ref={tipRef}
        id={id}
        role="tooltip"
        style={style}
        className="info-tip-popup"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {text}
      </span>,
      document.body,
    );

  return (
    <>
      <span className="inline-flex align-middle">
        <button
          ref={btnRef}
          type="button"
          className="info-tip-btn"
          aria-label="Ajuda"
          aria-expanded={open}
          aria-describedby={open ? id : undefined}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onClick={() => setOpen((v) => !v)}
        >
          ?
        </button>
      </span>
      {tooltip}
    </>
  );
}
