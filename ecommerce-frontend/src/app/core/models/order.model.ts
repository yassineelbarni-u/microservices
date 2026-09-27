export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal?: number;
}

export interface Order {
  id?: number;
  customerId: number;
  status?: OrderStatus;
  totalAmount?: number;
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}
