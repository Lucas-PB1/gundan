import { useMemo, type ReactNode } from 'react';
import { inputClass } from './Field';
import { InfoTip } from './InfoTip';
import type { VehicleQuirk } from '../../../domain/entities/PilotSheet';
import {
  QUIRK_CUSTOM_HELP,
  QUIRK_EXAMPLES,
  QUIRK_FIELD_HELP,
  QUIRK_SOURCE_CUSTOM,
  findQuirkExampleMatch,
  getQuirkSelectValue,
} from '../../../shared/data/beamSaberQuirkData';

function patchQuirk(quirk: VehicleQuirk, patch: Partial<VehicleQuirk>): VehicleQuirk {
  return { ...quirk, ...patch };
}

export function QuirkRow({
  quirk,
  index,
  onChange,
}: {
  quirk: VehicleQuirk;
  index: number;
  onChange: (q: VehicleQuirk) => void;
}) {
  const selectValue = getQuirkSelectValue(quirk);
  const isCustom = selectValue === QUIRK_SOURCE_CUSTOM;
  const matchedExample = useMemo(() => findQuirkExampleMatch(quirk), [quirk]);

  const showHelp = isCustom
    ? quirk.descriptor1 || quirk.descriptor2
      ? 'Esgote quando um descritor se aplicar à ação. Marque a caixa Esgotada após usar.'
      : QUIRK_CUSTOM_HELP
    : matchedExample?.help ?? null;

  const handleSourceChange = (value: string) => {
    if (value === QUIRK_SOURCE_CUSTOM) {
      onChange(patchQuirk(quirk, { templateId: null }));
      return;
    }
    const ex = QUIRK_EXAMPLES.find((e) => e.id === value);
    if (!ex) return;
    onChange({
      ...quirk,
      templateId: ex.id,
      name: ex.suggestedName,
      descriptor1: ex.descriptorPlus,
      descriptor2: ex.descriptorMinus,
    });
  };

  const handleFieldChange = (patch: Partial<VehicleQuirk>) => {
    onChange(patchQuirk(quirk, { ...patch, templateId: null }));
  };

  return (
    <div className="quirk-card">
      <div className="quirk-card__header">
        <span className="quirk-card__label">Peculiaridade {index + 1}</span>
        <label className="quirk-card__exhausted">
          <input
            type="checkbox"
            checked={quirk.exhausted}
            onChange={(e) => onChange({ ...quirk, exhausted: e.target.checked })}
          />
          Esgotada
          <InfoTip text={QUIRK_FIELD_HELP.exhausted} />
        </label>
      </div>

      <div className="quirk-card__example-row">
        <label className="hud-label flex items-center gap-1">
          Modelo
          <InfoTip text={QUIRK_FIELD_HELP.template} />
        </label>
        <select
          className={`${inputClass} hud-select max-w-md`}
          value={selectValue}
          onChange={(e) => handleSourceChange(e.target.value)}
        >
          <option value={QUIRK_SOURCE_CUSTOM}>Personalizada (criar a sua)</option>
          <optgroup label="Exemplos do livro">
            {QUIRK_EXAMPLES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.suggestedName} — {ex.descriptorPlus} / {ex.descriptorMinus}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="quirk-card__fields">
        <FieldMini label="Nome" help={QUIRK_FIELD_HELP.name}>
          <input
            className={inputClass}
            placeholder={isCustom ? 'Ex.: Veloz e Barulhento' : ''}
            value={quirk.name}
            onChange={(e) => handleFieldChange({ name: e.target.value })}
          />
        </FieldMini>
        <FieldMini label="Descritor +" help={QUIRK_FIELD_HELP.descriptorPlus}>
          <input
            className={inputClass}
            placeholder={isCustom ? 'Ex.: Rápido demais' : ''}
            value={quirk.descriptor1}
            onChange={(e) => handleFieldChange({ descriptor1: e.target.value })}
          />
        </FieldMini>
        <FieldMini label="Descritor −" help={QUIRK_FIELD_HELP.descriptorMinus}>
          <input
            className={inputClass}
            placeholder={isCustom ? 'Ex.: Barulho ensurdecedor' : ''}
            value={quirk.descriptor2}
            onChange={(e) => handleFieldChange({ descriptor2: e.target.value })}
          />
        </FieldMini>
      </div>

      {showHelp && (
        <div className="quirk-card__help hud-info-box">
          {quirk.name && <div className="mb-1 font-semibold text-[var(--hud-accent)]">{quirk.name}</div>}
          <p className="m-0 text-[0.75rem] leading-relaxed text-[var(--hud-muted)]">{showHelp}</p>
        </div>
      )}
    </div>
  );
}

function FieldMini({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <label className="quirk-field-mini">
      <span className="quirk-field-mini__label">
        {label}
        {help && <InfoTip text={help} />}
      </span>
      {children}
    </label>
  );
}
