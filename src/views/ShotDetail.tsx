import { useState, useEffect } from 'preact/hooks';
import { getShot, deleteShot } from '../db/shots';
import { getCafe } from '../db/cafes';
import { navigate } from '../router';
import type { Shot, Cafe } from '../types';

interface Props {
  id: string;
}

export function ShotDetail({ id }: Props) {
  const [shot, setShot] = useState<Shot | null>(null);
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const s = await getShot(id);
      if (s) {
        setShot(s);
        const c = await getCafe(s.cafeId);
        if (c) setCafe(c);
      }
      setLoading(false);
    })();
  }, [id]);

  const handleDelete = async () => {
    if (shot && confirm('Delete this shot?')) {
      await deleteShot(shot.id);
      navigate('/');
    }
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>Loading...</div>;
  if (!shot) return <div style={{ padding: '24px', textAlign: 'center' }}>Shot not found</div>;

  const date = new Date(shot.createdAt).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const ratings = [
    { label: 'Crema', value: shot.crema },
    { label: 'Body', value: shot.body },
    { label: 'Acidity', value: shot.acidity },
    { label: 'Sweetness', value: shot.sweetness },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          {cafe && (
            <a href={`#/cafe/${cafe.id}`} style={{ fontSize: '20px', fontWeight: 700 }}>
              {cafe.name}
            </a>
          )}
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{date}</div>
        </div>
        <span class="score-badge" style={{ fontSize: '24px' }}>{shot.overallScore.toFixed(1)}</span>
      </div>

      <div class="card" style={{ marginBottom: '16px' }}>
        {ratings.map((r) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>{r.label}</span>
            <span style={{ fontWeight: 600 }}>{r.value.toFixed(1)}</span>
          </div>
        ))}
      </div>

      {shot.notes && (
        <div class="card" style={{ marginBottom: '16px' }}>
          <div class="form-label">Tasting Notes</div>
          <p style={{ lineHeight: 1.5 }}>{shot.notes}</p>
        </div>
      )}

      {(shot.beanOrigin || shot.roaster || shot.price) && (
        <div class="card" style={{ marginBottom: '16px' }}>
          {shot.beanOrigin && (
            <div style={{ padding: '4px 0' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Origin: </span>{shot.beanOrigin}
            </div>
          )}
          {shot.roaster && (
            <div style={{ padding: '4px 0' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Roaster: </span>{shot.roaster}
            </div>
          )}
          {shot.price !== undefined && (
            <div style={{ padding: '4px 0' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Price: </span>${shot.price.toFixed(2)}
            </div>
          )}
        </div>
      )}

      <button type="button" class="btn btn-danger btn-block" onClick={handleDelete}>
        Delete Shot
      </button>
    </div>
  );
}
