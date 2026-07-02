import type { PilotPlaybook } from '../../shared/data/beamSaberPilotData';
import { ALL_ACTION_IDS, VEHICLE_ACTIONS } from '../../shared/data/beamSaberPilotData';
import type { LoadMode } from '../../shared/data/beamSaberGearData';
import { migrateQuirkToPt } from '../../shared/data/beamSaberQuirkData';

export type ActionRatings = Record<string, number>;

export type ConnectionType = 'squad' | 'rival' | 'ally';

export interface PilotConnection {
  id: string;
  targetPilotId: string | null;
  name: string;
  type: ConnectionType;
  ticks: number;
  beliefs: string[];
  description: string;
}

export interface LoadoutItem {
  gearId: string;
  name: string;
  load: number;
  equipped: boolean;
}

export interface VehicleQuirk {
  name: string;
  descriptor1: string;
  descriptor2: string;
  exhausted: boolean;
  /** `null` = personalizada; id do exemplo do livro quando aplicável */
  templateId?: string | null;
}

export interface HarmTrack {
  level1: string;
  level2: string;
  level3: string;
  level4: boolean;
}

export interface PilotSheet {
  id: string;
  name: string;
  pronouns: string;
  callSign: string;
  look: string;
  playbookId: string;
  history: string;
  /** Ação de piloto ou veículo que recebe +1 pela História */
  historyBonusActionId: string;
  tragedy: string;
  opening: string;
  /** Ação de piloto ou veículo que recebe +1 pela Abertura */
  openingBonusActionId: string;
  drive: string;
  driveClocks: [number, number];
  ability: string;
  extraAbilities: string[];
  actionRatings: ActionRatings;
  stress: number;
  stressMax: number;
  harm: HarmTrack;
  scars: string[];
  armorUsed: boolean;
  sparkUsed: boolean;
  playbookXp: number;
  generalXp: number;
  attributeXp: { insight: number; prowess: number; resolve: number };
  connections: PilotConnection[];
  vehicleName: string;
  vehicleLook: string;
  vehicleActionRatings: ActionRatings;
  vehicleAttributeXp: { expertise: number; acuity: number };
  vehicleEnhanceXp: number;
  vehicleDamage: HarmTrack;
  breakdownTicks: number;
  quirks: VehicleQuirk[];
  loadMode: LoadMode;
  loadout: LoadoutItem[];
  customGear: string;
  healingClockFilled: number;
  notes: string;
  updatedAt: string;
}

export function createEmptyHarmTrack(): HarmTrack {
  return { level1: '', level2: '', level3: '', level4: false };
}

export function createEmptyQuirks(): VehicleQuirk[] {
  return Array.from({ length: 4 }, () => ({
    name: '',
    descriptor1: '',
    descriptor2: '',
    exhausted: false,
  }));
}

export function createEmptyActionRatings(): ActionRatings {
  return Object.fromEntries(ALL_ACTION_IDS.map((id) => [id, 0]));
}

const NARRATIVE_ACTION_BONUS = 1;

export function isVehicleActionId(actionId: string): boolean {
  return VEHICLE_ACTIONS.some((a) => a.id === actionId);
}

export function applyNarrativeActionBonus(ratings: ActionRatings, actionId: string): ActionRatings {
  if (!actionId) return ratings;
  const next = { ...ratings };
  next[actionId] = (next[actionId] ?? 0) + NARRATIVE_ACTION_BONUS;
  return next;
}

export function removeNarrativeActionBonus(ratings: ActionRatings, actionId: string): ActionRatings {
  if (!actionId) return ratings;
  const next = { ...ratings };
  next[actionId] = Math.max(0, (next[actionId] ?? 0) - NARRATIVE_ACTION_BONUS);
  return next;
}

export type NarrativeBonusSlot = 'history' | 'opening';

export function setNarrativeBonusAction(
  pilot: PilotSheet,
  slot: NarrativeBonusSlot,
  actionId: string,
): PilotSheet {
  const prevId = slot === 'history' ? pilot.historyBonusActionId : pilot.openingBonusActionId;

  let actionRatings = pilot.actionRatings;
  let vehicleActionRatings = pilot.vehicleActionRatings;

  if (prevId) {
    if (isVehicleActionId(prevId)) {
      vehicleActionRatings = removeNarrativeActionBonus(vehicleActionRatings, prevId);
    } else {
      actionRatings = removeNarrativeActionBonus(actionRatings, prevId);
    }
  }

  if (actionId) {
    if (isVehicleActionId(actionId)) {
      vehicleActionRatings = applyNarrativeActionBonus(vehicleActionRatings, actionId);
    } else {
      actionRatings = applyNarrativeActionBonus(actionRatings, actionId);
    }
  }

  return {
    ...pilot,
    actionRatings,
    vehicleActionRatings,
    ...(slot === 'history'
      ? { historyBonusActionId: actionId }
      : { openingBonusActionId: actionId }),
  };
}

