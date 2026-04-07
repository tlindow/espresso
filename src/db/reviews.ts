import { getDB } from './index';
import type { Review } from '../types';

export async function addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  const db = await getDB();
  const full: Review = {
    ...review,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await db.put('reviews', full);
  return full;
}

export async function getReview(id: string): Promise<Review | undefined> {
  const db = await getDB();
  return db.get('reviews', id);
}

export async function getAllReviews(): Promise<Review[]> {
  const db = await getDB();
  const reviews = await db.getAll('reviews');
  return reviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getReviewsByShop(shopId: string): Promise<Review[]> {
  const db = await getDB();
  const reviews = await db.getAllFromIndex('reviews', 'shopId', shopId);
  return reviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deleteReview(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('reviews', id);
}
