import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'espresso';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('shots')) {
          const shots = db.createObjectStore('shots', { keyPath: 'id' });
          shots.createIndex('cafeId', 'cafeId');
          shots.createIndex('createdAt', 'createdAt');
        }
        if (!db.objectStoreNames.contains('cafes')) {
          db.createObjectStore('cafes', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}
