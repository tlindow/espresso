import { useState, useEffect } from 'preact/hooks';
import { getReview, deleteReview } from '../db/reviews';
import { getShop } from '../db/shops';
import { navigate } from '../router';
import type { Review, Shop } from '../types';

interface Props {
  id: string;
}

export function ReviewDetail({ id }: Props) {
  const [review, setReview] = useState<Review | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await getReview(id);
      if (r) {
        setReview(r);
        const s = await getShop(r.shopId);
        if (s) setShop(s);
      }
      setLoading(false);
    })();
  }, [id]);

  const handleDelete = async () => {
    if (review && confirm('Delete this review?')) {
      await deleteReview(review.id);
      navigate('/');
    }
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>Loading...</div>;
  if (!review) return <div style={{ padding: '24px', textAlign: 'center' }}>Review not found</div>;

  const date = new Date(review.createdAt).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const stars = '\u2605'.repeat(review.flavor) + '\u2606'.repeat(5 - review.flavor);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        {shop && (
          <a href={`#/shop/${shop.id}`} style={{ fontSize: '20px', fontWeight: 700 }}>
            {shop.name}
          </a>
        )}
        <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{date}</div>
      </div>

      <div class="card" style={{ marginBottom: '16px' }}>
        <div class="form-label">Flavor</div>
        <div style={{ fontSize: '24px' }}>{stars}</div>
      </div>

      {review.notes && (
        <div class="card" style={{ marginBottom: '16px' }}>
          <div class="form-label">Notes</div>
          <p style={{ lineHeight: 1.5 }}>{review.notes}</p>
        </div>
      )}

      <button type="button" class="btn btn-danger btn-block" onClick={handleDelete}>
        Delete Review
      </button>
    </div>
  );
}
