import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { logger } from './lib/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestId } from './middleware/request-id.js';

import { cartRouter } from './modules/cart/cart.router.js';
import { catalogRouter } from './modules/catalog/catalog.router.js';
import { checkoutRouter } from './modules/checkout/checkout.router.js';
import { ordersRouter } from './modules/orders/orders.router.js';
import { paymentsRouter } from './modules/payments/payments.router.js';
import { usersRouter } from './modules/users/users.router.js';

export const createApp = () => {
  const app = express();

  app.use(requestId);
  app.use(
    pinoHttp({
      logger,
      customProps: (req) => ({ request_id: (req as express.Request).id }),
      customLogLevel: (_req, res, err) => {
        if (err) return 'error';
        if (res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
    }),
  );
  app.use(helmet());
  app.use(cors({ origin: true, credentials: false }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.use('/api/auth', usersRouter);
  app.use('/api/catalog', catalogRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/checkout', checkoutRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/payments', paymentsRouter);

  app.use(errorHandler);

  return app;
};
