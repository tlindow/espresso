import { useState, useEffect } from 'preact/hooks';
import { getAllReviews } from '../db/reviews';
import { getAllShops } from '../db/shops';
import { ReviewCard } from '../components/ReviewCard';
import { ShopCard } from '../components/ShopCard';
import { EmptyState } from '../components/EmptyState';
import type { Review, Shop } from '../types';

export function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllReviews(), getAllShops()]).then(([r, s]) => {
      setReviews(r);
      setShops(s);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={'\u2615'}
        text="No reviews yet. Rate your first coffee shop!"
        action={{ label: 'Add Review', href: '#/add' }}
      />
    );
  }

  const shopMap = new Map(shops.map((s) => [s.id, s]));
  const recent = reviews.slice(0, 5);

  // Top shops by avg flavor
  const shopScores = new Map<string, { total: number; count: number }>();
  for (const r of reviews) {
    const entry = shopScores.get(r.shopId) ?? { total: 0, count: 0 };
    entry.total += r.flavor;
    entry.count++;
    shopScores.set(r.shopId, entry);
  }
  const topShops = shops
    .map((s) => {
      const sc = shopScores.get(s.id);
      return { shop: s, avgFlavor: sc ? sc.total / sc.count : 0, reviewCount: sc?.count ?? 0 };
    })
    .filter((s) => s.reviewCount > 0)
    .sort((a, b) => b.avgFlavor - a.avgFlavor)
    .slice(0, 3);

  return (
    <div>
      <div class="section-title">Recent Reviews</div>
      {recent.map((r) => (
        <ReviewCard key={r.id} review={r} shop={shopMap.get(r.shopId)} />
      ))}

      {topShops.length > 0 && (
        <>
          <div class="section-title" style={{ marginTop: '24px' }}>Top Shops</div>
          {topShops.map(({ shop, avgFlavor, reviewCount }) => (
            <ShopCard key={shop.id} shop={shop} avgFlavor={avgFlavor} reviewCount={reviewCount} />
          ))}
        </>
      )}

      <a href="#/add" class="fab" aria-label="Add review">+</a>
    </div>
  );
}
