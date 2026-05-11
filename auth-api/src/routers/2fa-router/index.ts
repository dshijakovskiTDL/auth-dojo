import { Hono } from 'hono';
import { middleware } from '../shared/middleware';
import { twoFactorMiddleware } from './middleware';
import { twoFactor } from './2fa';

const router = new Hono();

router.post('/login', middleware.validateCredentials, async (c) => {
  const user = c.get('user');

  try {
    await twoFactor.prepareLogin(c, user);

    return c.json({ ok: true });
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Failed to login, please try again' }, 500);
  }
});

// Verify 2FA login process
router.post('/verify', twoFactorMiddleware.validateCodeVerifier, async (c) => {
  const { code } = c.req.valid('json');

  try {
    const user = await twoFactor.verifyLogin(c, code);
    await twoFactor.loginUser(c, user);
    return c.json(user);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Invalid verification' }, 401);
  }
});

// Protect the frontend "Verify" page
router.get('/verify', twoFactorMiddleware.validatePreAuth, async (c) => {
  return c.json({ ok: true });
});

router.post('/resend', twoFactorMiddleware.validatePreAuth, async (c) => {
  const preAuthToken = c.get('preAuthToken');
  const userId = c.get('userId');

  try {
    await twoFactor.resendCode(c, preAuthToken, userId);
    return c.json({ ok: true });
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Failed to resend code, please try again' }, 500);
  }
});

router.post('/logout', async (c) => {
  await twoFactor.logoutUser(c);

  return c.json({ ok: true });
});

router.get('/me', twoFactorMiddleware.validateSession, async (c) => {
  return c.json(c.get('user'));
});

router.get('/dashboard', twoFactorMiddleware.validateSession, async (c) => {
  const user = c.get('user');

  return c.json({ data: `${user.email}: Dummy data`, user });
});

export { router as twoFactorRouter };
