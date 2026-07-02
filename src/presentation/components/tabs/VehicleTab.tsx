import { Field, inputClass, sectionClass, sectionTitleClass } from '../ui/Field';
import { InfoTip } from '../ui/InfoTip';
import { TickClock, XpTrack } from '../ui/TickClock';
import { QuirkRow } from '../ui/QuirkRow';
import type { PilotSheet } from '../../../domain/entities/PilotSheet';
import { FIELD_HELP } from '../../../shared/data/beamSaberHelpData';
import { VEHICLE_DAMAGE_HELP, VEHICLE_DAMAGE_LEVELS } from '../../../shared/data/beamSaberDamageHelp';
import { QUIRK_RULES_SUMMARY } from '../../../shared/data/beamSaberQuirkData';
import { VEHICLE_ATTRIBUTES } from '../../../shared/data/beamSaberPilotData';
import { attrLabel } from '../../../shared/i18n/pt';

export function VehicleTab({
  pilot,
  onChange,
}: {
  pilot: PilotSheet;
  onChange: (p: PilotSheet) => void;
}) {
  const updateQuirk = (index: number, q: typeof pilot.quirks[0]) => {
    const quirks = [...pilot.quirks];
    quirks[index] = q;
    onChange({ ...pilot, quirks });
  };

  const refreshQuirks = () => {
    onChange({
      ...pilot,
      quirks: pilot.quirks.map((q) => ({ ...q, exhausted: false })),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome do veículo">
          <input
            className={inputClass}
            value={pilot.vehicleName}
            onChange={(e) => onChange({ ...pilot, vehicleName: e.target.value })}
          />
        </Field>
        <Field label="Aparência">
          <input
            className={inputClass}
            value={pilot.vehicleLook}
            onChange={(e) => onChange({ ...pilot, vehicleLook: e.target.value })}
          />
        </Field>
      </div>

      <section className={sectionClass}>
        <h3 className={`${sectionTitleClass} flex items-center`}>
          Dano (veículo)
          <InfoTip text={VEHICLE_DAMAGE_HELP} />
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {VEHICLE_DAMAGE_LEVELS.map((row) => {
            const key = `level${row.level}` as 'level1' | 'level2' | 'level3';
            return (
              <Field key={row.level} label={row.label}>
                <input
                  className={inputClass}
                  placeholder={row.placeholder}
                  value={pilot.vehicleDamage[key]}
                  onChange={(e) =>
                    onChange({
                      ...pilot,
                      vehicleDamage: { ...pilot.vehicleDamage, [key]: e.target.value },
                    })
                  }
                />
              </Field>
            );
          })}
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-rose-400">
            <input
              type="checkbox"
              checked={pilot.vehicleDamage.level4}
              onChange={(e) =>
                onChange({ ...pilot, vehicleDamage: { ...pilot.vehicleDamage, level4: e.target.checked } })
              }
            />
            Destruído (nível 4)
          </label>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className={`${sectionTitleClass.replace('mb-3', '')} flex items-center`}>
            Peculiaridades (4 iniciais)
            <InfoTip text={FIELD_HELP.quirks} />
          </h3>
          <button
            type="button"
            onClick={refreshQuirks}
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            Renovar todas
          </button>
        </div>
        <p className="mb-3 text-[0.72rem] leading-relaxed text-[var(--hud-muted)]">{QUIRK_RULES_SUMMARY}</p>
        <div className="flex flex-col gap-3">
          {pilot.quirks.map((q, i) => (
            <QuirkRow key={i} quirk={q} index={i} onChange={(next) => updateQuirk(i, next)} />
          ))}
        </div>
      </section>

      <TickClock
        label="Colapso"
        ticks={pilot.breakdownTicks}
        max={4}
        onChange={(t) => onChange({ ...pilot, breakdownTicks: t })}
      />

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Trilha de aprimoramento e XP de veículo</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <XpTrack
            label="Aprimoramento (4 = nova peculiaridade ou +1 ação)"
            value={pilot.vehicleEnhanceXp}
            max={4}
            onChange={(v) => onChange({ ...pilot, vehicleEnhanceXp: v })}
          />
          {VEHICLE_ATTRIBUTES.map((attr) => (
            <XpTrack
              key={attr}
              label={`${attrLabel(attr)} (Desesperado = +1 XP)`}
              value={pilot.vehicleAttributeXp[attr]}
              max={6}
              onChange={(v) =>
                onChange({
                  ...pilot,
                  vehicleAttributeXp: { ...pilot.vehicleAttributeXp, [attr]: v },
                })
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
