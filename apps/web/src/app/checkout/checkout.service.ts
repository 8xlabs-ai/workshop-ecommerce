import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { Address, Cart, ShippingMethodId } from '@shopstream/shared-types';
import { ApiService } from '../core/http/api.service.js';
import type { GuestContact } from './checkout.store.js';

interface PlaceOrderResult {
  orderId: string;
}

interface PlaceGuestOrderResult {
  orderId: string;
  guestEmail: string;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly api = inject(ApiService);

  loadCart(): Observable<Cart> {
    return this.api.get<Cart>('/cart');
  }

  placeLoggedInOrder(input: {
    cart: Cart;
    shippingAddress: Address;
    shippingMethod: ShippingMethodId;
    paymentToken: string;
  }): Observable<PlaceOrderResult> {
    return this.api.post<PlaceOrderResult>('/checkout', {
      cartId: input.cart.id,
      shippingAddress: input.shippingAddress,
      shippingMethod: input.shippingMethod,
      paymentToken: input.paymentToken,
    });
  }

  placeGuestOrder(input: {
    contact: GuestContact;
    cart: Cart;
    shippingAddress: Address;
    shippingMethod: ShippingMethodId;
    paymentToken: string;
  }): Observable<PlaceGuestOrderResult> {
    return this.api.post<PlaceGuestOrderResult>(
      '/checkout/guest',
      {
        contact: input.contact,
        cart: { items: input.cart.items.map((it) => ({ productId: it.productId, quantity: it.quantity, variant: it.variant })) },
        shippingAddress: input.shippingAddress,
        shippingMethod: input.shippingMethod,
        paymentToken: input.paymentToken,
      },
      { skipAuth: true },
    );
  }
}
