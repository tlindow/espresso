import type { Review, Shop } from '../types';

interface Props {
  review: Review;
  shop?: Shop;
}

export function ReviewCard({ review, shop }: Props) {
  const date = new Date(review.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const stars = '\u2605'.repeat(review.flavor) + '\u2606'.repeat(5 - review.flavor);

  return (
    <a href={`#/review/${review.id}`} class="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {shop && <div style={{ fontWeight: 600, fontSize: '15px' }}>{shop.name}</div>}
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{date}</div>
        </div>
        <span class="score-badge">{stars}</span>
      </div>
      {review.notes && (
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
          {review.notes.length > 100 ? review.notes.slice(0, 100) + '...' : review.notes}
        </p>
      )}
    </a>
  );
}
