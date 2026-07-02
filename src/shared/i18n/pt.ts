import type { LoadMode } from '../data/beamSaberGearData';
import type { PilotAttribute, VehicleAttribute } from '../data/beamSaberPilotData';
import type { ScarCondition } from '../data/beamSaberGearData';

export const ATTR_LABELS: Record<PilotAttribute | VehicleAttribute, string> = {
  insight: 'Perspicácia',
  prowess: 'Destreza',
  resolve: 'Determinação',
  expertise: 'Especialização',
  acuity: 'Agudeza',
};

export const LOAD_MODE_LABELS: Record<LoadMode, string> = {
  light: 'Leve',
  normal: 'Normal',
  heavy: 'Pesado',
};

export const SCAR_LABELS: Record<ScarCondition, string> = {
  Cold: 'Frio',
  Reckless: 'Imprudente',
  Haunted: 'Assombrado',
  Soft: 'Mole',
  Obsessed: 'Obcecado',
  Vicious: 'Cruel',
  Paranoid: 'Paranoico',
  Fractious: 'Conflituoso',
};

export function attrLabel(attr: string): string {
  return ATTR_LABELS[attr as PilotAttribute | VehicleAttribute] ?? attr;
}

export function loadModeLabel(mode: LoadMode): string {
  return LOAD_MODE_LABELS[mode];
}

export function scarLabel(scar: ScarCondition): string {
  return SCAR_LABELS[scar];
}

export function loadLabel(load: number): string {
  return load === 0 ? 'Carga 0' : `Carga ${load}`;
}
