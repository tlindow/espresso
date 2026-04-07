export interface Review {
  id: string;
  shopId: string;
  createdAt: string;
  flavor: number;       // 1-5
  notes?: string;
}

export interface Shop {
  id: string;
  name: string;
  address?: string;
  city?: string;
  createdAt: string;
}
