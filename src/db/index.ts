import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'espresso';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Clean slate for v2
        for (const name of Array.from(db.objectStoreNames)) {
          db.deleteObjectStore(name);
        }
        const reviews = db.createObjectStore('reviews', { keyPath: 'id' });
        reviews.createIndex('shopId', 'shopId');
        reviews.createIndex('createdAt', 'createdAt');
        db.createObjectStore('shops', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
}
