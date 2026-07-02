import { Field, inputClass, sectionClass, sectionTitleClass } from '../ui/Field';
import { ActionRatingPicker } from '../ui/ActionRatingPicker';
import type { PilotSheet } from '../../../domain/entities/PilotSheet';
import { CREATION_LIMITS } from '../../../domain/creation/beamSaberCreationProgress';
import { buildPoolSize, defaultModifiers, pilotHarmPenalty, vehicleDamagePenalty } from '../../../domain/dice/pilotRollHelpers';
import { getDiscretionaryPoints } from '../../../domain/creation/beamSaberCreationProgress';
import { PILOT_ACTIONS, VEHICLE_ACTIONS } from '../../../shared/data/beamSaberPilotData';
import { CREATION_ANCHORS } from '../../../shared/constants/pilotEditorTabs';
import { attrLabel } from '../../../shared/i18n/pt';
import { QuickActionRoll } from './RollsTab';

function ActionGrid({
  title,
  actions,
  ratings,
  harmPenalty,
  onChange,
  highlightRemaining,
}: {
  title: string;
  actions: { id: string; name: string; attribute: string; description: string }[];
  ratings: Record<string, number>;
  harmPenalty: number;
  onChange: (id: string, value: number) => void;
  highlightRemaining?: boolean;
}) {
  const baseMods = { ...defaultModifiers(), harmPenalty };
  return (
    <section className={sectionClass}>
      <h3 className={sectionTitleClass}>{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => {
          const rating = ratings[action.id] ?? 0;
          const overLimit = rating > CREATION_LIMITS.maxRatingAtCreation;
          return (
          <div
            key={action.id}
            className={`action-card ${highlightRemaining && rating === 0 ? 'action-card--needs-points' : ''} ${overLimit ? 'action-card--over-limit' : ''}`}
          >
            <div className="action-card__header">
              <div>
                <div className="action-card__name">{action.name}</div>
                <div className="action-card__attr">{attrLabel(action.attribute)}</div>
              </div>
              <ActionRatingPicker
                value={rating}
                onChange={(v) => onChange(action.id, v)}
              />
            </div>
            <p className="action-card__desc">{action.description}</p>
            {overLimit && (
              <p className="action-card__warn">Máx. {CREATION_LIMITS.maxRatingAtCreation} na criação</p>
            )}
            <QuickActionRoll
              actionName={action.name}
              rating={rating}
              poolSize={buildPoolSize(rating, baseMods)}
            />
          </div>
        );
        })}
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
  const { step7Remaining, vehicleCreationRemaining } = getDiscretionaryPoints(pilot);
  const needsFreePoints = step7Remaining > 0;
  const needsVehiclePoints = vehicleCreationRemaining > 0;

  return (
    <div className="flex flex-col gap-4">
      <div id={CREATION_ANCHORS.actions} className="creation-anchor flex flex-col gap-4">
      <ActionGrid
        title="Ações de piloto (Perspicácia · Destreza · Determinação)"
        actions={PILOT_ACTIONS}
        ratings={pilot.actionRatings}
        harmPenalty={pilotHarmPenalty(pilot)}
        highlightRemaining={needsFreePoints}
        onChange={(id, value) =>
          onChange({ ...pilot, actionRatings: { ...pilot.actionRatings, [id]: value } })
        }
      />
      <ActionGrid
        title="Ações do robô (Especialização · Agudeza)"
        actions={VEHICLE_ACTIONS}
        ratings={pilot.vehicleActionRatings}
        harmPenalty={vehicleDamagePenalty(pilot)}
        highlightRemaining={needsFreePoints || needsVehiclePoints}
        onChange={(id, value) =>
          onChange({ ...pilot, vehicleActionRatings: { ...pilot.vehicleActionRatings, [id]: value } })
        }
      />
      </div>
      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Notas de criação</h3>
        <p className="text-[0.7rem] text-[var(--hud-muted)]">
          Arquétipo +3 · História +1 · Abertura +1 · +2 livres (piloto ou robô) · +3 só no robô.
          Máx. 2 por ação na criação. Acompanhe o progresso na aba Criação.
        </p>
        <Field label="Notas">
          <textarea className={inputClass} rows={2} value={pilot.notes} onChange={(e) => onChange({ ...pilot, notes: e.target.value })} />
        </Field>
      </section>
    </div>
  );
}
