import { useState, useEffect } from 'preact/hooks';
import { getCafe } from '../db/cafes';
import { getShotsByCafe } from '../db/shots';
import { ShotCard } from '../components/ShotCard';
import type { Cafe, Shot } from '../types';

interface Props {
  id: string;
}

export function CafeDetail({ id }: Props) {
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [shots, setShots] = useState<Shot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [c, s] = await Promise.all([getCafe(id), getShotsByCafe(id)]);
      if (c) setCafe(c);
      setShots(s);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return null;
  if (!cafe) return <div style={{ padding: '24px', textAlign: 'center' }}>Cafe not found</div>;

  const avgScore = shots.length > 0
    ? shots.reduce((sum, s) => sum + s.overallScore, 0) / shots.length
    : 0;

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{cafe.name}</h2>
      {(cafe.city || cafe.address) && (
        <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          {cafe.address ? `${cafe.address}${cafe.city ? `, ${cafe.city}` : ''}` : cafe.city}
        </div>
      )}

      {shots.length > 0 && (
        <div class="card" style={{ marginTop: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-rating)' }}>{avgScore.toFixed(1)}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Avg Score</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{shots.length}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Shots</div>
            </div>
          </div>
        </div>
      )}

      <div class="section-title">Shots</div>
      {shots.map((s) => (
        <ShotCard key={s.id} shot={s} cafe={cafe} />
      ))}
      {shots.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '24px' }}>
          No shots logged at this cafe yet
        </div>
      )}
    </div>
  );
}
