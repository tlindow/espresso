import { useState, useEffect } from 'preact/hooks';
import { getAllShots } from '../db/shots';
import { getAllCafes } from '../db/cafes';
import { ShotCard } from '../components/ShotCard';
import { EmptyState } from '../components/EmptyState';
import type { Shot, Cafe } from '../types';

export function Journal() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllShots(), getAllCafes()]).then(([s, c]) => {
      setShots(s);
      setCafes(c);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (shots.length === 0) {
    return <EmptyState icon={'\u2630'} text="Your espresso journal is empty" action={{ label: 'Log a Shot', href: '#/log' }} />;
  }

  const cafeMap = new Map(cafes.map((c) => [c.id, c]));
  const avgScore = shots.reduce((sum, s) => sum + s.overallScore, 0) / shots.length;

  // Top cafe
  const cafeScores = new Map<string, { total: number; count: number }>();
  for (const shot of shots) {
    const entry = cafeScores.get(shot.cafeId) ?? { total: 0, count: 0 };
    entry.total += shot.overallScore;
    entry.count++;
    cafeScores.set(shot.cafeId, entry);
  }
  let topCafe: Cafe | undefined;
  let topScore = 0;
  for (const [cafeId, { total, count }] of cafeScores) {
    const avg = total / count;
    if (avg > topScore) {
      topScore = avg;
      topCafe = cafeMap.get(cafeId);
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Journal</h2>

      <div class="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{shots.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Total Shots</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-rating)' }}>{avgScore.toFixed(1)}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Avg Score</div>
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>{topCafe?.name ?? '-'}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Top Cafe</div>
          </div>
        </div>
      </div>

      <div class="section-title">All Shots</div>
      {shots.map((s) => (
        <ShotCard key={s.id} shot={s} cafe={cafeMap.get(s.cafeId)} />
      ))}
    </div>
  );
}
