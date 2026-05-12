import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { checkoutRateLimit } from '../../middleware/rate-limit.js';
import { checkoutBody, guestCheckoutBody } from './checkout.schemas.js';
import { checkoutService } from './checkout.service.js';

export const checkoutRouter: Router = Router();

/** Existing logged-in checkout. Do not change without a reviewer's nod. */
checkoutRouter.post('/', requireAuth, checkoutRateLimit, async (req, res, next) => {
  try {
    const parsed = checkoutBody.parse(req.body);
    const order = await checkoutService.placeOrder(req.user!.id, parsed);
    res.status(201).json({ orderId: order.id });
  } catch (err) {
    next(err);
  }
});

/** NEW — guest checkout. Gated by `guest_checkout_enabled`. No JWT required. */
checkoutRouter.post('/guest', checkoutRateLimit, async (req, res, next) => {
  try {
    const parsed = guestCheckoutBody.parse(req.body);
    const order = await checkoutService.placeGuestOrder(parsed, { ip: req.ip });
    res.status(201).json({ orderId: order.id, guestEmail: parsed.contact.email });
  } catch (err) {
    next(err);
  }
});
