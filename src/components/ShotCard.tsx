import type { Shot, Cafe } from '../types';

interface Props {
  shot: Shot;
  cafe?: Cafe;
}

export function ShotCard({ shot, cafe }: Props) {
  const date = new Date(shot.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <a href={`#/shot/${shot.id}`} class="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {cafe && <div style={{ fontWeight: 600, fontSize: '15px' }}>{cafe.name}</div>}
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{date}</div>
        </div>
        <span class="score-badge">{shot.overallScore.toFixed(1)}</span>
      </div>
      {shot.notes && (
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
          {shot.notes.length > 80 ? shot.notes.slice(0, 80) + '...' : shot.notes}
        </p>
      )}
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
        <span>Crema {shot.crema}</span>
        <span>Body {shot.body}</span>
        <span>Acidity {shot.acidity}</span>
        <span>Sweet {shot.sweetness}</span>
      </div>
    </a>
  );
}
