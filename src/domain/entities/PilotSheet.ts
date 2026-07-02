import type { PilotPlaybook } from '../../shared/data/beamSaberPilotData';
import { ALL_ACTION_IDS } from '../../shared/data/beamSaberPilotData';

export type ActionRatings = Record<string, number>;

export interface PilotSheet {
  id: string;
  name: string;
  pronouns: string;
  callSign: string;
  look: string;
  playbookId: string;
  history: string;
  tragedy: string;
  opening: string;
  drive: string;
  ability: string;
  actionRatings: ActionRatings;
  stress: number;
  harm: number[];
  armorUsed: boolean;
  sparkUsed: boolean;
  playbookXp: number;
  attributeXp: { insight: number; prowess: number; resolve: number };
  connections: Record<string, { ticks: number; beliefs: string[] }>;
  vehicleName: string;
  vehicleLook: string;
  vehicleActionRatings: ActionRatings;
  quirks: string[];
  loadout: string[];
  notes: string;
  updatedAt: string;
}

export function createEmptyActionRatings(): ActionRatings {
  return Object.fromEntries(ALL_ACTION_IDS.map((id) => [id, 0]));
}

export function applyPlaybookStartingBonuses(
  ratings: ActionRatings,
  playbook: PilotPlaybook,
): ActionRatings {
  const next = { ...ratings };
  for (const { actionId, bonus } of playbook.startingBonuses) {
    next[actionId] = (next[actionId] ?? 0) + bonus;
  }
  return next;
}

export function createEmptyPilotSheet(id: string): PilotSheet {
  return {
    id,
    name: '',
    pronouns: '',
    callSign: '',
    look: '',
    playbookId: '',
    history: '',
    tragedy: '',
    opening: '',
    drive: '',
    ability: '',
    actionRatings: createEmptyActionRatings(),
    stress: 0,
    harm: [0, 0, 0, 0],
    armorUsed: false,
    sparkUsed: false,
    playbookXp: 0,
    attributeXp: { insight: 0, prowess: 0, resolve: 0 },
    connections: {},
    vehicleName: '',
    vehicleLook: '',
    vehicleActionRatings: createEmptyActionRatings(),
    quirks: ['', '', '', ''],
    loadout: [],
    notes: '',
    updatedAt: new Date().toISOString(),
  };
}

const STORAGE_KEY = 'beam-saber-pilots';

export function loadPilots(): PilotSheet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PilotSheet[]) : [];
  } catch {
    return [];
  }
}

export function savePilots(pilots: PilotSheet[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pilots));
}

export function upsertPilot(pilot: PilotSheet): PilotSheet[] {
  const pilots = loadPilots();
  const idx = pilots.findIndex((p) => p.id === pilot.id);
  const next = { ...pilot, updatedAt: new Date().toISOString() };
  if (idx >= 0) pilots[idx] = next;
  else pilots.push(next);
  savePilots(pilots);
  return pilots;
}
