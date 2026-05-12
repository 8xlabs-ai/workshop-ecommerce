import { Router } from 'express';
import { webhookBody } from './payments.schemas.js';

export const paymentsRouter: Router = Router();

/**
 * Partner webhook. Signature verification handled in a verify-middleware
 * (not scaffolded — workshop participants add it).
 */
paymentsRouter.post('/webhook', async (req, res, next) => {
  try {
    const parsed = webhookBody.parse(req.body);
    req.log.info({ type: parsed.type, chargeId: parsed.data.id }, 'payx webhook received');
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
