import type { DiceRollResult, FortuneRollResult, ResistanceResult } from '../../../domain/dice/beamSaberDice';
import { FORTUNE_LABELS, OUTCOME_LABELS } from '../../../domain/dice/beamSaberDice';
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
  if (!result) return null;

  const { dice, highest, poolSize } = result;

  let outcomeText = OUTCOME_LABELS[result.outcome];
  if (variant === 'fortune' && 'fortuneOutcome' in result) {
    outcomeText = FORTUNE_LABELS[result.fortuneOutcome];
  }

  return (
    <div className={`roll-result ${outcomeClass(variant === 'fortune' && 'fortuneOutcome' in result ? result.fortuneOutcome : result.outcome)}`}>
      <div className="roll-result__header">
        <span className="roll-result__label">{label}</span>
        <span className="roll-result__pool">{poolSize}d → maior: {highest || '—'}</span>
      </div>
      {dice.length === 0 ? (
        <p className="roll-result__empty">0 dados — marque Esforço (+1d) ou aumente o nível.</p>
      ) : (
        <div className="roll-result__dice">
          {dice.map((d, i) => (
            <DiceFace key={`${i}-${d}`} value={d} highlight={d === highest} />
          ))}
        </div>
      )}
      <p className="roll-result__outcome">{outcomeText}</p>
      {variant === 'resistance' && 'stressCost' in result && (
        <p className="roll-result__stress">Estresse da resistência: <strong>{result.stressCost}</strong></p>
      )}
      {result.isCrit && (
        <p className="roll-result__crit">CRÍTICO — dois ou mais 6!</p>
      )}
    </div>
  );
}
