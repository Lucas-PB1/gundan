import { motion, useReducedMotion } from 'motion/react';
import { hudSpring, tapScale } from '../../motion/hudMotion';
import { InfoTip } from './InfoTip';

function ClockSegment({
  filled,
  onClick,
  reduced,
}: {
  filled: boolean;
  onClick: () => void;
  reduced: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`h-8 flex-1 border ${
        filled
          ? 'border-[var(--hud-accent)] bg-[rgba(0,212,255,0.35)] shadow-[0_0_8px_rgba(0,212,255,0.3)]'
          : 'border-[var(--hud-border)] bg-[rgba(0,0,0,0.3)] hover:border-[var(--hud-accent-dim)]'
      }`}
      whileTap={reduced ? undefined : tapScale}
      animate={
        filled && !reduced
          ? { scale: [1, 1.04, 1], opacity: 1 }
          : { scale: 1, opacity: 1 }
      }
      transition={reduced ? { duration: 0 } : { duration: 0.25 }}
    />
  );
}

export function TickClock({
  label,
  ticks,
  max = 4,
  help,
  onChange,
}: {
  label: string;
  ticks: number;
  max?: number;
  help?: string;
  onChange: (ticks: number) => void;
}) {
  const reduced = useReducedMotion();

  return (
    <div className="tick-clock">
      <div className="mb-2 flex items-center justify-between">
        <span className="hud-label flex items-center">
          {label}
          {help ? <InfoTip text={help} /> : null}
        </span>
        <span className="font-mono text-xs text-[var(--hud-muted)]">{ticks}/{max}</span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: max }, (_, i) => (
          <ClockSegment
            key={i}
            filled={i < ticks}
            reduced={!!reduced}
            onClick={() => onChange(i + 1 === ticks ? i : i + 1)}
          />
        ))}
      </div>
    </div>
  );
}

function XpSegment({
  filled,
  gold,
  onClick,
  reduced,
}: {
  filled: boolean;
  gold?: boolean;
  onClick: () => void;
  reduced: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`h-5 flex-1 border ${
        filled
          ? gold
            ? 'border-[var(--hud-gold)] bg-[rgba(245,197,66,0.35)]'
            : 'border-[var(--hud-accent)] bg-[rgba(0,212,255,0.35)]'
          : 'border-[var(--hud-border)] bg-[rgba(0,0,0,0.3)]'
      }`}
      whileTap={reduced ? undefined : tapScale}
      layout
      transition={reduced ? { duration: 0 } : hudSpring}
    />
  );
}

export function XpTrack({
  label,
  value,
  max,
  help,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  help?: string;
  onChange: (v: number) => void;
}) {
  const reduced = useReducedMotion();

  return (
    <div>
      <div className="mb-1 flex justify-between font-mono text-[0.65rem] text-[var(--hud-muted)]">
        <span className="flex items-center">
          {label}
          {help ? <InfoTip text={help} /> : null}
        </span>
        <span>{value}/{max}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => (
          <XpSegment
            key={i}
            filled={i < value}
            gold
            reduced={!!reduced}
            onClick={() => onChange(i + 1 === value ? i : i + 1)}
          />
        ))}
      </div>
    </div>
  );
}
