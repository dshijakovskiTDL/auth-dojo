import { Context } from 'hono';
import { randomBytes } from 'node:crypto';
import { cookieOptions } from '../shared/credentials';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { durationSeconds } from '../shared/utils';

const SESSION_COOKIE = 'auth-dojo-session-id';

const generateSessionId = () => {
  return randomBytes(32).toString('hex');
};

const getSessionCookie = (c: Context) => {
  return getCookie(c, SESSION_COOKIE);
};

const setSessionCookie = (c: Context, sessionId: string) => {
  setCookie(c, SESSION_COOKIE, sessionId, {
    ...cookieOptions,
    maxAge: durationSeconds(1, 'days'),
  });
};

const deleteSessionCookie = (c: Context) => {
  deleteCookie(c, SESSION_COOKIE);
};

export const sessions = {
  generateSessionId,
  getSessionCookie,
  setSessionCookie,
  deleteSessionCookie,
};
