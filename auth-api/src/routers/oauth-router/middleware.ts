import { vValidator } from '@hono/valibot-validator';
import { createMiddleware } from 'hono/factory';
import { InferInput, object, picklist, string } from 'valibot';

import { oAuth } from './oauth';
import { oAuthStore } from './store';
import { ValidationMiddleware } from '../shared';

const validateOAuthSession = createMiddleware<ValidationMiddleware>(async (c, next) => {
  const sessionId = oAuth.getSessionCookie(c);

  if (!sessionId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const user = await oAuthStore.getSession(sessionId);

  if (!user) {
    // Invalid/Expired session ID - force re-login
    oAuth.deleteSessionCookie(c);

    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', user);

  return next();
});

const validateOAuthMethod = vValidator(
  'query',
  object({
    method: picklist(['google', 'github']),
  }),
  (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid OAuth method!' }, 401);
    }
  },
);

const googleCallbackSchema = object({ code: string(), state: string() });

const validateGoogleCallback = vValidator('query', googleCallbackSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: 'Invalid callback schema!' }, 400);
  }
});

export const oAuthMiddleware = {
  validateOAuthSession,
  validateOAuthMethod,

  validateGoogleCallback,
};

export type GoogleCallbackSchema = InferInput<typeof googleCallbackSchema>;
