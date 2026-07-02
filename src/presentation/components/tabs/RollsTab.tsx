import { useCallback, useMemo, useState } from 'react';
import type { PilotSheet } from '../../../domain/entities/PilotSheet';
import {
  rollAction,
  rollFortune,
  rollResistance,
  type DiceRollResult,
  type FortuneRollResult,
  type ResistanceResult,
} from '../../../domain/dice/beamSaberDice';
import { DiceFace } from '../ui/DiceFace';
import { buildPoolSize, defaultModifiers, getPilotAction, getPilotActionRating, getVehicleAction, getVehicleActionRating, hasReducedEffect, pilotHarmPenalty, resistanceRatingForPilotAttribute, resistanceRatingForVehicleAttribute, vehicleDamagePenalty, type RollModifiers } from '../../../domain/dice/pilotRollHelpers';
import {
  PILOT_ACTIONS,
  PILOT_ATTRIBUTES,
  VEHICLE_ACTIONS,
  VEHICLE_ATTRIBUTES,
} from '../../../shared/data/beamSaberPilotData';
import { attrLabel } from '../../../shared/i18n/pt';
import { sectionClass, sectionTitleClass } from '../ui/Field';
import { RollResultDisplay } from '../ui/RollResultDisplay';

type RollTarget = 'pilot-action' | 'vehicle-action' | 'pilot-resist' | 'vehicle-resist' | 'fortune';

interface RollHistoryEntry {
  id: string;
  label: string;
  result: DiceRollResult | ResistanceResult | FortuneRollResult;
  variant: 'action' | 'resistance' | 'fortune';
}

function ModifiersPanel({
  mods,
  onChange,
  harmPenalty,
  showQuirk,
}: {
  mods: RollModifiers;
  onChange: (m: RollModifiers) => void;
  harmPenalty: number;
  showQuirk: boolean;
}) {
  return (
    <div className="roll-mods">
      <label className="roll-mods__item">
        <input
          type="checkbox"
          checked={mods.push}
          onChange={(e) => onChange({ ...mods, push: e.target.checked })}
        />
        Esforço (+1d)
      </label>
      <label className="roll-mods__item">
        <input
          type="checkbox"
          checked={mods.assist}
          onChange={(e) => onChange({ ...mods, assist: e.target.checked })}
        />
        Assistir (+1d)
      </label>
      {showQuirk && (
        <label className="roll-mods__item">
          <input
            type="checkbox"
            checked={mods.quirk}
            onChange={(e) => onChange({ ...mods, quirk: e.target.checked })}
          />
          Peculiaridade (+1d)
        </label>
      )}
      <label className="roll-mods__item roll-mods__item--num">
        <span>Extra ±</span>
        <input
          type="number"
          min={-2}
          max={4}
          value={mods.extraDice}
          onChange={(e) => onChange({ ...mods, extraDice: Number(e.target.value) || 0 })}
          className="hud-input roll-mods__num"
        />
      </label>
      <label className="roll-mods__item roll-mods__item--num">
        <span>Ferimento/Dano −</span>
        <input
          type="number"
          min={0}
          max={3}
          value={mods.harmPenalty}
          onChange={(e) => onChange({ ...mods, harmPenalty: Number(e.target.value) || 0 })}
          className="hud-input roll-mods__num"
        />
      </label>
      {harmPenalty > 0 && mods.harmPenalty === 0 && (
        <button
          type="button"
          className="roll-mods__apply-harm"
          onClick={() => onChange({ ...mods, harmPenalty })}
        >
          Aplicar penalidade da ficha (−{harmPenalty}d)
        </button>
      )}
    </div>
  );
}

