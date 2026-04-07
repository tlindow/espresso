import { getDB } from './index';
import type { Review, Shop } from '../types';

interface ExportData {
  version: 2;
  exportedAt: string;
  reviews: Review[];
  shops: Shop[];
}

export async function exportData(): Promise<string> {
  const db = await getDB();
  const data: ExportData = {
    version: 2,
    exportedAt: new Date().toISOString(),
    reviews: await db.getAll('reviews'),
    shops: await db.getAll('shops'),
  };
  return JSON.stringify(data, null, 2);
}

export async function importData(json: string): Promise<{ reviews: number; shops: number }> {
  const data: ExportData = JSON.parse(json);
  if (data.version !== 2) throw new Error('Unsupported export version');

  const db = await getDB();
  const tx = db.transaction(['reviews', 'shops'], 'readwrite');

  for (const shop of data.shops) {
    await tx.objectStore('shops').put(shop);
  }
  for (const review of data.reviews) {
    await tx.objectStore('reviews').put(review);
  }

  await tx.done;
  return { reviews: data.reviews.length, shops: data.shops.length };
}
