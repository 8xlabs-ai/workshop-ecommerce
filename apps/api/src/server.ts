import { loadEnv } from './config/env.js';
import { logger } from './lib/logger.js';
import { createApp } from './app.js';

const env = loadEnv();
const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'shopstream-api listening');
});

const shutdown = (signal: string) => {
  logger.info({ signal }, 'shutdown received');
  server.close(() => {
    logger.info('http server closed');
    process.exit(0);
  });
  setTimeout(() => {
    logger.error('forced exit — server did not close in time');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
