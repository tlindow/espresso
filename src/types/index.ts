export interface Shot {
  id: string;
  cafeId: string;
  createdAt: string;
  updatedAt: string;
  crema: number;
  body: number;
  acidity: number;
  sweetness: number;
  overallScore: number;
  beanOrigin?: string;
  roaster?: string;
  notes?: string;
  price?: number;
}

export interface Cafe {
  id: string;
  name: string;
  address?: string;
  city?: string;
  lat?: number;
  lng?: number;
  createdAt: string;
  updatedAt: string;
}
