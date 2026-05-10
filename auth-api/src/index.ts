import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';

import { redis } from './routers/shared/redis';
import { tokensRouter } from './routers/token-router';
import { sessionRouter } from './routers/session-router';
import { oAuthRouter } from './routers/oauth-router';
import { validateRegister } from './routers/shared/middleware';
import { database } from './routers/shared/db';

const frontendUrl = Bun.env.FRONTEND_URL || 'http://localhost:5173';

const app = new Hono();

app.use(cors({ origin: [frontendUrl], credentials: true }));

app.post('/signup', validateRegister, async (c) => {
  const userData = c.req.valid('json');

  try {
    const user = await database.registerCredentialsUser(userData);

    // TODO: Log user in maybe?
    return c.json(user);
  } catch (e) {
    console.log(e);

    return c.json({ error: 'Failed to register user!' }, 500);
  }
});

app.route('/token', tokensRouter);

app.route('/session', sessionRouter);

app.route('/oauth', oAuthRouter);

app.get('/health', async (c) => {
  try {
    await redis.send('PING', []);
    return c.json({ status: 'ok' });
  } catch {
    return c.json({ status: 'error' }, 500);
  }
});

console.info(showRoutes(app, { verbose: true }));

export default app;
