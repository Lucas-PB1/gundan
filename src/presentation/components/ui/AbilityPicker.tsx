import { useState } from 'react';
import { getAbilityDescription, getAbilityLabel } from '../../../shared/data/beamSaberHelpData';

export function AbilityPicker({
  playbookId,
  abilities,
  value,
  onChange,
  label = 'Habilidade inicial',
  help,
}: {
  playbookId: string;
  abilities: string[];
  value: string;
  onChange: (name: string) => void;
  label?: string;
  help?: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const displayName = value || hovered;
  const displayDesc = displayName ? getAbilityDescription(playbookId, displayName) : undefined;

  return (
    <div className="flex flex-col gap-1">
      <span className="hud-label">{label}</span>
      {help && <p className="text-[0.65rem] text-[var(--hud-muted)]">{help}</p>}
      <div className="ability-picker__list" role="listbox" aria-label={label}>
        {abilities.map((name) => (
          <button
            key={name}
            type="button"
            role="option"
            aria-selected={value === name}
            className={`ability-picker__item ${value === name ? 'ability-picker__item--selected' : ''}`}
            onClick={() => onChange(name)}
            onMouseEnter={() => setHovered(name)}
            onMouseLeave={() => setHovered(null)}
          >
            {getAbilityLabel(playbookId, name)}
          </button>
        ))}
      </div>
      <div className="ability-picker__detail hud-info-box">
        {displayDesc ? (
          <>
            <div className="mb-1 font-semibold text-[var(--hud-accent)]">
              {displayName ? getAbilityLabel(playbookId, displayName) : ''}
            </div>
            <p className="m-0 text-[0.8rem] leading-relaxed">{displayDesc}</p>
          </>
        ) : (
          <p className="m-0 text-[var(--hud-muted)]">Selecione uma habilidade para ver a regra completa.</p>
        )}
      </div>
    </div>
  );
}
