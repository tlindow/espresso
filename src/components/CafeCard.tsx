import type { Cafe } from '../types';

interface Props {
  cafe: Cafe;
  avgScore?: number;
  shotCount?: number;
}

export function CafeCard({ cafe, avgScore, shotCount }: Props) {
  return (
    <a href={`#/cafe/${cafe.id}`} class="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '16px' }}>{cafe.name}</div>
          {(cafe.city || cafe.address) && (
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {cafe.address ? `${cafe.address}${cafe.city ? `, ${cafe.city}` : ''}` : cafe.city}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          {avgScore !== undefined && <span class="score-badge">{avgScore.toFixed(1)}</span>}
          {shotCount !== undefined && (
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {shotCount} shot{shotCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
