interface Props {
  label: string;
  value: number;
  onChange: (v: number) => void;
}

const steps = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export function RatingSlider({ label, value, onChange }: Props) {
  return (
    <div class="rating-slider">
      <div class="form-label">{label}</div>
      <div class="rating-slider-track">
        {steps.map((s) => (
          <button
            key={s}
            type="button"
            class={`rating-dot${s <= value ? ' rating-dot--active' : ''}`}
            onClick={() => onChange(s)}
            aria-label={`${label} ${s}`}
          >
            {Number.isInteger(s) ? s : ''}
          </button>
        ))}
        <span class="rating-value">{value.toFixed(1)}</span>
      </div>
    </div>
  );
}
