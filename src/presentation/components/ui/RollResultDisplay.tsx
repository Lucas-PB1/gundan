import { motion, useReducedMotion } from 'motion/react';
import type { DiceRollResult, FortuneRollResult, ResistanceResult } from '../../../domain/dice/beamSaberDice';
import { FORTUNE_LABELS, OUTCOME_LABELS } from '../../../domain/dice/beamSaberDice';
import { popIn, hudTween } from '../../motion/hudMotion';
import { DiceFace } from './DiceFace';

function outcomeClass(outcome: string): string {
  switch (outcome) {
    case 'crit':
    case 'success':
    case 'good':
      return 'roll-result--good';
    case 'partial':
    case 'mixed':
      return 'roll-result--partial';
    default:
      return 'roll-result--bad';
  }
}

export function RollResultDisplay({
  label,
  result,
  variant = 'action',
}: {
  label: string;
  result: DiceRollResult | ResistanceResult | FortuneRollResult | null;
  variant?: 'action' | 'resistance' | 'fortune';
}) {
  const reduced = useReducedMotion();

  if (!result) return null;

  const { dice, highest, poolSize } = result;

  let outcomeText = OUTCOME_LABELS[result.outcome];
  if (variant === 'fortune' && 'fortuneOutcome' in result) {
    outcomeText = FORTUNE_LABELS[result.fortuneOutcome];
  }

  const outcomeKey =
    variant === 'fortune' && 'fortuneOutcome' in result ? result.fortuneOutcome : result.outcome;

  return (
    <motion.div
      key={`${label}-${poolSize}-${highest}-${dice.join(',')}`}
      className={`roll-result ${outcomeClass(outcomeKey)}`}
      variants={popIn}
      initial="hidden"
      animate="visible"
      transition={hudTween(!!reduced)}
    >
      <div className="roll-result__header">
        <span className="roll-result__label">{label}</span>
        <span className="roll-result__pool">{poolSize}d → maior: {highest || '—'}</span>
      </div>
      {dice.length === 0 ? (
        <p className="roll-result__empty">0 dados — marque Esforço (+1d) ou aumente o nível.</p>
      ) : (
        <div className="roll-result__dice">
          {dice.map((d, i) => (
            <DiceFace key={`${i}-${d}`} value={d} highlight={d === highest} index={i} />
          ))}
        </div>
      )}
      <motion.p
        className="roll-result__outcome"
        initial={reduced ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.12 }}
      >
        {outcomeText}
      </motion.p>
      {variant === 'resistance' && 'stressCost' in result && (
        <p className="roll-result__stress">Estresse da resistência: <strong>{result.stressCost}</strong></p>
      )}
      {result.isCrit && (
        <motion.p
          className="roll-result__crit"
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduced ? 0 : 0.18, type: 'spring', stiffness: 500, damping: 24 }}
        >
          CRÍTICO — dois ou mais 6!
        </motion.p>
      )}
    </motion.div>
  );
}
