import { useState, useEffect } from 'preact/hooks';
import { getAllCafes } from '../db/cafes';
import { getAllShots } from '../db/shots';
import { CafeCard } from '../components/CafeCard';
import { EmptyState } from '../components/EmptyState';
import type { Cafe, Shot } from '../types';

export function CafeList() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllCafes(), getAllShots()]).then(([c, s]) => {
      setCafes(c);
      setShots(s);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (cafes.length === 0) {
    return <EmptyState icon={'\u2615'} text="No cafes yet" action={{ label: 'Log a Shot', href: '#/log' }} />;
  }

  const cafeScores = new Map<string, { total: number; count: number }>();
  for (const shot of shots) {
    const entry = cafeScores.get(shot.cafeId) ?? { total: 0, count: 0 };
    entry.total += shot.overallScore;
    entry.count++;
    cafeScores.set(shot.cafeId, entry);
  }

  const sorted = cafes
    .map((c) => {
      const s = cafeScores.get(c.id);
      return { cafe: c, avgScore: s ? s.total / s.count : 0, shotCount: s?.count ?? 0 };
    })
    .sort((a, b) => b.avgScore - a.avgScore);

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Cafes</h2>
      {sorted.map(({ cafe, avgScore, shotCount }) => (
        <CafeCard key={cafe.id} cafe={cafe} avgScore={avgScore} shotCount={shotCount} />
      ))}
    </div>
  );
}
