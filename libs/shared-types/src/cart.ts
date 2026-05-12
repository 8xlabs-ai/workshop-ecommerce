import type { Money } from './money.js';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  variant?: string;
  thumbnailUrl: string;
  unitPrice: Money;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string | null;
  items: CartItem[];
  subtotal: Money;
  estimatedShipping: Money;
  estimatedTax: Money;
  total: Money;
  updatedAt: string;
}
