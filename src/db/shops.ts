import { getDB } from './index';
import type { Shop } from '../types';

export async function addShop(shop: Omit<Shop, 'id' | 'createdAt'>): Promise<Shop> {
  const db = await getDB();
  const full: Shop = {
    ...shop,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await db.put('shops', full);
  return full;
}

export async function getShop(id: string): Promise<Shop | undefined> {
  const db = await getDB();
  return db.get('shops', id);
}

export async function getAllShops(): Promise<Shop[]> {
  const db = await getDB();
  return db.getAll('shops');
}
