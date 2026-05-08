import { Hono } from 'hono';

import { validateCredentials } from '../shared/middleware';

import { validateTokens } from './middleware';
import { tokens } from './tokens';
import { store } from './store';

const router = new Hono();

router.post('/login', validateCredentials, async (c) => {
  const user = c.get('user');

  // 1. Generate access and refresh tokens
  const { accessToken, refreshToken } = await tokens.generateTokens(user);

  // 2. Set appropriate cookies for the tokens
  tokens.setCookies(c, { accessToken, refreshToken });

  // 3. Associate the refresh token with the user
  await store.addUser(refreshToken, user);

  c.status(200);

  return c.json(user);
});

router.post('/logout', async (c) => {
  const rToken = tokens.getRefreshToken(c);

  // 1. Remove refresh token from DB
  if (rToken) {
    await store.removeUser(rToken);
  }

  const aToken = tokens.getAccessToken(c);

  // 2. Blacklist access token until it expires
  if (aToken) {
    const payload = await tokens.verifyAccessToken(aToken);
    await store.blacklistToken(payload);
  }

  // 3. Delete both cookies
  tokens.deleteCookies(c);

  return c.json({ ok: true });
});

router.get('/me', validateTokens, async (c) => {
  return c.json(c.get('user'));
});

router.get('/dashboard', validateTokens, (c) => {
  const user = c.get('user');

  return c.json({ data: `${user.email}: Dummy data` });
});

export { router as tokensRouter };
