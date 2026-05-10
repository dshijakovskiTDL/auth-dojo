import { createMiddleware } from 'hono/factory';

import { tokenStore } from './store';
import { tokens } from './tokens';
import { ValidationMiddleware } from '../shared';

export const validateTokens = createMiddleware<ValidationMiddleware>(async (c, next) => {
  const aToken = tokens.accessToken(c);

  if (aToken) {
    try {
      const payload = await tokens.verifyAccessToken(aToken);
      const isBlacklisted = await tokenStore.isBlacklisted(payload);

      if (isBlacklisted) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const { user } = payload;
      c.set('user', user);

      return next();
    } catch (e) {
      console.error('Access token verification error');
      console.error(e);
    }
  }

  // Refresh token check
  const rToken = tokens.refreshToken(c);

  if (!rToken) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const user = await tokenStore.getUser(rToken);

  if (!user) {
    // Invalid/Expired refresh token - force re-login
    tokens.deleteCookies(c);

    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Valid refresh token - issue new tokens
  const { accessToken, refreshToken } = await tokens.generateTokens(user);

  // Set new token cookies
  tokens.setCookies(c, { accessToken, refreshToken });

  await tokenStore.removeUser(rToken); // Remove old refresh token
  await tokenStore.addUser(refreshToken, user.publicId); // Add new refresh token

  c.set('user', user);

  return next();
});
