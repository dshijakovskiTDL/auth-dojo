import { Hono } from 'hono';
import {
  validateGoogleCallback,
  validateOAuthMethod,
  validateOAuthSession,
} from './middleware';
import { googleOAuth } from './oauth/google';
import { oAuthStore } from './store';
import { oAuth } from './oauth';

const frontendUrl = Bun.env.FRONTEND_URL || 'http://localhost:5173';

const router = new Hono();

router.get('/login', validateOAuthMethod, async (c) => {
  const { method } = c.req.valid('query');

  if (method === 'google') {
    const redirectUrl = await googleOAuth.login(c);
    return c.redirect(redirectUrl);
  }

  return c.json({ error: 'Not yet supported' }, 501);
});

router.get('/google/callback', validateGoogleCallback, async (c) => {
  const params = c.req.valid('query');

  const userData = await googleOAuth.loginCallback(c, params);

  // Add user to mock DB if not already there
  await oAuthStore.addUser(userData);

  // Create session
  const sessionId = oAuth.createSession(c);

  // Add session to Redis store
  await oAuthStore.addSession(sessionId, userData.id);

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

router.get('/me', validateOAuthSession, async (c) => {
  return c.json(c.get('user'));
});

router.get('/dashboard', validateOAuthSession, async (c) => {
  const user = c.get('user');

  return c.json({ data: 'OAuth Dummy data', user });
});

export { router as oAuthRouter };