export function RollsTab({ pilot }: { pilot: PilotSheet }) {
  const [target, setTarget] = useState<RollTarget>('pilot-action');
  const [actionId, setActionId] = useState('hunt');
  const [attribute, setAttribute] = useState<string>('insight');
  const [fortuneDice, setFortuneDice] = useState(2);
  const [mods, setMods] = useState<RollModifiers>(() => ({
    ...defaultModifiers(),
    harmPenalty: pilotHarmPenalty(pilot),
  }));
  const [lastResult, setLastResult] = useState<RollHistoryEntry | null>(null);
  const [history, setHistory] = useState<RollHistoryEntry[]>([]);

  const pilotHarm = pilotHarmPenalty(pilot);
  const vehicleHarm = vehicleDamagePenalty(pilot);
  const isVehicleRoll = target.startsWith('vehicle');
  const reducedEffect = isVehicleRoll
    ? hasReducedEffect(pilot.vehicleDamage)
    : hasReducedEffect(pilot.harm);

  const baseRating = useMemo(() => {
    if (target === 'pilot-action') return getPilotActionRating(pilot, actionId);
    if (target === 'vehicle-action') return getVehicleActionRating(pilot, actionId);
    if (target === 'pilot-resist') return resistanceRatingForPilotAttribute(pilot, attribute);
    if (target === 'vehicle-resist') return resistanceRatingForVehicleAttribute(pilot, attribute);
    return fortuneDice;
  }, [target, actionId, attribute, fortuneDice, pilot]);

  const poolPreview = buildPoolSize(baseRating, mods);

  const pushHistory = useCallback(
    (label: string, result: DiceRollResult | ResistanceResult | FortuneRollResult, variant: RollHistoryEntry['variant']) => {
      const entry: RollHistoryEntry = { id: crypto.randomUUID(), label, result, variant };
      setLastResult(entry);
      setHistory((h) => [entry, ...h].slice(0, 8));
    },
    [],
  );

  const roll = useCallback(() => {
    const pool = buildPoolSize(baseRating, mods);

    if (target === 'fortune') {
      pushHistory(`Sorte ${pool}d`, rollFortune(pool), 'fortune');
      return;
    }

    if (target === 'pilot-resist' || target === 'vehicle-resist') {
      pushHistory(`Resistir ${attrLabel(attribute)} ${pool}d`, rollResistance(pool), 'resistance');
      return;
    }

    const action =
      target === 'pilot-action' ? getPilotAction(actionId) : getVehicleAction(actionId);
    pushHistory(`${action?.name ?? actionId} ${pool}d`, rollAction(pool), 'action');
  }, [target, baseRating, mods, actionId, attribute, pushHistory]);

  const selectedAction =
    target === 'pilot-action'
      ? getPilotAction(actionId)
      : target === 'vehicle-action'
        ? getVehicleAction(actionId)
        : undefined;

  return (
    <div className="flex flex-col gap-4">
      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Tipo de rolagem</h3>
        <div className="roll-type-grid">
          {(
            [
              ['pilot-action', 'Ação (piloto)'],
              ['vehicle-action', 'Ação (veículo)'],
              ['pilot-resist', 'Resistência (piloto)'],
              ['vehicle-resist', 'Resistência (veículo)'],
              ['fortune', 'Sorte'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`roll-type-btn ${target === id ? 'roll-type-btn--active' : ''}`}
              onClick={() => {
                setTarget(id);
                if (id === 'pilot-action') setActionId('hunt');
                if (id === 'vehicle-action') setActionId('battle');
                if (id === 'pilot-resist') setAttribute('insight');
                if (id === 'vehicle-resist') setAttribute('expertise');
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Parâmetros</h3>

        {(target === 'pilot-action' || target === 'vehicle-action') && (
          <div className="mb-3">
            <label className="hud-label mb-2 block">Ação</label>
            <select
              className="hud-input w-full max-w-md"
              value={actionId}
              onChange={(e) => setActionId(e.target.value)}
            >
              {(target === 'pilot-action' ? PILOT_ACTIONS : VEHICLE_ACTIONS).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({attrLabel(a.attribute)}) — nível{' '}
                  {target === 'pilot-action'
                    ? (pilot.actionRatings[a.id] ?? 0)
                    : (pilot.vehicleActionRatings[a.id] ?? 0)}
                </option>
              ))}
            </select>
            {selectedAction && (
              <p className="mt-2 text-[0.72rem] text-[var(--hud-muted)]">{selectedAction.description}</p>
            )}
          </div>
        )}

        {(target === 'pilot-resist' || target === 'vehicle-resist') && (
          <div className="mb-3">
            <label className="hud-label mb-2 block">Atributo</label>
            <select
              className="hud-input w-full max-w-xs"
              value={attribute}
              onChange={(e) => setAttribute(e.target.value)}
            >
              {(target === 'pilot-resist' ? PILOT_ATTRIBUTES : VEHICLE_ATTRIBUTES).map((a) => (
                <option key={a} value={a}>
                  {attrLabel(a)} — maior ação:{' '}
                  {target === 'pilot-resist'
                    ? resistanceRatingForPilotAttribute(pilot, a)
                    : resistanceRatingForVehicleAttribute(pilot, a)}
                </option>
              ))}
            </select>
            <p className="mt-2 text-[0.7rem] text-[var(--hud-muted)]">
              Resistência usa o maior nível entre as ações do atributo.
            </p>
          </div>
        )}

        {target === 'fortune' && (
          <div className="mb-3 flex items-center gap-3">
            <label className="hud-label">Dados</label>
            <input
              type="number"
              min={0}
              max={6}
              value={fortuneDice}
              onChange={(e) => setFortuneDice(Math.max(0, Number(e.target.value) || 0))}
              className="hud-input w-16"
            />
            <span className="text-xs text-[var(--hud-muted)]">Ex.: nível do esquadrão</span>
          </div>
        )}

        <ModifiersPanel
          mods={mods}
          onChange={setMods}
          harmPenalty={target.startsWith('vehicle') ? vehicleHarm : pilotHarm}
          showQuirk={target.startsWith('vehicle')}
        />

        <div className="roll-pool-preview">
          Pool: <strong>{poolPreview}d</strong>
          <span className="text-[var(--hud-muted)]">
            {' '}
            (base {baseRating}
            {mods.push ? ' +esforço' : ''}
            {mods.assist ? ' +assistir' : ''}
            {mods.quirk ? ' +peculiaridade' : ''}
            {mods.extraDice !== 0 ? ` ${mods.extraDice > 0 ? '+' : ''}${mods.extraDice}` : ''}
            {mods.harmPenalty > 0
              ? ` −${isVehicleRoll ? 'dano' : 'ferimento'}`
              : ''}
            {reducedEffect ? ' · menos efeito' : ''})
          </span>
        </div>

        <button type="button" className="hud-btn hud-btn--primary roll-btn-main" onClick={roll}>
          Rolar {poolPreview}d6
        </button>
      </section>

      {lastResult && (
        <RollResultDisplay
          label={lastResult.label}
          result={lastResult.result}
          variant={lastResult.variant}
        />
      )}

      {history.length > 1 && (
        <section className={sectionClass}>
          <h3 className={sectionTitleClass}>Histórico</h3>
          <ul className="roll-history">
            {history.slice(1).map((h) => (
              <li key={h.id} className="roll-history__item">
                <span>{h.label}</span>
                <span className={h.result.outcome === 'failure' ? 'text-rose-400' : 'text-cyan-300'}>
                  {h.result.highest || '—'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Referência rápida</h3>
        <ul className="text-[0.72rem] leading-relaxed text-[var(--hud-muted)]">
          <li>
            <strong className="text-[var(--hud-text)]">Ação:</strong> 6 = sucesso · 4–5 = sucesso + consequência · 1–3 = falha
          </li>
          <li>
            <strong className="text-[var(--hud-text)]">Sorte:</strong> 6 = bom · 4–5 = misto · 1–3 = ruim
          </li>
          <li>
            <strong className="text-[var(--hud-text)]">Resistência:</strong> estresse 0 / 1 / 2 / 3 (6 / 4–5 / 2–3 / 1)
          </li>
          <li>
            <strong className="text-[var(--hud-text)]">Crítico:</strong> dois ou mais 6 no pool de dados
          </li>
        </ul>
      </section>
    </div>
  );
}

const OUTCOME_SHORT: Record<DiceRollResult['outcome'], string> = {
  crit: 'Crítico',
  success: 'Sucesso',
  partial: 'Parcial',
  failure: 'Falha',
};

/** Rolagem rápida a partir de um card de ação. */
export function QuickActionRoll({
  actionName,
  rating,
  poolSize,
}: {
  actionName: string;
  rating: number;
  poolSize: number;
}) {
  const [result, setResult] = useState<DiceRollResult | null>(null);
  const canRoll = poolSize > 0;

  return (
    <div className="quick-roll">
      <button
        type="button"
        className="quick-roll__btn"
        disabled={!canRoll}
        onClick={() => setResult(rollAction(poolSize))}
        title={
          canRoll
            ? `Rolar ${actionName} (${poolSize}d6, nível ${rating})`
            : `Nível ${rating}: sem dados — use Esforço (+1d) na aba Rolagem`
        }
      >
        {canRoll ? `ROLAR ${poolSize}d` : '0d · use Esforço'}
      </button>
      {result && (
        <div className="quick-roll__result">
          <div className="quick-roll__dice">
            {result.dice.map((d, i) => (
              <DiceFace key={`${i}-${d}`} value={d} highlight={d === result.highest} />
            ))}
          </div>
          <span className={`quick-roll__outcome quick-roll__outcome--${result.outcome}`}>
            {result.highest} · {OUTCOME_SHORT[result.outcome]}
          </span>
        </div>
      )}
      {!canRoll && (
        <span className="quick-roll__hint">Esforço = +1d (aba Rolagem)</span>
      )}
    </div>
  );
}
