import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { addItemBody, itemIdParam, updateItemBody } from './cart.schemas.js';
import { cartRepository } from './cart.repository.js';
import { cartService } from './cart.service.js';

export const cartRouter: Router = Router();

cartRouter.use(requireAuth);

cartRouter.get('/', async (req, res, next) => {
  try {
    const cart = await cartService.loadForUser(req.user!.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

cartRouter.post('/items', async (req, res, next) => {
  try {
    const parsed = addItemBody.parse(req.body);
    const cart = await cartRepository.getOrCreateByUserId(req.user!.id);
    await cartRepository.addOrIncrementItem(
      cart.id,
      parsed.productId,
      parsed.quantity,
      parsed.variant ?? null,
    );
    const next = await cartService.loadForUser(req.user!.id);
    res.status(201).json(next);
  } catch (err) {
    next(err);
  }
});

cartRouter.patch('/items/:id', async (req, res, next) => {
  try {
    const { id } = itemIdParam.parse(req.params);
    const { quantity } = updateItemBody.parse(req.body);
    await cartRepository.updateItemQuantity(id, quantity);
    const cart = await cartService.loadForUser(req.user!.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});
