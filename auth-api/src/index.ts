import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';

import { redis } from './routers/shared/redis';
import { tokensRouter } from './routers/token-router';
import { sessionRouter } from './routers/session-router';

const frontendUrl = Bun.env.FRONTEND_URL || 'http://localhost:5173';

const app = new Hono();

app.use(cors({ origin: [frontendUrl], credentials: true }));

app.route('/token', tokensRouter);

app.route('/session', sessionRouter);

app.get('/health', (c) => {
  const tokenStoreStatus = { tokenStore: redis.status };

  if (redis.status !== 'ready') {
    return c.json({ status: 'error', ...tokenStoreStatus }, 500);
  }

  return c.json({ status: 'ok', ...tokenStoreStatus });
});

console.info(showRoutes(app, { verbose: true }));

export default app;
