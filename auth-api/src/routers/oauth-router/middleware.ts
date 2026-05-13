import * as v from 'valibot';
import { vValidator } from '@hono/valibot-validator';
import { createMiddleware } from 'hono/factory';

import { oAuth } from './oauth';
import { oAuthStore } from './store';
import { ValidationMiddleware } from '../shared';
import { OAuthProvider } from '../../db/schema';

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
  v.object({
    method: v.picklist(['google', 'github']),
  }),
  (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid OAuth method!' }, 400);
    }
  },
);

const callbackSuccessSchema = v.object({ code: v.string(), state: v.string() });
const callbackErrorSchema = v.object({
  error: v.string(),
  error_description: v.optional(v.string()),
});

const callbackSchema = v.union([callbackSuccessSchema, callbackErrorSchema]);

export type OAuthCallbackSuccess = v.InferInput<typeof callbackSuccessSchema>;

const validateCallback = createMiddleware<{ Variables: { query: OAuthCallbackSuccess } }>(
  async (c, next) => {
    const result = v.safeParse(callbackSchema, c.req.query());
    const provider = c.req.path.split('/')[2] as OAuthProvider;

    if (!result.success) {
      return c.redirect(
        oAuth.callbackErrorUrl(provider, 'Invalid OAuth callback schema'),
      );
    }

    if ('error' in result.output) {
      console.error(result.output);

      return c.redirect(oAuth.callbackErrorUrl(provider, result.output.error));
    }

    c.set('query', result.output);

    await next();
  },
);

export const oAuthMiddleware = {
  validateOAuthSession,
  validateOAuthMethod,

  validateCallback,
};
