import { Field, inputClass, sectionClass, sectionTitleClass } from '../ui/Field';
import { AbilityPicker } from '../ui/AbilityPicker';
import { OptionSelect } from '../ui/OptionSelect';
import type { PilotSheet } from '../../../domain/entities/PilotSheet';
import {
  EXAMPLE_HISTORIES,
  EXAMPLE_OPENINGS,
  EXAMPLE_TRAGEDIES,
  getPlaybookById,
  PILOT_PLAYBOOKS,
  PILOT_ACTIONS,
} from '../../../shared/data/beamSaberPilotData';
import { swapPlaybookActionBonuses } from '../../../domain/entities/PilotSheet';
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

  const handlePlaybookChange = (playbookId: string) => {
    onChange({
      ...pilot,
      playbookId,
      loadout: [],
      ability: '',
      actionRatings: swapPlaybookActionBonuses(
        pilot.actionRatings,
        pilot.playbookId,
        playbookId,
        getPlaybookById,
      ),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Arquétipo" help={FIELD_HELP.playbook}>
          <select
            className={`${inputClass} hud-select cursor-pointer`}
            value={pilot.playbookId}
            onChange={(e) => handlePlaybookChange(e.target.value)}
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
          <div className="flex items-end text-[0.72rem] text-[var(--hud-muted)]">
            Bônus nas Ações:{' '}
            {playbook.startingBonuses
              .map((b) => {
                const name = PILOT_ACTIONS.find((a) => a.id === b.actionId)?.name ?? b.actionId;
                return `${name} +${b.bonus}`;
              })
              .join(' · ')}
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
        <Field label="Indicativo">
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

      <Field label="Aparência">
        <textarea className={inputClass} rows={2} value={pilot.look} onChange={(e) => onChange({ ...pilot, look: e.target.value })} />
      </Field>

      <div className="grid gap-4 lg:grid-cols-3">
        <Field label="História" hint="+1 ação na criação" help={FIELD_HELP.history}>
          <OptionSelect
            options={EXAMPLE_HISTORIES}
            value={pilot.history}
            onChange={(history) => onChange({ ...pilot, history })}
          />
        </Field>
        <Field label="Tragédia" help={FIELD_HELP.tragedy}>
          <OptionSelect
            options={EXAMPLE_TRAGEDIES}
            value={pilot.tragedy}
            onChange={(tragedy) => onChange({ ...pilot, tragedy })}
          />
        </Field>
        <Field label="Abertura" hint="+1 ação na criação" help={FIELD_HELP.opening}>
          <OptionSelect
            options={EXAMPLE_OPENINGS}
            value={pilot.opening}
            onChange={(opening) => onChange({ ...pilot, opening })}
          />
        </Field>
      </div>

      <Field label="Impulso" help={FIELD_HELP.drive}>
        <textarea className={inputClass} rows={2} value={pilot.drive} onChange={(e) => onChange({ ...pilot, drive: e.target.value })} placeholder="O que você quer mudar no mundo?" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <TickClock
          label="Relógio de impulso α"
          help={FIELD_HELP.driveClock}
          ticks={pilot.driveClocks[0]}
          onChange={(t) => onChange({ ...pilot, driveClocks: [t, pilot.driveClocks[1]] })}
        />
        <TickClock
          label="Relógio de impulso β"
          help={FIELD_HELP.driveClock}
          ticks={pilot.driveClocks[1]}
          onChange={(t) => onChange({ ...pilot, driveClocks: [pilot.driveClocks[0], t] })}
        />
      </div>

      {playbook && (
        <section className={sectionClass}>
          <h3 className={sectionTitleClass}>Todas as habilidades — {playbook.name}</h3>
          <p className="mb-3 text-[0.7rem] text-[var(--hud-muted)]">
            Clique em uma habilidade acima para ler a regra. Veterano pode ser escolhida várias vezes.
          </p>
          <Field label="Habilidades extras obtidas">
            <input
              className={inputClass}
              placeholder="Veterano: Sede de Sangue, Veterano: Fantasma…"
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
