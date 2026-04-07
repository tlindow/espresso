import { useState, useEffect } from 'preact/hooks';
import { RatingSlider } from '../components/RatingSlider';
import { VoiceNotes } from '../components/VoiceNotes';
import { getAllCafes, addCafe } from '../db/cafes';
import { addShot } from '../db/shots';
import { navigate } from '../router';
import type { Cafe } from '../types';

export function LogShot() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [cafeId, setCafeId] = useState('');
  const [newCafeName, setNewCafeName] = useState('');
  const [newCafeCity, setNewCafeCity] = useState('');
  const [showNewCafe, setShowNewCafe] = useState(false);
  const [crema, setCrema] = useState(3);
  const [body, setBody] = useState(3);
  const [acidity, setAcidity] = useState(3);
  const [sweetness, setSweetness] = useState(3);
  const [notes, setNotes] = useState('');
  const [beanOrigin, setBeanOrigin] = useState('');
  const [roaster, setRoaster] = useState('');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllCafes().then(setCafes);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      let selectedCafeId = cafeId;

      if (showNewCafe && newCafeName.trim()) {
        const cafe = await addCafe({ name: newCafeName.trim(), city: newCafeCity.trim() || undefined });
        selectedCafeId = cafe.id;
      }

      if (!selectedCafeId) {
        setSaving(false);
        return;
      }

      await addShot({
        cafeId: selectedCafeId,
        crema,
        body,
        acidity,
        sweetness,
        notes: notes.trim() || undefined,
        beanOrigin: beanOrigin.trim() || undefined,
        roaster: roaster.trim() || undefined,
        price: price ? parseFloat(price) : undefined,
      });

      navigate('/');
    } catch (e) {
      console.error('Failed to save shot:', e);
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Log Espresso</h2>

      {/* Cafe selection */}
      <div class="form-group">
        <label class="form-label">Cafe</label>
        {!showNewCafe ? (
          <>
            <select
              value={cafeId}
              onChange={(e) => setCafeId((e.target as HTMLSelectElement).value)}
            >
              <option value="">Select a cafe...</option>
              {cafes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button
              type="button"
              class="btn btn-secondary"
              style={{ marginTop: '8px', fontSize: '13px', padding: '8px 16px' }}
              onClick={() => setShowNewCafe(true)}
            >
              + New Cafe
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Cafe name"
              value={newCafeName}
              onInput={(e) => setNewCafeName((e.target as HTMLInputElement).value)}
            />
            <input
              type="text"
              placeholder="City (optional)"
              value={newCafeCity}
              onInput={(e) => setNewCafeCity((e.target as HTMLInputElement).value)}
              style={{ marginTop: '8px' }}
            />
            {cafes.length > 0 && (
              <button
                type="button"
                class="btn btn-secondary"
                style={{ marginTop: '8px', fontSize: '13px', padding: '8px 16px' }}
                onClick={() => setShowNewCafe(false)}
              >
                Choose existing
              </button>
            )}
          </>
        )}
      </div>

      {/* Ratings */}
      <div class="form-group">
        <RatingSlider label="Crema" value={crema} onChange={setCrema} />
      </div>
      <div class="form-group">
        <RatingSlider label="Body" value={body} onChange={setBody} />
      </div>
      <div class="form-group">
        <RatingSlider label="Acidity" value={acidity} onChange={setAcidity} />
      </div>
      <div class="form-group">
        <RatingSlider label="Sweetness" value={sweetness} onChange={setSweetness} />
      </div>

      {/* Tasting notes with voice */}
      <div class="form-group">
        <label class="form-label">Tasting Notes</label>
        <VoiceNotes value={notes} onChange={setNotes} placeholder="Tap the mic to dictate, or type your notes..." />
      </div>

      {/* Optional fields */}
      <div class="form-group">
        <label class="form-label">Bean Origin</label>
        <input
          type="text"
          placeholder="e.g. Ethiopia Yirgacheffe"
          value={beanOrigin}
          onInput={(e) => setBeanOrigin((e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="form-group">
        <label class="form-label">Roaster</label>
        <input
          type="text"
          placeholder="e.g. Counter Culture"
          value={roaster}
          onInput={(e) => setRoaster((e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="form-group">
        <label class="form-label">Price</label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="e.g. 4.50"
          value={price}
          onInput={(e) => setPrice((e.target as HTMLInputElement).value)}
        />
      </div>

      <button
        type="button"
        class="btn btn-primary btn-block"
        onClick={handleSave}
        disabled={saving || (!cafeId && !(showNewCafe && newCafeName.trim()))}
      >
        {saving ? 'Saving...' : 'Save Shot'}
      </button>
    </div>
  );
}
