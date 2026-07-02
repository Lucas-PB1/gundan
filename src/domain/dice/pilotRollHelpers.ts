import type { PilotSheet } from '../entities/PilotSheet';
import {
  PILOT_ACTIONS,
  VEHICLE_ACTIONS,
  type PilotAction,
  type VehicleAction,
} from '../../shared/data/beamSaberPilotData';

export type RollKind = 'action' | 'resistance' | 'fortune' | 'gather';

export interface RollModifiers {
  push: boolean;
  assist: boolean;
  quirk: boolean;
  extraDice: number;
  harmPenalty: number;
}

export function defaultModifiers(): RollModifiers {
  return { push: false, assist: false, quirk: false, extraDice: 0, harmPenalty: 0 };
}

export function countHarmLevels(harm: { level1: string; level2: string; level3: string }): number {
  let n = 0;
  if (harm.level1.trim()) n += 1;
  if (harm.level2.trim()) n += 1;
  if (harm.level3.trim()) n += 1;
  return n;
}

export function attributeRatingFromActions(
  ratings: Record<string, number>,
  actions: { id: string; attribute: string }[],
  attribute: string,
): number {
  const values = actions
    .filter((a) => a.attribute === attribute)
    .map((a) => ratings[a.id] ?? 0);
  return values.length > 0 ? Math.max(...values) : 0;
}

export function getPilotActionRating(pilot: PilotSheet, actionId: string): number {
  return pilot.actionRatings[actionId] ?? 0;
}

export function getVehicleActionRating(pilot: PilotSheet, actionId: string): number {
  return pilot.vehicleActionRatings[actionId] ?? 0;
}

export function getPilotAction(actionId: string): PilotAction | undefined {
  return PILOT_ACTIONS.find((a) => a.id === actionId);
}

export function getVehicleAction(actionId: string): VehicleAction | undefined {
  return VEHICLE_ACTIONS.find((a) => a.id === actionId);
}

export function pilotHarmPenalty(pilot: PilotSheet): number {
  return countHarmLevels(pilot.harm);
}

export function vehicleDamagePenalty(pilot: PilotSheet): number {
  return countHarmLevels(pilot.vehicleDamage);
}

export function buildPoolSize(baseRating: number, mods: RollModifiers): number {
  let pool = baseRating;
  if (mods.push) pool += 1;
  if (mods.assist) pool += 1;
  if (mods.quirk) pool += 1;
  pool += mods.extraDice;
  pool -= mods.harmPenalty;
  return Math.max(0, pool);
}

export function resistanceRatingForPilotAttribute(
  pilot: PilotSheet,
  attribute: string,
): number {
  return attributeRatingFromActions(pilot.actionRatings, PILOT_ACTIONS, attribute);
}

export function resistanceRatingForVehicleAttribute(
  pilot: PilotSheet,
  attribute: string,
): number {
  return attributeRatingFromActions(pilot.vehicleActionRatings, VEHICLE_ACTIONS, attribute);
}
