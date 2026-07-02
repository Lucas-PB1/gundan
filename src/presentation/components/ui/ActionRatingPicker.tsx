export function ActionRatingPicker({
  value,
  max = 4,
  onChange,
}: {
  value: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="action-rating" role="group" aria-label={`Rating ${value} de ${max}`}>
      {Array.from({ length: max + 1 }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i}`}
          aria-pressed={value === i}
          onClick={() => onChange(i)}
          className={`action-rating__btn ${value === i ? 'action-rating__btn--active' : ''}`}
        >
          {i}
        </button>
      ))}
    </div>
  );
}
