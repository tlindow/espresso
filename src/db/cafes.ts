import { getDB } from './index';
import type { Cafe } from '../types';

export async function addCafe(cafe: Omit<Cafe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cafe> {
  const db = await getDB();
  const now = new Date().toISOString();
  const full: Cafe = {
    ...cafe,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await db.put('cafes', full);
  return full;
}

export async function getCafe(id: string): Promise<Cafe | undefined> {
  const db = await getDB();
  return db.get('cafes', id);
}

export async function getAllCafes(): Promise<Cafe[]> {
  const db = await getDB();
  return db.getAll('cafes');
}

export async function updateCafe(id: string, updates: Partial<Cafe>): Promise<Cafe | undefined> {
  const db = await getDB();
  const existing = await db.get('cafes', id);
  if (!existing) return undefined;
  const updated: Cafe = {
    ...existing,
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };
  await db.put('cafes', updated);
  return updated;
}

export async function deleteCafe(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('cafes', id);
}
