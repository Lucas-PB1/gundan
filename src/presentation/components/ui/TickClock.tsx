import { InfoTip } from './InfoTip';
import { sectionClass, sectionTitleClass } from './Field';

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
  return (
    <div className={sectionClass}>
      <div className="mb-2 flex items-center justify-between">
        <span className={`${sectionTitleClass.replace('mb-3', '')} flex items-center`}>
          {label}
          {help ? <InfoTip text={help} /> : null}
        </span>
        <span className="font-mono text-xs text-[var(--hud-muted)]">{ticks}/{max}</span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: max }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Tick ${i + 1}`}
            onClick={() => onChange(i + 1 === ticks ? i : i + 1)}
            className={`h-8 flex-1 border transition-colors ${
              i < ticks
                ? 'border-[var(--hud-accent)] bg-[rgba(0,212,255,0.35)] shadow-[0_0_8px_rgba(0,212,255,0.3)]'
                : 'border-[var(--hud-border)] bg-[rgba(0,0,0,0.3)] hover:border-[var(--hud-accent-dim)]'
            }`}
          />
        ))}
      </div>
    </div>
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
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1 === value ? i : i + 1)}
            className={`h-5 flex-1 border ${
              i < value
                ? 'border-[var(--hud-gold)] bg-[rgba(245,197,66,0.35)]'
                : 'border-[var(--hud-border)] bg-[rgba(0,0,0,0.3)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
