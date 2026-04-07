import { getDB } from './index';
import type { Shot, Cafe } from '../types';

interface ExportData {
  version: 1;
  exportedAt: string;
  shots: Shot[];
  cafes: Cafe[];
}

export async function exportData(): Promise<string> {
  const db = await getDB();
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    shots: await db.getAll('shots'),
    cafes: await db.getAll('cafes'),
  };
  return JSON.stringify(data, null, 2);
}

export async function importData(json: string): Promise<{ shots: number; cafes: number }> {
  const data: ExportData = JSON.parse(json);
  if (data.version !== 1) throw new Error('Unsupported export version');

  const db = await getDB();
  const tx = db.transaction(['shots', 'cafes'], 'readwrite');

  for (const cafe of data.cafes) {
    await tx.objectStore('cafes').put(cafe);
  }
  for (const shot of data.shots) {
    await tx.objectStore('shots').put(shot);
  }

  await tx.done;
  return { shots: data.shots.length, cafes: data.cafes.length };
}
