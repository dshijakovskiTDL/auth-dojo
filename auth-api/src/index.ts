import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';

import { redis } from './routers/shared/redis';
import { tokensRouter } from './routers/token-router';
import { sessionRouter } from './routers/session-router';
import { oAuthRouter } from './routers/oauth-router';
import { middleware } from './routers/shared/middleware';
import { database } from './routers/shared/db';
import { tokens } from './routers/token-router/tokens';
import { sessions } from './routers/session-router/sessions';
import { twoFactorRouter } from './routers/2fa-router';
import { env } from './env';

const app = new Hono();

app.use(cors({ origin: [env.FRONTEND_URL], credentials: true }));

app.get('/', (c) => {
  return c.json({ message: 'Hello from the Auth Dojo API!' });
});

app.post(
  '/signup',
  middleware.validateRegisterAuthMode,
  middleware.validateRegister,
  async (c) => {
    const userData = c.req.valid('json');

    try {
      const user = await database.registerCredentialsUser(userData);

      const { authMode } = c.req.valid('query');

      if (authMode === 'token') {
        await tokens.loginUser(c, user);
      } else if (authMode === 'session') {
        await sessions.loginUser(c, user);
      } else if (authMode === '2fa') {
        // No login - need to go through 2FA steps
      }

      return c.json(user);
    } catch (e) {
      console.error(e);

      return c.json({ error: 'Failed to register user!' }, 500);
    }
  },
);

app.route('/token', tokensRouter);

app.route('/session', sessionRouter);

app.route('/oauth', oAuthRouter);

app.route('/2fa', twoFactorRouter);

app.get('/health', async (c) => {
  try {
    await redis.send('PING', []);
    return c.json({ status: 'ok' });
  } catch {
    return c.json({ status: 'error' }, 500);
  }
});

if (env.BUN_ENV === 'development') {
  console.info(showRoutes(app, { verbose: true }));
}

export default {
  port: env.PORT,
  fetch: app.fetch,
};
