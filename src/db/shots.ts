import { getDB } from './index';
import type { Shot } from '../types';

export async function addShot(shot: Omit<Shot, 'id' | 'createdAt' | 'updatedAt' | 'overallScore'>): Promise<Shot> {
  const db = await getDB();
  const now = new Date().toISOString();
  const full: Shot = {
    ...shot,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    overallScore: (shot.crema + shot.body + shot.acidity + shot.sweetness) / 4,
  };
  await db.put('shots', full);
  return full;
}

export async function getShot(id: string): Promise<Shot | undefined> {
  const db = await getDB();
  return db.get('shots', id);
}

export async function getAllShots(): Promise<Shot[]> {
  const db = await getDB();
  const shots = await db.getAll('shots');
  return shots.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getShotsByCafe(cafeId: string): Promise<Shot[]> {
  const db = await getDB();
  const shots = await db.getAllFromIndex('shots', 'cafeId', cafeId);
  return shots.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateShot(id: string, updates: Partial<Shot>): Promise<Shot | undefined> {
  const db = await getDB();
  const existing = await db.get('shots', id);
  if (!existing) return undefined;
  const updated: Shot = {
    ...existing,
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };
  updated.overallScore = (updated.crema + updated.body + updated.acidity + updated.sweetness) / 4;
  await db.put('shots', updated);
  return updated;
}

export async function deleteShot(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('shots', id);
}
