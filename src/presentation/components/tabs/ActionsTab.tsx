import { Field, inputClass, sectionClass, sectionTitleClass } from '../ui/Field';
import { ActionRatingPicker } from '../ui/ActionRatingPicker';
import type { PilotSheet } from '../../../domain/entities/PilotSheet';
import { buildPoolSize, countHarmLevels, defaultModifiers } from '../../../domain/dice/pilotRollHelpers';
import { PILOT_ACTIONS, VEHICLE_ACTIONS } from '../../../shared/data/beamSaberPilotData';
import { attrLabel } from '../../../shared/i18n/pt';
import { QuickActionRoll } from './RollsTab';

function ActionGrid({
  title,
  actions,
  ratings,
  harmPenalty,
  onChange,
}: {
  title: string;
  actions: { id: string; name: string; attribute: string; description: string }[];
  ratings: Record<string, number>;
  harmPenalty: number;
  onChange: (id: string, value: number) => void;
}) {
  const baseMods = { ...defaultModifiers(), harmPenalty };
  return (
    <section className={sectionClass}>
      <h3 className={sectionTitleClass}>{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => (
          <div key={action.id} className="action-card">
            <div className="action-card__header">
              <div>
                <div className="action-card__name">{action.name}</div>
                <div className="action-card__attr">{attrLabel(action.attribute)}</div>
              </div>
              <ActionRatingPicker
                value={ratings[action.id] ?? 0}
                onChange={(v) => onChange(action.id, v)}
              />
            </div>
            <p className="action-card__desc">{action.description}</p>
            <QuickActionRoll
              actionName={action.name}
              rating={ratings[action.id] ?? 0}
              poolSize={buildPoolSize(ratings[action.id] ?? 0, baseMods)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function ActionsTab({
  pilot,
  onChange,
}: {
  pilot: PilotSheet;
  onChange: (p: PilotSheet) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <ActionGrid
        title="Ações de piloto (Perspicácia · Destreza · Determinação)"
        actions={PILOT_ACTIONS}
        ratings={pilot.actionRatings}
        harmPenalty={countHarmLevels(pilot.harm)}
        onChange={(id, value) =>
          onChange({ ...pilot, actionRatings: { ...pilot.actionRatings, [id]: value } })
        }
      />
      <ActionGrid
        title="Ações de veículo (Especialização · Agudeza)"
        actions={VEHICLE_ACTIONS}
        ratings={pilot.vehicleActionRatings}
        harmPenalty={countHarmLevels(pilot.vehicleDamage)}
        onChange={(id, value) =>
          onChange({ ...pilot, vehicleActionRatings: { ...pilot.vehicleActionRatings, [id]: value } })
        }
      />
      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Notas de criação</h3>
        <p className="text-[0.7rem] text-[var(--hud-muted)]">
          Na criação: máx. 2 por ação. O arquétipo dá +3 pontos; História e Abertura dão +1 cada.
          Veículo ganha +3 pontos só em ações de veículo.
        </p>
        <Field label="Notas">
          <textarea className={inputClass} rows={2} value={pilot.notes} onChange={(e) => onChange({ ...pilot, notes: e.target.value })} />
        </Field>
      </section>
    </div>
  );
}
