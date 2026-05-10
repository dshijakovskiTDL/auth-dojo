import { Hono } from 'hono';

import { oAuthMiddleware } from './middleware';
import { googleOAuth } from './oauth/google';
import { oAuthStore } from './store';
import { oAuth } from './oauth';
import { database } from '../shared/db';

const frontendUrl = Bun.env.FRONTEND_URL || 'http://localhost:5173';

const router = new Hono();

router.get('/login', oAuthMiddleware.validateOAuthMethod, async (c) => {
  const { method } = c.req.valid('query');

  if (method === 'google') {
    const redirectUrl = await googleOAuth.login(c);
    return c.redirect(redirectUrl);
  }

  return c.json({ error: 'Not yet supported' }, 501);
});

router.get('/google/callback', oAuthMiddleware.validateGoogleCallback, async (c) => {
  const params = c.req.valid('query');

  const userData = await googleOAuth.loginCallback(c, params);

  // Add user to mock DB if not already there
  const user = await database.registerOAuthUser('google', userData);

  // Create session
  const sessionId = oAuth.createSession(c);

  // Add session to Redis store
  await oAuthStore.addSession(sessionId, user.providerId!);

  return c.redirect(`${frontendUrl}/oauth`);
});

router.post('/logout', async (c) => {
  const sessionId = oAuth.getSessionCookie(c);

  if (sessionId) {
    oAuth.deleteSessionCookie(c);
    await oAuthStore.removeSession(sessionId);
  }

  return c.json({ ok: true });
});

router.get('/me', oAuthMiddleware.validateOAuthSession, async (c) => {
  return c.json(c.get('user'));
});

router.get('/dashboard', oAuthMiddleware.validateOAuthSession, async (c) => {
  const user = c.get('user');

  return c.json({ data: 'OAuth Dummy data', user });
});

export { router as oAuthRouter };
