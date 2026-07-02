import { useId, useState } from 'react';

export function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-sm border border-[var(--hud-accent-dim)] text-[0.6rem] font-bold text-[var(--hud-accent)] hover:bg-[rgba(0,212,255,0.15)]"
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
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded border border-[var(--hud-border)] bg-[#0a1018] p-2 text-left text-[0.7rem] font-normal normal-case leading-snug tracking-normal text-[#b8c9d9] shadow-lg"
        >
          {text}
        </span>
      )}
    </span>
  );
}
