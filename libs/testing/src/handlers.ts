import { HttpResponse, http } from 'msw';
import { aCart, anOrder, aUser } from './fixtures.js';

/**
 * MSW handlers for component / Karma tests in apps/web.
 * Boot `setupWorker(...handlers)` in a karma helper or a vitest setup file.
 */
export const handlers = [
  http.post('/api/auth/login', () =>
    HttpResponse.json({ token: 'jwt-test-token', user: aUser() }),
  ),

  http.get('/api/cart', () => HttpResponse.json(aCart())),

  http.post('/api/checkout', () =>
    HttpResponse.json({ orderId: anOrder().id }, { status: 201 }),
  ),

  http.post('/api/checkout/guest', () =>
    HttpResponse.json(
      { orderId: anOrder({ userId: null }).id, guestEmail: 'amelia@example.com' },
      { status: 201 },
    ),
  ),

  http.get('/api/orders/:id', ({ params }) =>
    HttpResponse.json(anOrder({ id: params.id as string })),
  ),
];
