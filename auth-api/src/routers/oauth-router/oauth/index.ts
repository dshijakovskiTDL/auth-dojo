import { Context } from 'hono';
import { randomBytes } from 'node:crypto';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

import { durationSeconds } from '../../shared/utils';
import { cookieOptions } from '../../shared';

const SESSION_COOKIE = 'auth-dojo-oauth-session';

const generateRandomState = () => {
  return crypto.randomUUID();
};

const getSessionCookie = (c: Context) => {
  return getCookie(c, SESSION_COOKIE);
};

const deleteSessionCookie = (c: Context) => {
  deleteCookie(c, SESSION_COOKIE);
};

const createSession = (c: Context) => {
  const sessionId = randomBytes(32).toString('hex');

  setCookie(c, SESSION_COOKIE, sessionId, {
    ...cookieOptions,
    maxAge: durationSeconds(1, 'days'),
  });

  return sessionId;
};

export const oAuth = {
  generateRandomState,
  getSessionCookie,
  deleteSessionCookie,
  createSession,
};
