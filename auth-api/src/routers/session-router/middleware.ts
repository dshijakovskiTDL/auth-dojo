import { createMiddleware } from 'hono/factory';
import { LoginUser } from '../shared/credentials';
import { sessions } from './sessions';
import { store } from './store';

type ValidateSessionMiddleware = { Variables: { user: LoginUser } };

export const validateSession = createMiddleware<ValidateSessionMiddleware>(
  async (c, next) => {
    const sessionId = sessions.getSessionCookie(c);

    if (!sessionId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await store.getSession(sessionId);

    if (!user) {
      // Invalid/Expired session ID - force re-login
      sessions.deleteSessionCookie(c);

      return c.json({ error: 'Unauthorized' }, 401);
    }

    c.set('user', user);
    return next();
  },
);
