import { Context } from 'hono';
import { sign, verify } from 'hono/jwt';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { CookieOptions } from 'hono/utils/cookie';
import { SignatureAlgorithm } from 'hono/utils/jwt/jwa';
import { randomBytes } from 'node:crypto';
import { randomUUIDv7 } from 'bun';

import { durationSeconds, tokenExpiry } from '../shared/utils';
import { AccessToken, TokenUser } from './store';

const jwtSecret = Bun.env.JWT_SECRET || randomBytes(32).toString('hex');
const jwtAlgo: SignatureAlgorithm = 'HS256';

const ACCESS_TOKEN = 'auth-dojo-access-token';
const REFRESH_TOKEN = 'auth-dojo-refresh-token';

const getAccessToken = (c: Context) => {
  return getCookie(c, ACCESS_TOKEN);
};

const getRefreshToken = (c: Context) => {
  return getCookie(c, REFRESH_TOKEN);
};

const verifyAccessToken = async (accessToken: string) => {
  return (await verify(accessToken, jwtSecret, jwtAlgo)) as AccessToken;
};

const generateTokens = async (user: TokenUser) => {
  const payload: AccessToken = {
    user,
    exp: tokenExpiry(15, 'minutes'),
    jti: randomUUIDv7(),
  };

  const accessToken = await sign(payload, jwtSecret, jwtAlgo);
  const refreshToken = randomBytes(32).toString('hex');

  return { accessToken, refreshToken };
};

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax', // TODO: Learn how/when to use the different values
  secure: Bun.env.BUN_DEV === 'production',
  path: '/',
};

const setCookies = (
  c: Context,
  tokens: { accessToken: string; refreshToken: string },
) => {
  const { accessToken, refreshToken } = tokens;

  setCookie(c, ACCESS_TOKEN, accessToken, {
    ...cookieOptions,
    maxAge: durationSeconds(15, 'minutes'), // 15 minutes
  });
  setCookie(c, REFRESH_TOKEN, refreshToken, {
    ...cookieOptions,
    maxAge: durationSeconds(1, 'days'), // 1 day
  });
};

const deleteCookies = (c: Context) => {
  deleteCookie(c, ACCESS_TOKEN);
  deleteCookie(c, REFRESH_TOKEN);
};

export const tokens = {
  getAccessToken,
  getRefreshToken,

  verifyAccessToken,
  generateTokens,

  setCookies,
  deleteCookies,
};
