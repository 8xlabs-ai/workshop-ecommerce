import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { Cart } from '@shopstream/shared-types';
import { ApiService } from '../core/http/api.service.js';

/**
 * Thin BE wrapper for cart operations.
 * Every BE endpoint here is auth-required — guests handle cart inline via
 * checkout body, not via this service.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly api = inject(ApiService);

  load(): Observable<Cart> {
    return this.api.get<Cart>('/cart');
  }

  addItem(productId: string, quantity: number): Observable<Cart> {
    return this.api.post<Cart>('/cart/items', { productId, quantity });
  }

  updateQuantity(itemId: string, quantity: number): Observable<Cart> {
    return this.api.patch<Cart>(`/cart/items/${itemId}`, { quantity });
  }
}
