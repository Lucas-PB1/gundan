import { Field, inputClass, sectionClass, sectionTitleClass } from '../ui/Field';
import { TickClock, XpTrack } from '../ui/TickClock';
import type { PilotSheet } from '../../../domain/entities/PilotSheet';
import { FIELD_HELP, SCAR_HELP } from '../../../shared/data/beamSaberHelpData';
import { InfoTip } from '../ui/InfoTip';
import { SCAR_CONDITIONS } from '../../../shared/data/beamSaberGearData';
import { PILOT_ATTRIBUTES } from '../../../shared/data/beamSaberPilotData';

export function ConditionTab({
  pilot,
  onChange,
}: {
  pilot: PilotSheet;
  onChange: (p: PilotSheet) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <section className={sectionClass}>
        <h3 className={`${sectionTitleClass} flex items-center`}>
          Stress
          <InfoTip text={FIELD_HELP.stress} />
        </h3>
        <div className="mb-3 flex flex-wrap gap-1">
          {Array.from({ length: pilot.stressMax + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange({ ...pilot, stress: i })}
              className={`h-8 w-8 border font-mono text-xs font-bold ${
                i <= pilot.stress
                  ? 'border-[var(--hud-warn)] bg-[rgba(255,59,59,0.35)] text-white shadow-[0_0_6px_rgba(255,59,59,0.4)]'
                  : 'border-[var(--hud-border)] bg-[rgba(0,0,0,0.3)] text-[var(--hud-muted)]'
              }`}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--hud-muted)]">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={pilot.armorUsed}
              onChange={(e) => onChange({ ...pilot, armorUsed: e.target.checked })}
            />
            Armor gasto
            <InfoTip text={FIELD_HELP.armor} />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={pilot.sparkUsed}
              onChange={(e) => onChange({ ...pilot, sparkUsed: e.target.checked })}
            />
            Spark gasto
            <InfoTip text={FIELD_HELP.spark} />
          </label>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className={`${sectionTitleClass} flex items-center`}>
          Harm
          <InfoTip text={FIELD_HELP.harm} />
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nível 1 — Less">
            <input
              className={inputClass}
              placeholder="Ex.: Bruised, Bloody"
              value={pilot.harm.level1}
              onChange={(e) => onChange({ ...pilot, harm: { ...pilot.harm, level1: e.target.value } })}
            />
          </Field>
          <Field label="Nível 2 — Serious">
            <input
              className={inputClass}
              value={pilot.harm.level2}
              onChange={(e) => onChange({ ...pilot, harm: { ...pilot.harm, level2: e.target.value } })}
            />
          </Field>
          <Field label="Nível 3 — Severe">
            <input
              className={inputClass}
              value={pilot.harm.level3}
              onChange={(e) => onChange({ ...pilot, harm: { ...pilot.harm, level3: e.target.value } })}
            />
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-rose-400">
            <input
              type="checkbox"
              checked={pilot.harm.level4}
              onChange={(e) => onChange({ ...pilot, harm: { ...pilot.harm, level4: e.target.checked } })}
            />
            Nível 4 — Morto
          </label>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className={`${sectionTitleClass} flex items-center`}>
          Scars
          <InfoTip text={FIELD_HELP.scars} />
        </h3>
        <div className="flex flex-wrap gap-2">
          {SCAR_CONDITIONS.map((scar) => {
            const active = pilot.scars.includes(scar);
            return (
              <button
                key={scar}
                type="button"
                title={SCAR_HELP[scar]}
                onClick={() =>
                  onChange({
                    ...pilot,
                    scars: active
                      ? pilot.scars.filter((s) => s !== scar)
                      : [...pilot.scars, scar],
                  })
                }
                className={`border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wide ${
                  active
                    ? 'border-[#a855f7] bg-[rgba(168,85,247,0.25)] text-[#e9d5ff]'
                    : 'border-[var(--hud-border)] text-[var(--hud-muted)] hover:border-[var(--hud-accent-dim)]'
                }`}
              >
                {scar}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[0.65rem] text-[var(--hud-muted)]">4ª Scar → piloto sai da guerra.</p>
      </section>

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Experiência</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <XpTrack
            label="Playbook XP"
            help={FIELD_HELP.playbookXp}
            value={pilot.playbookXp}
            max={8}
            onChange={(v) => onChange({ ...pilot, playbookXp: v })}
          />
          <XpTrack
            label="General XP"
            value={pilot.generalXp}
            max={10}
            onChange={(v) => onChange({ ...pilot, generalXp: v })}
          />
          {PILOT_ATTRIBUTES.map((attr) => (
            <XpTrack
              key={attr}
              label={attr}
              help={FIELD_HELP.attributeXp}
              value={pilot.attributeXp[attr]}
              max={6}
              onChange={(v) =>
                onChange({
                  ...pilot,
                  attributeXp: { ...pilot.attributeXp, [attr]: v },
                })
              }
            />
          ))}
        </div>
      </section>

      <TickClock
        label="Healing clock (segmentos preenchidos)"
        ticks={pilot.healingClockFilled}
        max={4}
        onChange={(t) => onChange({ ...pilot, healingClockFilled: t })}
      />
    </div>
  );
}
