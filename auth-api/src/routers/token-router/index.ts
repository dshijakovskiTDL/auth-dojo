import { Hono } from 'hono';

import { middleware } from '../shared/middleware';

import { tokenMiddleware } from './middleware';
import { tokens } from './tokens';

const router = new Hono();

router.post('/login', middleware.validateCredentials, async (c) => {
  const user = c.get('user');

  await tokens.loginUser(c, user);

  return c.json(user);
});

router.post('/logout', async (c) => {
  await tokens.logoutUser(c);

  return c.json({ ok: true });
});

router.get('/me', tokenMiddleware.validateTokens, async (c) => {
  return c.json(c.get('user'));
});

router.get('/dashboard', tokenMiddleware.validateTokens, (c) => {
  const user = c.get('user');

  return c.json({ data: `${user.email}: Dummy data`, user });
});

export { router as tokensRouter };
