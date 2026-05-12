import { Router } from 'express';
import { ForbiddenError, NotFoundError } from '../../lib/errors.js';
import { optionalAuth, requireAuth } from '../../middleware/auth.js';
import { ordersRepository } from './orders.repository.js';
import { guestLookupQuery, orderIdParam } from './orders.schemas.js';

export const ordersRouter: Router = Router();

/** Owner-scoped order list. Requires a valid JWT. */
ordersRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const orders = await ordersRepository.listByUser(req.user!.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

/**
 * Owner-scoped order read (logged-in flow). For guest orders, callers must
 * pass ?email=... to authenticate ownership of the order.
 */
ordersRouter.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = orderIdParam.parse(req.params);

    // Path 1 — authenticated owner.
    if (req.user) {
      const owned = await ordersRepository.findByIdAndUser(id, req.user.id);
      if (owned) {
        res.json(owned);
        return;
      }
    }

    // Path 2 — guest lookup via email match.
    const emailParse = guestLookupQuery.safeParse(req.query);
    if (!emailParse.success) {
      throw new ForbiddenError('Order not visible to this caller');
    }
    const guest = await ordersRepository.findByIdAndEmail(id, emailParse.data.email);
    if (!guest) throw new NotFoundError('Order not found');
    res.json(guest);
  } catch (err) {
    next(err);
  }
});
