import type { Shop } from '../types';

interface Props {
  shop: Shop;
  avgFlavor?: number;
  reviewCount?: number;
}

export function ShopCard({ shop, avgFlavor, reviewCount }: Props) {
  return (
    <a href={`#/shop/${shop.id}`} class="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '16px' }}>{shop.name}</div>
          {(shop.city || shop.address) && (
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {shop.address ? `${shop.address}${shop.city ? `, ${shop.city}` : ''}` : shop.city}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          {avgFlavor !== undefined && <span class="score-badge">{avgFlavor.toFixed(1)}</span>}
          {reviewCount !== undefined && (
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {reviewCount} review{reviewCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
