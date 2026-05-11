import { Hono } from 'hono';
import { middleware } from '../shared/middleware';
import { sessions } from './sessions';
import { sessionMiddleware } from './middleware';

const router = new Hono();

router.post('/login', middleware.validateCredentials, async (c) => {
  const user = c.get('user');

  await sessions.loginUser(c, user);

  return c.json(user);
});

router.post('/logout', async (c) => {
  await sessions.logoutUser(c);

  return c.json({ ok: true });
});

router.get('/me', sessionMiddleware.validateSession, (c) => {
  return c.json(c.get('user'));
});

router.get('/dashboard', sessionMiddleware.validateSession, (c) => {
  const user = c.get('user');

  return c.json({ data: `${user.email}: Dummy data`, user });
});

export { router as sessionRouter };
