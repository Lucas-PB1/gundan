import { InfoTip } from './InfoTip';

export function Field({
  label,
  hint,
  help,
  children,
}: {
  label: string;
  hint?: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="hud-label flex min-h-[1.125rem] items-center">
        {label}
        {help ? <InfoTip text={help} /> : null}
      </span>
      <span className="min-h-[1rem] text-[0.65rem] leading-4 text-[var(--hud-muted)]">
        {hint ?? '\u00A0'}
      </span>
      {children}
    </label>
  );
}

export const inputClass = 'hud-input';

export const sectionClass = 'hud-panel';

export const sectionTitleClass = 'hud-title';
