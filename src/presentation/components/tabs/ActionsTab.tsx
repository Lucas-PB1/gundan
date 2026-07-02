import { Field, inputClass, sectionClass, sectionTitleClass } from '../ui/Field';
import type { PilotSheet } from '../../../domain/entities/PilotSheet';
import { PILOT_ACTIONS, VEHICLE_ACTIONS } from '../../../shared/data/beamSaberPilotData';

function ActionGrid({
  title,
  actions,
  ratings,
  onChange,
}: {
  title: string;
  actions: { id: string; name: string; attribute: string; description: string }[];
  ratings: Record<string, number>;
  onChange: (id: string, value: number) => void;
}) {
  return (
    <section className={sectionClass}>
      <h3 className={sectionTitleClass}>{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between gap-2 border border-[var(--hud-border)] bg-[rgba(0,0,0,0.25)] px-3 py-2"
            title={action.description}
          >
            <div className="min-w-0">
              <div className="font-medium text-[var(--hud-text)]">
                {action.name}
                <span className="ml-2 font-mono text-[0.6rem] uppercase text-[var(--hud-accent-dim)]">
                  {action.attribute}
                </span>
              </div>
              <div className="text-[0.7rem] leading-snug text-[var(--hud-muted)]">{action.description}</div>
            </div>
            <input
              type="number"
              min={0}
              max={4}
              className={`${inputClass} w-14 shrink-0 text-center`}
              value={ratings[action.id] ?? 0}
              onChange={(e) => onChange(action.id, Math.min(4, Math.max(0, Number(e.target.value))))}
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
        title="Ações de piloto (Insight · Prowess · Resolve)"
        actions={PILOT_ACTIONS}
        ratings={pilot.actionRatings}
        onChange={(id, value) =>
          onChange({ ...pilot, actionRatings: { ...pilot.actionRatings, [id]: value } })
        }
      />
      <ActionGrid
        title="Ações de veículo (Expertise · Acuity)"
        actions={VEHICLE_ACTIONS}
        ratings={pilot.vehicleActionRatings}
        onChange={(id, value) =>
          onChange({ ...pilot, vehicleActionRatings: { ...pilot.vehicleActionRatings, [id]: value } })
        }
      />
      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Notas de criação</h3>
        <p className="text-[0.7rem] text-[var(--hud-muted)]">
          Na criação: máx. 2 por ação. Playbook dá +3 pontos; History e Opening dão +1 cada.
          Veículo ganha +3 pontos só em ações de veículo.
        </p>
        <Field label="Notas">
          <textarea className={inputClass} rows={2} value={pilot.notes} onChange={(e) => onChange({ ...pilot, notes: e.target.value })} />
        </Field>
      </section>
    </div>
  );
}
