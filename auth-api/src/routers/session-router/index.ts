import { Hono } from 'hono';
import { validateCredentials } from '../shared/middleware';
import { sessions } from './sessions';
import { store } from './store';
import { validateSession } from './middleware';

const router = new Hono();

router.post('/login', validateCredentials, async (c) => {
  const user = c.get('user');

  // 1. Generate session ID
  const sessionId = sessions.generateSessionId();

  // 2. Set session cookie
  sessions.setSessionCookie(c, sessionId);

  // 3. Associate the session ID with the user
  await store.addSession(sessionId, user.publicId);

  c.status(200);

  return c.json(user);
});

router.post('/logout', async (c) => {
  const sessionId = sessions.getSessionCookie(c);

  if (sessionId) {
    await store.removeSession(sessionId);
    sessions.deleteSessionCookie(c);
  }

  return c.json({ ok: true });
});

router.get('/me', validateSession, (c) => {
  return c.json(c.get('user'));
});

router.get('/dashboard', validateSession, (c) => {
  const user = c.get('user');

  return c.json({ data: `${user.email}: Dummy data`, user });
});

export { router as sessionRouter };
