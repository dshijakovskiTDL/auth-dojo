import { randomUUIDv7 } from 'bun';
import { randomBytes } from 'node:crypto';
import { Context } from 'hono';
import { sign, verify } from 'hono/jwt';
import { CookieOptions } from 'hono/utils/cookie';
import { SignatureAlgorithm } from 'hono/utils/jwt/jwa';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

import { durationSeconds, tokenExpiry } from '../shared/utils';
import { AccessToken, tokenStore } from './store';
import { AuthUser, cookieOptions } from '../shared';
import { env } from '../../env';

const JWT_ALGO: SignatureAlgorithm = 'HS256';

const ACCESS_TOKEN = 'auth-dojo-access-token';

// Centralized expiration time for Access Token (both JWT and Cookie)
const ACCESS_TOKEN_DURATION_PARAMS: Parameters<typeof durationSeconds> = [15, 'minutes'];

const accessTokenCookieOptions = (): CookieOptions => ({
  ...cookieOptions,
  maxAge: durationSeconds(...ACCESS_TOKEN_DURATION_PARAMS),
});

const refreshTokenCookieOptions = (): CookieOptions => ({
  ...cookieOptions,
  maxAge: durationSeconds(1, 'days'),
});

const REFRESH_TOKEN = 'auth-dojo-refresh-token';

const accessToken = (c: Context) => {
  return getCookie(c, ACCESS_TOKEN);
};

const refreshToken = (c: Context) => {
  return getCookie(c, REFRESH_TOKEN);
};

const verifyAccessToken = async (accessToken: string) => {
  return (await verify(accessToken, env.JWT_SECRET, JWT_ALGO)) as AccessToken;
};

const generateTokens = async (user: AuthUser) => {
  const payload: AccessToken = {
    user,
    exp: tokenExpiry(...ACCESS_TOKEN_DURATION_PARAMS),
    jti: randomUUIDv7(),
  };

  const accessToken = await sign(payload, env.JWT_SECRET, JWT_ALGO);
  const refreshToken = randomBytes(32).toString('hex');

  return { accessToken, refreshToken };
};

const setCookies = (
  c: Context,
  tokens: { accessToken: string; refreshToken: string },
) => {
  const { accessToken, refreshToken } = tokens;

  setCookie(c, ACCESS_TOKEN, accessToken, accessTokenCookieOptions());
  setCookie(c, REFRESH_TOKEN, refreshToken, refreshTokenCookieOptions());
};

const deleteCookies = (c: Context) => {
  deleteCookie(c, ACCESS_TOKEN, accessTokenCookieOptions());
  deleteCookie(c, REFRESH_TOKEN, refreshTokenCookieOptions());
};

const loginUser = async (c: Context, user: AuthUser) => {
  // 1. Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateTokens(user);

  // 2. Set appropriate cookies for the tokens
  setCookies(c, { accessToken, refreshToken });

  // 3. Associate the refresh token with the user
  await tokenStore.addUser(refreshToken, user.publicId);
};

const logoutUser = async (c: Context) => {
  const rToken = refreshToken(c);

  // 1. Remove refresh token from DB
  if (rToken) {
    await tokenStore.removeUser(rToken);
  }

  const aToken = accessToken(c);

  // 2. Blacklist access token until it expires
  if (aToken) {
    const payload = await verifyAccessToken(aToken);
    await tokenStore.blacklistToken(payload);
  }

  // 3. Delete both cookies
  deleteCookies(c);
};

export const tokens = {
  generateTokens,

  accessToken,
  refreshToken,
  verifyAccessToken,

  setCookies,
  deleteCookies,

  loginUser,
  logoutUser,
};
