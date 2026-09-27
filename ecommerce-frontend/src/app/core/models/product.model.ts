export type ProductStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category: string;
  status?: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
}
