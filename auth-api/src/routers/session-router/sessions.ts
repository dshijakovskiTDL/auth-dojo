import { Context } from 'hono';
import { randomBytes } from 'node:crypto';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

import { durationSeconds } from '../shared/utils';
import { sessionStore } from './store';
import { AuthUser, cookieOptions } from '../shared';

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

const loginUser = async (c: Context, user: AuthUser) => {
  // 1. Generate session ID
  const sessionId = sessions.generateSessionId();

  // 2. Set session cookie
  sessions.setSessionCookie(c, sessionId);

  // 3. Associate the session ID with the user
  await sessionStore.addSession(sessionId, user.publicId);
};

const logoutUser = async (c: Context) => {
  const sessionId = sessions.getSessionCookie(c);

  if (sessionId) {
    await sessionStore.removeSession(sessionId);
    sessions.deleteSessionCookie(c);
  }
};

export const sessions = {
  generateSessionId,
  getSessionCookie,
  setSessionCookie,
  deleteSessionCookie,

  loginUser,
  logoutUser,
};
