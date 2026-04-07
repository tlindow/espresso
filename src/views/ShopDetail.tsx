import { useState, useEffect } from 'preact/hooks';
import { getShop } from '../db/shops';
import { getReviewsByShop } from '../db/reviews';
import { ReviewCard } from '../components/ReviewCard';
import type { Shop, Review } from '../types';

interface Props {
  id: string;
}

export function ShopDetail({ id }: Props) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, r] = await Promise.all([getShop(id), getReviewsByShop(id)]);
      if (s) setShop(s);
      setReviews(r);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return null;
  if (!shop) return <div style={{ padding: '24px', textAlign: 'center' }}>Shop not found</div>;

  const avgFlavor = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.flavor, 0) / reviews.length
    : 0;

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{shop.name}</h2>
      {(shop.city || shop.address) && (
        <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          {shop.address ? `${shop.address}${shop.city ? `, ${shop.city}` : ''}` : shop.city}
        </div>
      )}

      {reviews.length > 0 && (
        <div class="card" style={{ marginTop: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-rating)' }}>{avgFlavor.toFixed(1)}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Avg Flavor</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{reviews.length}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Reviews</div>
            </div>
          </div>
        </div>
      )}

      <div class="section-title">Reviews</div>
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} shop={shop} />
      ))}
      {reviews.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '24px' }}>
          No reviews for this shop yet
        </div>
      )}
    </div>
  );
}
