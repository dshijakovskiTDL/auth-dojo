import { Hono } from 'hono';

import { showRoutes } from 'hono/dev';
import { tokensRouter } from './routers/tokens-router';
import { cors } from 'hono/cors';
import { redis } from './routers/shared/redis';

const frontendUrl = Bun.env.FRONTEND_URL || 'http://localhost:5173';

const app = new Hono();

app.use(cors({ origin: [frontendUrl], credentials: true }));

app.route('/', tokensRouter);

app.get('/health', (c) => {
  const tokenStoreStatus = { tokenStore: redis.status };

  if (redis.status !== 'ready') {
    return c.json({ status: 'error', ...tokenStoreStatus }, 500);
  }

  return c.json({ status: 'ok', ...tokenStoreStatus });
});

console.log(showRoutes(app, { verbose: true }));

export default app;
