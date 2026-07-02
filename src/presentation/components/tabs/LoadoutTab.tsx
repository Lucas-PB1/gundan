import { Field, inputClass, sectionClass, sectionTitleClass } from '../ui/Field';
import { InfoTip } from '../ui/InfoTip';
import type { LoadoutItem, PilotSheet } from '../../../domain/entities/PilotSheet';
import { countLoad } from '../../../domain/entities/PilotSheet';
import {
  getAvailableGear,
  LOAD_LIMITS,
  LOAD_MODES,
  type GearItem,
} from '../../../shared/data/beamSaberGearData';
import {
  LOADOUT_FIELD_HELP,
  LOADOUT_RULES_SUMMARY,
  loadModeOptionHelp,
} from '../../../shared/data/beamSaberLoadoutHelp';
import { loadLabel as formatLoad, loadModeLabel } from '../../../shared/i18n/pt';

function gearLabel(item: GearItem): string {
  return `${item.name} [${formatLoad(item.load)}]`;
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
  const overLimit = totalLoad > limit;

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

  const renderGearList = (
    items: GearItem[],
    title: string,
    help: string,
  ) => (
    <section className={sectionClass}>
      <h3 className={`${sectionTitleClass} flex items-center`}>
        {title}
        <InfoTip text={help} />
      </h3>
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
        <h3 className={`${sectionTitleClass} flex items-center`}>
          Equipamento da missão
          <InfoTip text={LOADOUT_FIELD_HELP.missionLoadout} />
        </h3>
        <p className="mb-3 text-[0.72rem] leading-relaxed text-[var(--hud-muted)]">
          {LOADOUT_RULES_SUMMARY}
        </p>
        <div className="mb-3 flex flex-wrap items-end gap-4">
          <Field label="Modo de carga" help={LOADOUT_FIELD_HELP.loadMode}>
            <select
              className={inputClass}
              value={pilot.loadMode}
              onChange={(e) =>
                onChange({ ...pilot, loadMode: e.target.value as PilotSheet['loadMode'] })
              }
            >
              {LOAD_MODES.map((m) => (
                <option key={m} value={m} title={loadModeOptionHelp(m)}>
                  {loadModeLabel(m)} (máx. {LOAD_LIMITS[m]})
                </option>
              ))}
            </select>
          </Field>
          <div className="text-sm">
            <span className="font-mono text-[0.65rem] uppercase tracking-wide text-[var(--hud-muted)]">
              Carga declarada{' '}
            </span>
            <span className={overLimit ? 'text-rose-400' : 'text-cyan-300'}>
              {totalLoad}
            </span>
            <span className="text-slate-500"> / {limit}</span>
            {overLimit && (
              <p className="mt-1 text-[0.68rem] text-rose-400">
                Acima do limite — desmarque itens ou mude para modo mais pesado.
              </p>
            )}
          </div>
        </div>
        <p className="mb-3 text-[0.68rem] text-[var(--hud-muted)]">
          {loadModeOptionHelp(pilot.loadMode)}
        </p>
        {equipped.length > 0 && (
          <div>
            <p className="mb-1 font-mono text-[0.62rem] uppercase tracking-wide text-[var(--hud-accent-dim)]">
              Na missão agora
            </p>
            <ul className="text-xs text-slate-400">
              {equipped.map((i) => (
                <li key={i.gearId}>• {i.name} ({formatLoad(i.load)})</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {!pilot.playbookId ? (
        <p className="text-sm text-slate-500">Selecione um arquétipo na aba Identidade.</p>
      ) : (
        <>
          {renderGearList(
            playbookPilot,
            'Equipamento especialista (piloto)',
            LOADOUT_FIELD_HELP.specialistPilot,
          )}
          {renderGearList(standard, 'Equipamento padrão', LOADOUT_FIELD_HELP.standard)}
          {renderGearList(
            playbookVehicle,
            'Equipamento especialista (veículo)',
            LOADOUT_FIELD_HELP.specialistVehicle,
          )}
        </>
      )}

      <Field label="Itens customizados" help={LOADOUT_FIELD_HELP.customGear}>
        <textarea
          className={inputClass}
          rows={2}
          placeholder="Aparelhos, subornos, itens inventados no tempo livre…"
          value={pilot.customGear}
          onChange={(e) => onChange({ ...pilot, customGear: e.target.value })}
        />
      </Field>
    </div>
  );
}
