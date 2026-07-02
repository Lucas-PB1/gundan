import { PILOT_ACTIONS, VEHICLE_ACTIONS } from '../../../shared/data/beamSaberPilotData';
import { attrLabel } from '../../../shared/i18n/pt';
import { inputClass } from './Field';

export function NarrativeActionBonusPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (actionId: string) => void;
}) {
  return (
    <select
      className={`${inputClass} hud-select cursor-pointer narrative-bonus-select`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Qual ação recebe +1? (piloto ou robô)…</option>
      <optgroup label="Ações de piloto">
        {PILOT_ACTIONS.map((action) => (
          <option key={action.id} value={action.id}>
            {action.name} ({attrLabel(action.attribute)})
          </option>
        ))}
      </optgroup>
      <optgroup label="Ações do robô">
        {VEHICLE_ACTIONS.map((action) => (
          <option key={action.id} value={action.id}>
            {action.name} ({attrLabel(action.attribute)})
          </option>
        ))}
      </optgroup>
    </select>
  );
}
