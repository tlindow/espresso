import { useState, useEffect } from 'preact/hooks';
import { getAllShops } from '../db/shops';
import { getAllReviews } from '../db/reviews';
import { ShopCard } from '../components/ShopCard';
import { EmptyState } from '../components/EmptyState';
import type { Shop, Review } from '../types';

export function ShopList() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllShops(), getAllReviews()]).then(([s, r]) => {
      setShops(s);
      setReviews(r);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (shops.length === 0) {
    return <EmptyState icon={'\u2615'} text="No shops yet" action={{ label: 'Add Review', href: '#/add' }} />;
  }

  const shopScores = new Map<string, { total: number; count: number }>();
  for (const r of reviews) {
    const entry = shopScores.get(r.shopId) ?? { total: 0, count: 0 };
    entry.total += r.flavor;
    entry.count++;
    shopScores.set(r.shopId, entry);
  }

  const sorted = shops
    .map((s) => {
      const sc = shopScores.get(s.id);
      return { shop: s, avgFlavor: sc ? sc.total / sc.count : 0, reviewCount: sc?.count ?? 0 };
    })
    .sort((a, b) => b.avgFlavor - a.avgFlavor);

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Coffee Shops</h2>
      {sorted.map(({ shop, avgFlavor, reviewCount }) => (
        <ShopCard key={shop.id} shop={shop} avgFlavor={avgFlavor} reviewCount={reviewCount} />
      ))}
    </div>
  );
}
