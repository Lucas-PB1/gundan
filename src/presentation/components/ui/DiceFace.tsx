export function DiceFace({ value, highlight }: { value: number; highlight?: boolean }) {
  return (
    <span
      className={`dice-face ${highlight ? 'dice-face--best' : ''} ${value === 6 ? 'dice-face--six' : ''}`}
      aria-label={`dado ${value}`}
    >
      {value}
    </span>
  );
}
