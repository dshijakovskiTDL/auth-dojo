import { Hono } from 'hono';

import { oAuthMiddleware } from './middleware';
import { oAuthStore } from './store';
import { database } from '../shared/db';

import { oAuth } from './oauth';
import { googleOAuth } from './oauth/providers/google';
import { githubOAuth } from './oauth/providers/github';

const frontendUrl = Bun.env.FRONTEND_URL || 'http://localhost:5173';

const router = new Hono();

router.get('/login', oAuthMiddleware.validateOAuthMethod, async (c) => {
  const { method } = c.req.valid('query');

  let authUrl: string | null = null;

  if (method === 'google') {
    authUrl = await googleOAuth.login(c);
  }

  if (method === 'github') {
    authUrl = await githubOAuth.login(c);
  }

  // TODO: Facebook, Twitter, Linkedin OAuth

  if (authUrl) {
    return c.redirect(authUrl);
  }

  throw new Error('Auth URL not specified!');
});

router.get('/google/callback', oAuthMiddleware.validateCallback, async (c) => {
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

router.get('/github/callback', oAuthMiddleware.validateCallback, async (c) => {
  const params = c.req.valid('query');

  const userData = await githubOAuth.loginCallback(c, params);

  // Add user to mock DB if not already there
  const user = await database.registerOAuthUser('github', userData);

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
