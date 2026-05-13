import * as v from 'valibot';
import { vValidator } from '@hono/valibot-validator';
import { createMiddleware } from 'hono/factory';

import { twoFactor } from './2fa';
import { twoFactorStore } from './store';
import { ValidationMiddleware } from '../shared';

const validateCodeVerifier = vValidator(
  'json',
  v.object({ code: v.pipe(v.string(), v.length(6), v.digits()) }),
  (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid request' }, 400);
    }
  },
);

const validateSession = createMiddleware<ValidationMiddleware>(async (c, next) => {
  const sessionId = twoFactor.getSessionCookie(c);

  if (!sessionId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const user = await twoFactorStore.getSession(sessionId);

  if (!user) {
    // Invalid/Expired session ID - force re-login
    twoFactor.deleteSessionCookie(c);

    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', user);
  return next();
});

const validatePreAuth = createMiddleware<{
  Variables: { preAuthToken: string; userId: string };
}>(async (c, next) => {
  const preAuth = await twoFactor.verifyPreAuth(c);

  if (!preAuth) {
    return c.json({ error: 'Invalid pre-auth session' }, 401);
  }

  c.set('preAuthToken', preAuth.preAuthToken);
  c.set('userId', preAuth.userId);

  await next();
});

export const twoFactorMiddleware = {
  validateCodeVerifier,
  validateSession,
  validatePreAuth,
};
