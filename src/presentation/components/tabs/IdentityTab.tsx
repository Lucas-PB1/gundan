import { Field, inputClass, sectionClass, sectionTitleClass } from '../ui/Field';
import { AbilityPicker } from '../ui/AbilityPicker';
import type { PilotSheet } from '../../../domain/entities/PilotSheet';
import {
  EXAMPLE_HISTORIES,
  EXAMPLE_OPENINGS,
  EXAMPLE_TRAGEDIES,
  getPlaybookById,
  PILOT_PLAYBOOKS,
} from '../../../shared/data/beamSaberPilotData';
import { applyPlaybookStartingBonuses } from '../../../domain/entities/PilotSheet';
import { FIELD_HELP, PLAYBOOK_HELP } from '../../../shared/data/beamSaberHelpData';
import { TickClock } from '../ui/TickClock';

export function IdentityTab({
  pilot,
  onChange,
}: {
  pilot: PilotSheet;
  onChange: (p: PilotSheet) => void;
}) {
  const playbook = getPlaybookById(pilot.playbookId);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Playbook" help={FIELD_HELP.playbook}>
          <select
            className={inputClass}
            value={pilot.playbookId}
            onChange={(e) => onChange({ ...pilot, playbookId: e.target.value, loadout: [], ability: '' })}
          >
            <option value="">Selecione…</option>
            {PILOT_PLAYBOOKS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.tagline}
              </option>
            ))}
          </select>
        </Field>
        {playbook && (
          <div className="flex items-end">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...pilot,
                  actionRatings: applyPlaybookStartingBonuses(pilot.actionRatings, playbook),
                })
              }
              className="hud-btn"
            >
              ▸ Aplicar bônus do playbook
            </button>
          </div>
        )}
      </div>

      {playbook && (
        <div className="hud-info-box">
          <p className="m-0 mb-1">
            <span className="font-semibold text-[var(--hud-accent)]">Gatilho XP:</span>{' '}
            {playbook.xpTrigger}
          </p>
          <p className="m-0 text-[0.75rem] text-[var(--hud-muted)]">
            {PLAYBOOK_HELP[playbook.id] ?? playbook.tagline}
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Nome">
          <input className={inputClass} value={pilot.name} onChange={(e) => onChange({ ...pilot, name: e.target.value })} />
        </Field>
        <Field label="Pronomes">
          <input className={inputClass} value={pilot.pronouns} onChange={(e) => onChange({ ...pilot, pronouns: e.target.value })} />
        </Field>
        <Field label="Callsign">
          <input className={inputClass} value={pilot.callSign} onChange={(e) => onChange({ ...pilot, callSign: e.target.value })} />
        </Field>
      </div>

      {playbook && (
        <AbilityPicker
          playbookId={playbook.id}
          abilities={playbook.abilities}
          value={pilot.ability}
          onChange={(ability) => onChange({ ...pilot, ability })}
          help={FIELD_HELP.ability}
        />
      )}

      <Field label="Aparência (Look)">
        <textarea className={inputClass} rows={2} value={pilot.look} onChange={(e) => onChange({ ...pilot, look: e.target.value })} />
      </Field>

      <div className="grid gap-4 lg:grid-cols-3">
        <Field label="History" hint="+1 ação na criação" help={FIELD_HELP.history}>
          <input list="histories" className={inputClass} value={pilot.history} onChange={(e) => onChange({ ...pilot, history: e.target.value })} />
        </Field>
        <Field label="Tragedy" help={FIELD_HELP.tragedy}>
          <input list="tragedies" className={inputClass} value={pilot.tragedy} onChange={(e) => onChange({ ...pilot, tragedy: e.target.value })} />
        </Field>
        <Field label="Opening" hint="+1 ação na criação" help={FIELD_HELP.opening}>
          <input list="openings" className={inputClass} value={pilot.opening} onChange={(e) => onChange({ ...pilot, opening: e.target.value })} />
        </Field>
      </div>
      <datalist id="histories">{EXAMPLE_HISTORIES.map((h) => <option key={h} value={h} />)}</datalist>
      <datalist id="tragedies">{EXAMPLE_TRAGEDIES.map((t) => <option key={t} value={t} />)}</datalist>
      <datalist id="openings">{EXAMPLE_OPENINGS.map((o) => <option key={o} value={o} />)}</datalist>

      <Field label="Drive" help={FIELD_HELP.drive}>
        <textarea className={inputClass} rows={2} value={pilot.drive} onChange={(e) => onChange({ ...pilot, drive: e.target.value })} placeholder="O que você quer mudar no mundo?" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <TickClock
          label="Drive Clock α"
          help={FIELD_HELP.driveClock}
          ticks={pilot.driveClocks[0]}
          onChange={(t) => onChange({ ...pilot, driveClocks: [t, pilot.driveClocks[1]] })}
        />
        <TickClock
          label="Drive Clock β"
          help={FIELD_HELP.driveClock}
          ticks={pilot.driveClocks[1]}
          onChange={(t) => onChange({ ...pilot, driveClocks: [pilot.driveClocks[0], t] })}
        />
      </div>

      {playbook && (
        <section className={sectionClass}>
          <h3 className={sectionTitleClass}>Todas as habilidades — {playbook.name}</h3>
          <p className="mb-3 text-[0.7rem] text-[var(--hud-muted)]">
            Clique em uma habilidade acima para ler a regra. Veteran pode ser escolhida várias vezes.
          </p>
          <Field label="Habilidades extras obtidas">
            <input
              className={inputClass}
              placeholder="Veteran: Bloodlust, Veteran: Ghost…"
              value={pilot.extraAbilities.join(', ')}
              onChange={(e) =>
                onChange({
                  ...pilot,
                  extraAbilities: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </Field>
        </section>
      )}
    </div>
  );
}