export function clearNarrativeBonus(pilot: PilotSheet, slot: NarrativeBonusSlot): PilotSheet {
  return setNarrativeBonusAction(pilot, slot, '');
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

export function removePlaybookStartingBonuses(
  ratings: ActionRatings,
  playbook: PilotPlaybook,
): ActionRatings {
  const next = { ...ratings };
  for (const { actionId, bonus } of playbook.startingBonuses) {
    next[actionId] = Math.max(0, (next[actionId] ?? 0) - bonus);
  }
  return next;
}

/** Troca bônus de ação ao mudar de playbook sem zerar pontos distribuídos manualmente. */
export function swapPlaybookActionBonuses(
  ratings: ActionRatings,
  previousPlaybookId: string,
  nextPlaybookId: string,
  getPlaybook: (id: string) => PilotPlaybook | undefined,
): ActionRatings {
  let next = { ...ratings };
  const previous = previousPlaybookId ? getPlaybook(previousPlaybookId) : undefined;
  const upcoming = nextPlaybookId ? getPlaybook(nextPlaybookId) : undefined;
  if (previous) next = removePlaybookStartingBonuses(next, previous);
  if (upcoming) next = applyPlaybookStartingBonuses(next, upcoming);
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
    historyBonusActionId: '',
    tragedy: '',
    opening: '',
    openingBonusActionId: '',
    drive: '',
    driveClocks: [0, 0],
    ability: '',
    extraAbilities: [],
    actionRatings: createEmptyActionRatings(),
    stress: 0,
    stressMax: 9,
    harm: createEmptyHarmTrack(),
    scars: [],
    armorUsed: false,
    sparkUsed: false,
    playbookXp: 0,
    generalXp: 0,
    attributeXp: { insight: 0, prowess: 0, resolve: 0 },
    connections: [],
    vehicleName: '',
    vehicleLook: '',
    vehicleActionRatings: createEmptyActionRatings(),
    vehicleAttributeXp: { expertise: 0, acuity: 0 },
    vehicleEnhanceXp: 0,
    vehicleDamage: createEmptyHarmTrack(),
    breakdownTicks: 0,
    quirks: createEmptyQuirks(),
    loadMode: 'normal',
    loadout: [],
    customGear: '',
    healingClockFilled: 0,
    notes: '',
    updatedAt: new Date().toISOString(),
  };
}

export function migratePilot(raw: Partial<PilotSheet> & { id: string }): PilotSheet {
  const base = createEmptyPilotSheet(raw.id);

  const legacyConnections = raw.connections as
    | Record<string, { ticks: number; beliefs: string[] }>
    | PilotConnection[]
    | undefined;

  let connections: PilotConnection[] = base.connections;
  if (Array.isArray(legacyConnections)) {
    connections = legacyConnections;
  } else if (legacyConnections && typeof legacyConnections === 'object') {
    connections = Object.entries(legacyConnections).map(([key, val]) => ({
      id: crypto.randomUUID(),
      targetPilotId: key,
      name: '',
      type: 'squad' as const,
      ticks: val.ticks ?? 0,
      beliefs: val.beliefs ?? [''],
      description: '',
    }));
  }

  const legacyHarm = raw.harm as HarmTrack | number[] | undefined;
  let harm = base.harm;
  if (legacyHarm && !Array.isArray(legacyHarm)) {
    harm = legacyHarm;
  } else if (Array.isArray(legacyHarm)) {
    harm = {
      level1: legacyHarm[0] ? 'Harm 1' : '',
      level2: legacyHarm[1] ? 'Harm 2' : '',
      level3: legacyHarm[2] ? 'Harm 3' : '',
      level4: Boolean(legacyHarm[3]),
    };
  }

  const legacyQuirks = raw.quirks as VehicleQuirk[] | string[] | undefined;
  let quirks = base.quirks;
  if (Array.isArray(legacyQuirks) && legacyQuirks.length > 0) {
    if (typeof legacyQuirks[0] === 'string') {
      quirks = (legacyQuirks as string[]).map((name) => ({
        name,
        descriptor1: '',
        descriptor2: '',
        exhausted: false,
      }));
      while (quirks.length < 4) {
        quirks.push({ name: '', descriptor1: '', descriptor2: '', exhausted: false });
      }
    } else {
      quirks = legacyQuirks as VehicleQuirk[];
    }
  }
  quirks = quirks.map(migrateQuirkToPt);

  const legacyLoadout = raw.loadout as LoadoutItem[] | string[] | undefined;
  let loadout: LoadoutItem[] = base.loadout;
  if (Array.isArray(legacyLoadout)) {
    if (legacyLoadout.length > 0 && typeof legacyLoadout[0] === 'string') {
      loadout = (legacyLoadout as string[]).map((name) => ({
        gearId: name,
        name,
        load: 0,
        equipped: true,
      }));
    } else {
      loadout = legacyLoadout as LoadoutItem[];
    }
  }

  return {
    ...base,
    ...raw,
    harm,
    quirks,
    loadout,
    connections,
    driveClocks: raw.driveClocks ?? base.driveClocks,
    extraAbilities: raw.extraAbilities ?? base.extraAbilities,
    stressMax: raw.stressMax ?? base.stressMax,
    scars: raw.scars ?? base.scars,
    generalXp: raw.generalXp ?? base.generalXp,
    vehicleAttributeXp: raw.vehicleAttributeXp ?? base.vehicleAttributeXp,
    vehicleEnhanceXp: raw.vehicleEnhanceXp ?? base.vehicleEnhanceXp,
    vehicleDamage: raw.vehicleDamage ?? base.vehicleDamage,
    breakdownTicks: raw.breakdownTicks ?? base.breakdownTicks,
    loadMode: raw.loadMode ?? base.loadMode,
    customGear: raw.customGear ?? base.customGear,
    healingClockFilled: raw.healingClockFilled ?? base.healingClockFilled,
    historyBonusActionId: raw.historyBonusActionId ?? base.historyBonusActionId,
    openingBonusActionId: raw.openingBonusActionId ?? base.openingBonusActionId,
    updatedAt: raw.updatedAt ?? base.updatedAt,
  };
}

export function countLoad(loadout: LoadoutItem[]): number {
  return loadout.filter((i) => i.equipped).reduce((sum, i) => sum + i.load, 0);
}

export function newConnectionId(): string {
  return crypto.randomUUID();
}
