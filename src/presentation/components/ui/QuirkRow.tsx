import { useMemo, type ReactNode } from 'react';
import { inputClass } from './Field';
import { InfoTip } from './InfoTip';
import type { VehicleQuirk } from '../../../domain/entities/PilotSheet';
import {
  QUIRK_EXAMPLES,
  QUIRK_FIELD_HELP,
  type QuirkExample,
} from '../../../shared/data/beamSaberQuirkData';

function findExampleMatch(quirk: VehicleQuirk): QuirkExample | undefined {
  return QUIRK_EXAMPLES.find(
    (ex) =>
      ex.descriptorPlus === quirk.descriptor1 && ex.descriptorMinus === quirk.descriptor2,
  );
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
  const matchedExample = useMemo(() => findExampleMatch(quirk), [quirk]);
  const showHelp =
    matchedExample?.help ||
    (quirk.descriptor1 || quirk.descriptor2
      ? 'Esgote quando um descritor se aplicar à ação. Marque a caixa Esgotada após usar.'
      : null);

  const applyExample = (exampleId: string) => {
    const ex = QUIRK_EXAMPLES.find((e) => e.id === exampleId);
    if (!ex) return;
    onChange({
      ...quirk,
      name: quirk.name.trim() ? quirk.name : ex.suggestedName,
      descriptor1: ex.descriptorPlus,
      descriptor2: ex.descriptorMinus,
    });
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
        <label className="hud-label">Exemplo de descritores</label>
        <select
          className={`${inputClass} hud-select max-w-md`}
          value=""
          onChange={(e) => {
            if (e.target.value) applyExample(e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">Escolher par do livro…</option>
          {QUIRK_EXAMPLES.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.descriptorPlus} / {ex.descriptorMinus}
            </option>
          ))}
        </select>
      </div>

      <div className="quirk-card__fields">
        <FieldMini label="Nome" help={QUIRK_FIELD_HELP.name}>
          <input
            className={inputClass}
            placeholder="Ex.: Veloz e Barulhento"
            value={quirk.name}
            onChange={(e) => onChange({ ...quirk, name: e.target.value })}
          />
        </FieldMini>
        <FieldMini label="Descritor +" help={QUIRK_FIELD_HELP.descriptorPlus}>
          <input
            className={inputClass}
            placeholder="Ex.: Aparência ameaçadora"
            value={quirk.descriptor1}
            onChange={(e) => onChange({ ...quirk, descriptor1: e.target.value })}
          />
        </FieldMini>
        <FieldMini label="Descritor −" help={QUIRK_FIELD_HELP.descriptorMinus}>
          <input
            className={inputClass}
            placeholder="Ex.: Carapaça estilhaçante"
            value={quirk.descriptor2}
            onChange={(e) => onChange({ ...quirk, descriptor2: e.target.value })}
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
