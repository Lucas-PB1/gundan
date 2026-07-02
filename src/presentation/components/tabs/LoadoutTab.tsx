import { Field, inputClass, sectionClass, sectionTitleClass } from '../ui/Field';
import type { LoadoutItem, PilotSheet } from '../../../domain/entities/PilotSheet';
import { countLoad } from '../../../domain/entities/PilotSheet';
import {
  getAvailableGear,
  LOAD_LIMITS,
  LOAD_MODES,
  type GearItem,
} from '../../../shared/data/beamSaberGearData';

function gearLabel(item: GearItem): string {
  const loadLabel = item.load === 0 ? 'Load 0' : `Load ${item.load}`;
  return `${item.name} [${loadLabel}]`;
}

export function LoadoutTab({
  pilot,
  onChange,
}: {
  pilot: PilotSheet;
  onChange: (p: PilotSheet) => void;
}) {
  const available = pilot.playbookId ? getAvailableGear(pilot.playbookId) : [];
  const equipped = pilot.loadout.filter((i) => i.equipped);
  const totalLoad = countLoad(pilot.loadout);
  const limit = LOAD_LIMITS[pilot.loadMode];

  const toggleGear = (gear: GearItem) => {
    const existing = pilot.loadout.find((i) => i.gearId === gear.id);
    let loadout: LoadoutItem[];
    if (existing) {
      loadout = pilot.loadout.map((i) =>
        i.gearId === gear.id ? { ...i, equipped: !i.equipped } : i,
      );
    } else {
      loadout = [
        ...pilot.loadout,
        { gearId: gear.id, name: gear.name, load: gear.load, equipped: true },
      ];
    }
    onChange({ ...pilot, loadout });
  };

  const standard = available.filter((g) => g.source === 'standard');
  const playbookPilot = available.filter((g) => g.source === 'playbook-pilot');
  const playbookVehicle = available.filter((g) => g.source === 'playbook-vehicle');

  const renderGearList = (items: GearItem[], title: string) => (
    <section className={sectionClass}>
      <h3 className={sectionTitleClass}>{title}</h3>
      <div className="flex flex-col gap-1">
        {items.map((gear) => {
          const entry = pilot.loadout.find((i) => i.gearId === gear.id);
          const equippedNow = entry?.equipped ?? false;
          return (
            <label
              key={gear.id}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                equippedNow ? 'bg-cyan-950/50 text-cyan-100' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <input
                type="checkbox"
                checked={equippedNow}
                onChange={() => toggleGear(gear)}
              />
              <span>{gearLabel(gear)}</span>
            </label>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="flex flex-col gap-4">
      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Loadout da missão</h3>
        <div className="mb-3 flex flex-wrap items-center gap-4">
          <Field label="Modo de carga">
            <select
              className={inputClass}
              value={pilot.loadMode}
              onChange={(e) =>
                onChange({ ...pilot, loadMode: e.target.value as PilotSheet['loadMode'] })
              }
            >
              {LOAD_MODES.map((m) => (
                <option key={m} value={m}>
                  {m} (máx. {LOAD_LIMITS[m]})
                </option>
              ))}
            </select>
          </Field>
          <div className="text-sm">
            <span className={totalLoad > limit ? 'text-rose-400' : 'text-cyan-300'}>
              {totalLoad}
            </span>
            <span className="text-slate-500"> / {limit} Load</span>
          </div>
        </div>
        {equipped.length > 0 && (
          <ul className="text-xs text-slate-400">
            {equipped.map((i) => (
              <li key={i.gearId}>• {i.name} ({i.load})</li>
            ))}
          </ul>
        )}
      </section>

      {!pilot.playbookId ? (
        <p className="text-sm text-slate-500">Selecione um playbook na aba Identidade.</p>
      ) : (
        <>
          {renderGearList(playbookPilot, 'Gear especialista (piloto)')}
          {renderGearList(standard, 'Gear padrão')}
          {renderGearList(playbookVehicle, 'Gear especialista (veículo)')}
        </>
      )}

      <Field label="Itens customizados">
        <textarea
          className={inputClass}
          rows={2}
          placeholder="Gadgets, bribes, itens inventados no downtime…"
          value={pilot.customGear}
          onChange={(e) => onChange({ ...pilot, customGear: e.target.value })}
        />
      </Field>
    </div>
  );
}
