import { Hono } from 'hono';

import { oAuthMiddleware } from './middleware';
import { oAuthStore } from './store';

import { oAuth } from './oauth';
import { googleOAuth } from './oauth/providers/google';
import { githubOAuth } from './oauth/providers/github';
import { env } from '../../env';

const router = new Hono();

router.get('/login', oAuthMiddleware.validateOAuthMethod, async (c) => {
  const { method } = c.req.valid('query');

  try {
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
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Failed to login!' }, 500);
  }

  console.error(`Auth URL not specified!, invalid OAuth method: ${method}`);

  return c.json({ error: 'Failed to login!' }, 500);
});

router.get('/google/callback', oAuthMiddleware.validateCallback, async (c) => {
  const params = c.get('query');

  try {
    const userData = await googleOAuth.loginCallback(c, params);
    await oAuth.handleCallback(c, 'google', userData);

    return c.redirect(`${env.FRONTEND_URL}/oauth`);
  } catch (e) {
    console.error(e);
    return c.redirect(oAuth.callbackErrorUrl('google', (e as Error).message));
  }
});

router.get('/github/callback', oAuthMiddleware.validateCallback, async (c) => {
  const params = c.get('query');

  try {
    const userData = await githubOAuth.loginCallback(c, params);
    await oAuth.handleCallback(c, 'github', userData);

    return c.redirect(`${env.FRONTEND_URL}/oauth`);
  } catch (e) {
    console.error(e);
    return c.redirect(oAuth.callbackErrorUrl('github', (e as Error).message));
  }
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
