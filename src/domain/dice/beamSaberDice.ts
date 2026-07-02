export type RollOutcome = 'crit' | 'success' | 'partial' | 'failure';

export interface DiceRollResult {
  dice: number[];
  highest: number;
  outcome: RollOutcome;
  poolSize: number;
  isCrit: boolean;
}

export interface ResistanceResult extends DiceRollResult {
  stressCost: number;
}

export type FortuneOutcome = 'bad' | 'mixed' | 'good';

export interface FortuneRollResult extends DiceRollResult {
  fortuneOutcome: FortuneOutcome;
}

function rollSingleD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function clampPool(size: number): number {
  return Math.max(0, size);
}

export function rollPool(poolSize: number): number[] {
  const size = clampPool(poolSize);
  if (size === 0) return [];
  return Array.from({ length: size }, rollSingleD6);
}

export function highestDie(dice: number[]): number {
  if (dice.length === 0) return 0;
  return Math.max(...dice);
}

export function isCritRoll(dice: number[]): boolean {
  return dice.filter((d) => d === 6).length >= 2;
}

export function interpretActionOutcome(highest: number, dice: number[]): RollOutcome {
  if (dice.length === 0) return 'failure';
  if (isCritRoll(dice)) return 'crit';
  if (highest === 6) return 'success';
  if (highest >= 4) return 'partial';
  return 'failure';
}

export function interpretFortuneOutcome(highest: number, dice: number[]): FortuneOutcome {
  if (dice.length === 0) return 'bad';
  if (isCritRoll(dice) || highest === 6) return 'good';
  if (highest >= 4) return 'mixed';
  return 'bad';
}

/** Stress ao resistir (padrão Blades / Beam Saber). */
export function resistanceStressCost(highest: number): number {
  if (highest >= 6) return 0;
  if (highest >= 4) return 1;
  if (highest >= 2) return 2;
  return 3;
}

export function rollAction(poolSize: number): DiceRollResult {
  const dice = rollPool(poolSize);
  const highest = highestDie(dice);
  return {
    dice,
    highest,
    outcome: interpretActionOutcome(highest, dice),
    poolSize: clampPool(poolSize),
    isCrit: isCritRoll(dice),
  };
}

export function rollResistance(poolSize: number): ResistanceResult {
  const base = rollAction(poolSize);
  return {
    ...base,
    stressCost: base.dice.length > 0 ? resistanceStressCost(base.highest) : 3,
  };
}

export function rollFortune(poolSize: number): FortuneRollResult {
  const dice = rollPool(poolSize);
  const highest = highestDie(dice);
  return {
    dice,
    highest,
    outcome: interpretActionOutcome(highest, dice),
    poolSize: clampPool(poolSize),
    isCrit: isCritRoll(dice),
    fortuneOutcome: interpretFortuneOutcome(highest, dice),
  };
}

export const OUTCOME_LABELS: Record<RollOutcome, string> = {
  crit: 'Crítico — sucesso total + bônus',
  success: '6 — sucesso total',
  partial: '4–5 — sucesso com consequência',
  failure: '1–3 — falha ou consequência grave',
};

export const FORTUNE_LABELS: Record<FortuneOutcome, string> = {
  bad: '1–3 — resultado ruim',
  mixed: '4–5 — resultado misto',
  good: '6 — resultado favorável',
};
