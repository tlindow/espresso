import { useState, useEffect } from 'preact/hooks';
import { getAllShots } from '../db/shots';
import { getAllCafes } from '../db/cafes';
import { ShotCard } from '../components/ShotCard';
import { CafeCard } from '../components/CafeCard';
import { EmptyState } from '../components/EmptyState';
import type { Shot, Cafe } from '../types';

export function Home() {
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
    return (
      <>
        <EmptyState
          icon={'\u2615'}
          text="No espresso shots logged yet. Start your journey!"
          action={{ label: 'Log Your First Shot', href: '#/log' }}
        />
      </>
    );
  }

  const cafeMap = new Map(cafes.map((c) => [c.id, c]));
  const recentShots = shots.slice(0, 5);

  // Top cafes by average score
  const cafeScores = new Map<string, { total: number; count: number }>();
  for (const shot of shots) {
    const entry = cafeScores.get(shot.cafeId) ?? { total: 0, count: 0 };
    entry.total += shot.overallScore;
    entry.count++;
    cafeScores.set(shot.cafeId, entry);
  }
  const topCafes = cafes
    .map((c) => {
      const s = cafeScores.get(c.id);
      return { cafe: c, avgScore: s ? s.total / s.count : 0, shotCount: s?.count ?? 0 };
    })
    .filter((c) => c.shotCount > 0)
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 3);

  return (
    <div>
      <div class="section-title">Recent Shots</div>
      {recentShots.map((s) => (
        <ShotCard key={s.id} shot={s} cafe={cafeMap.get(s.cafeId)} />
      ))}

      {topCafes.length > 0 && (
        <>
          <div class="section-title" style={{ marginTop: '24px' }}>Top Cafes</div>
          {topCafes.map(({ cafe, avgScore, shotCount }) => (
            <CafeCard key={cafe.id} cafe={cafe} avgScore={avgScore} shotCount={shotCount} />
          ))}
        </>
      )}

      <a href="#/log" class="fab" aria-label="Log new shot">+</a>
    </div>
  );
}
