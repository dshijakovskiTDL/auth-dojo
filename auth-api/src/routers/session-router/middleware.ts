import { createMiddleware } from 'hono/factory';

import { sessions } from './sessions';
import { sessionStore } from './store';
import { ValidationMiddleware } from '../shared';

const validateSession = createMiddleware<ValidationMiddleware>(async (c, next) => {
  const sessionId = sessions.getSessionCookie(c);

  if (!sessionId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const user = await sessionStore.getSession(sessionId);

  if (!user) {
    // Invalid/Expired session ID - force re-login
    sessions.deleteSessionCookie(c);

    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', user);
  return next();
});

export const sessionMiddleware = {
  validateSession,
};
