interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function FlavorRating({ value, onChange }: Props) {
  return (
    <div class="flavor-rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          class={`flavor-star${n <= value ? ' flavor-star--active' : ''}`}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n !== 1 ? 's' : ''}`}
        >
          {n <= value ? '\u2605' : '\u2606'}
        </button>
      ))}
    </div>
  );
}
