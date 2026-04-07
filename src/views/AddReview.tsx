import { useState, useEffect } from 'preact/hooks';
import { FlavorRating } from '../components/FlavorRating';
import { getAllShops, addShop } from '../db/shops';
import { addReview } from '../db/reviews';
import { navigate } from '../router';
import type { Shop } from '../types';

export function AddReview() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [shopId, setShopId] = useState('');
  const [newShopName, setNewShopName] = useState('');
  const [newShopCity, setNewShopCity] = useState('');
  const [showNewShop, setShowNewShop] = useState(false);
  const [flavor, setFlavor] = useState(3);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllShops().then(setShops);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      let selectedShopId = shopId;

      if (showNewShop && newShopName.trim()) {
        const shop = await addShop({ name: newShopName.trim(), city: newShopCity.trim() || undefined });
        selectedShopId = shop.id;
      }

      if (!selectedShopId) {
        setSaving(false);
        return;
      }

      await addReview({
        shopId: selectedShopId,
        flavor,
        notes: notes.trim() || undefined,
      });

      navigate('/');
    } catch (e) {
      console.error('Failed to save review:', e);
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Add Review</h2>

      <div class="form-group">
        <label class="form-label">Coffee Shop</label>
        {!showNewShop ? (
          <>
            <select
              value={shopId}
              onChange={(e) => setShopId((e.target as HTMLSelectElement).value)}
            >
              <option value="">Select a shop...</option>
              {shops.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              type="button"
              class="btn btn-secondary"
              style={{ marginTop: '8px', fontSize: '13px', padding: '8px 16px' }}
              onClick={() => setShowNewShop(true)}
            >
              + New Shop
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Shop name"
              value={newShopName}
              onInput={(e) => setNewShopName((e.target as HTMLInputElement).value)}
            />
            <input
              type="text"
              placeholder="City (optional)"
              value={newShopCity}
              onInput={(e) => setNewShopCity((e.target as HTMLInputElement).value)}
              style={{ marginTop: '8px' }}
            />
            {shops.length > 0 && (
              <button
                type="button"
                class="btn btn-secondary"
                style={{ marginTop: '8px', fontSize: '13px', padding: '8px 16px' }}
                onClick={() => setShowNewShop(false)}
              >
                Choose existing
              </button>
            )}
          </>
        )}
      </div>

      <div class="form-group">
        <label class="form-label">Flavor</label>
        <FlavorRating value={flavor} onChange={setFlavor} />
      </div>

      <div class="form-group">
        <label class="form-label">Notes (optional)</label>
        <textarea
          value={notes}
          onInput={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
          placeholder="What did you think?"
          rows={3}
        />
      </div>

      <button
        type="button"
        class="btn btn-primary btn-block"
        onClick={handleSave}
        disabled={saving || (!shopId && !(showNewShop && newShopName.trim()))}
      >
        {saving ? 'Saving...' : 'Save Review'}
      </button>
    </div>
  );
}
