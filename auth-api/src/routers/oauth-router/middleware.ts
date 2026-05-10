import { vValidator } from '@hono/valibot-validator';
import { createMiddleware } from 'hono/factory';
import { InferInput, object, picklist, string } from 'valibot';
import { oAuth } from './oauth';
import { oAuthStore } from './store';

type ValidateSessionMiddleware = { Variables: { user: { id: string } } };

export const validateOAuthSession = createMiddleware<ValidateSessionMiddleware>(
  async (c, next) => {
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

    c.set('user', user as { id: string });

    return next();
  },
);

export const validateOAuthMethod = vValidator(
  'query',
  object({
    method: picklist(['google', 'github']),
  }),
);

const GoogleCallbackSchema = object({
  code: string(),
  state: string(),
});
export const validateGoogleCallback = vValidator('query', GoogleCallbackSchema);

export type GoogleCallbackSchema = InferInput<typeof GoogleCallbackSchema>;
