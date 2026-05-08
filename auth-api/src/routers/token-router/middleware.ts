import { createMiddleware } from 'hono/factory';

import { store } from './store';
import { tokens } from './tokens';
import { LoginUser } from '../shared/credentials';

type ValidateTokensMiddleware = { Variables: { user: LoginUser } };

export const validateTokens = createMiddleware<ValidateTokensMiddleware>(
  async (c, next) => {
    const aToken = tokens.getAccessToken(c);

    if (aToken) {
      try {
        const payload = await tokens.verifyAccessToken(aToken);
        const isBlacklisted = await store.isBlacklisted(payload);

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
    const rToken = tokens.getRefreshToken(c);

    if (!rToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await store.getUser(rToken);

    if (!user) {
      // Invalid/Expired refresh token - force re-login
      tokens.deleteCookies(c);

      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Valid refresh token - issue new tokens
    const { accessToken, refreshToken } = await tokens.generateTokens(user);

    // Set new token cookies
    tokens.setCookies(c, { accessToken, refreshToken });

    await store.removeUser(rToken); // Remove old refresh token
    await store.addUser(refreshToken, user); // Add new refresh token

    c.set('user', user);

    return next();
  },
);
