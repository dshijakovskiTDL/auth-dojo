import { Context } from 'hono';
import { sign, verify } from 'hono/jwt';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { SignatureAlgorithm } from 'hono/utils/jwt/jwa';
import { randomBytes } from 'node:crypto';
import { randomUUIDv7 } from 'bun';

import { durationSeconds, tokenExpiry } from '../shared/utils';
import { AccessToken, tokenStore } from './store';
import { AuthUser, cookieOptions } from '../shared';

const jwtSecret = Bun.env.JWT_SECRET || randomBytes(32).toString('hex');
const jwtAlgo: SignatureAlgorithm = 'HS256';

const ACCESS_TOKEN = 'auth-dojo-access-token';
const REFRESH_TOKEN = 'auth-dojo-refresh-token';

const accessToken = (c: Context) => {
  return getCookie(c, ACCESS_TOKEN);
};

const refreshToken = (c: Context) => {
  return getCookie(c, REFRESH_TOKEN);
};

const verifyAccessToken = async (accessToken: string) => {
  return (await verify(accessToken, jwtSecret, jwtAlgo)) as AccessToken;
};

const generateTokens = async (user: AuthUser) => {
  const payload: AccessToken = {
    user,
    exp: tokenExpiry(15, 'minutes'),
    jti: randomUUIDv7(),
  };

  const accessToken = await sign(payload, jwtSecret, jwtAlgo);
  const refreshToken = randomBytes(32).toString('hex');

  return { accessToken, refreshToken };
};

const setCookies = (
  c: Context,
  tokens: { accessToken: string; refreshToken: string },
) => {
  const { accessToken, refreshToken } = tokens;

  setCookie(c, ACCESS_TOKEN, accessToken, {
    ...cookieOptions,
    maxAge: durationSeconds(15, 'minutes'),
  });
  setCookie(c, REFRESH_TOKEN, refreshToken, {
    ...cookieOptions,
    maxAge: durationSeconds(1, 'days'),
  });
};

const deleteCookies = (c: Context) => {
  deleteCookie(c, ACCESS_TOKEN);
  deleteCookie(c, REFRESH_TOKEN);
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
