import { Field, inputClass, sectionClass, sectionTitleClass } from '../ui/Field';
import { TickClock, XpTrack } from '../ui/TickClock';
import type { PilotSheet, VehicleQuirk } from '../../../domain/entities/PilotSheet';
import { EXAMPLE_QUIRKS } from '../../../shared/data/beamSaberGearData';
import { VEHICLE_ATTRIBUTES } from '../../../shared/data/beamSaberPilotData';

function QuirkRow({
  quirk,
  index,
  onChange,
}: {
  quirk: VehicleQuirk;
  index: number;
  onChange: (q: VehicleQuirk) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">Quirk {index + 1}</span>
        <label className="flex items-center gap-1 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={quirk.exhausted}
            onChange={(e) => onChange({ ...quirk, exhausted: e.target.checked })}
          />
          Exhausted
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <input
          list="example-quirks"
          className={inputClass}
          placeholder="Nome"
          value={quirk.name}
          onChange={(e) => onChange({ ...quirk, name: e.target.value })}
        />
        <input
          className={inputClass}
          placeholder="Descritor +"
          value={quirk.descriptor1}
          onChange={(e) => onChange({ ...quirk, descriptor1: e.target.value })}
        />
        <input
          className={inputClass}
          placeholder="Descritor −"
          value={quirk.descriptor2}
          onChange={(e) => onChange({ ...quirk, descriptor2: e.target.value })}
        />
      </div>
    </div>
  );
}

export function VehicleTab({
  pilot,
  onChange,
}: {
  pilot: PilotSheet;
  onChange: (p: PilotSheet) => void;
}) {
  const updateQuirk = (index: number, q: VehicleQuirk) => {
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
        <h3 className={sectionTitleClass}>Damage (veículo)</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nível 1">
            <input
              className={inputClass}
              value={pilot.vehicleDamage.level1}
              onChange={(e) =>
                onChange({ ...pilot, vehicleDamage: { ...pilot.vehicleDamage, level1: e.target.value } })
              }
            />
          </Field>
          <Field label="Nível 2">
            <input
              className={inputClass}
              value={pilot.vehicleDamage.level2}
              onChange={(e) =>
                onChange({ ...pilot, vehicleDamage: { ...pilot.vehicleDamage, level2: e.target.value } })
              }
            />
          </Field>
          <Field label="Nível 3">
            <input
              className={inputClass}
              value={pilot.vehicleDamage.level3}
              onChange={(e) =>
                onChange({ ...pilot, vehicleDamage: { ...pilot.vehicleDamage, level3: e.target.value } })
              }
            />
          </Field>
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
        <div className="mb-3 flex items-center justify-between">
          <h3 className={sectionTitleClass.replace('mb-3', '')}>Quirks (4 iniciais)</h3>
          <button
            type="button"
            onClick={refreshQuirks}
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            Refresh all
          </button>
        </div>
        <datalist id="example-quirks">
          {EXAMPLE_QUIRKS.map((q) => <option key={q} value={q} />)}
        </datalist>
        <div className="flex flex-col gap-2">
          {pilot.quirks.map((q, i) => (
            <QuirkRow key={i} quirk={q} index={i} onChange={(next) => updateQuirk(i, next)} />
          ))}
        </div>
      </section>

      <TickClock
        label="Breakdown"
        ticks={pilot.breakdownTicks}
        max={4}
        onChange={(t) => onChange({ ...pilot, breakdownTicks: t })}
      />

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Enhance track & XP de veículo</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <XpTrack
            label="Enhance (4 = novo Quirk ou +1 ação)"
            value={pilot.vehicleEnhanceXp}
            max={4}
            onChange={(v) => onChange({ ...pilot, vehicleEnhanceXp: v })}
          />
          {VEHICLE_ATTRIBUTES.map((attr) => (
            <XpTrack
              key={attr}
              label={`${attr} (Desperate = +1 XP)`}
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
