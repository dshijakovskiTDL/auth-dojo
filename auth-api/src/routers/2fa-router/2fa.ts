import { Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { randomBytes } from 'node:crypto';
import { AuthUser, cookieOptions } from '../shared';
import {
  durationSeconds,
  generateOtpCode,
  hashPassword,
  verifyHash,
} from '../shared/utils';
import { twoFactorStore } from './store';
import { database } from '../shared/db';
import { twoFactorEmail } from './email';

const SESSION_COOKIE = 'auth-dojo-2fa-session-id';
const PRE_AUTH_COOKIE = 'auth-dojo-2fa-pre-auth';

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

const prepareLogin = async (c: Context, user: AuthUser) => {
  const preAuthToken = Bun.randomUUIDv7();
  const otpCode = generateOtpCode();
  const hashedOtpCode = await hashPassword(otpCode);

  setCookie(c, PRE_AUTH_COOKIE, preAuthToken, {
    ...cookieOptions,
    maxAge: durationSeconds(10, 'minutes'),
  });

  await Promise.all([
    await twoFactorStore.addPreAuth(preAuthToken, {
      userId: user.publicId,
      hashedOtpCode,
    }),
    await twoFactorEmail.sendCodeVerification(otpCode, user),
  ]);
};

const clearPreAuth = async (c: Context, preAuthToken: string) => {
  deleteCookie(c, PRE_AUTH_COOKIE);
  await twoFactorStore.removePreAuth(preAuthToken);
};

const verifyPreAuth = async (c: Context) => {
  const preAuthToken = getCookie(c, PRE_AUTH_COOKIE);
  if (!preAuthToken) return null;

  const entry = await twoFactorStore.getPreAuth(preAuthToken);
  if (!entry) return null;

  return { preAuthToken, userId: entry.userId };
};

const resendCode = async (c: Context, preAuthToken: string, userId: string) => {
  const [userData] = await Promise.all([
    database.getCredentialsUserById(userId),
    clearPreAuth(c, preAuthToken),
  ]);

  if (!userData) {
    throw new Error('User not found');
  }

  await prepareLogin(c, database.toAuthUser(userData));
};

const verifyLogin = async (c: Context, code: string) => {
  const preAuthToken = getCookie(c, PRE_AUTH_COOKIE);
  if (!preAuthToken) {
    throw new Error('Missing pre-auth token cookie');
  }

  const entry = await twoFactorStore.getPreAuth(preAuthToken);
  if (!entry) {
    throw new Error('Invalid pre-auth token');
  }

  const { hashedOtpCode, userId } = entry;

  // Verify OTP Code
  const validOtpCode = verifyHash(code, hashedOtpCode);
  if (!validOtpCode) {
    throw new Error('Invalid OTP code');
  }

  // Clear pre-auth state as its finished
  await clearPreAuth(c, preAuthToken);

  const userData = await database.getCredentialsUserById(userId);
  if (!userData) {
    throw new Error('Invalid user ID');
  }

  return database.toAuthUser(userData);
};

const loginUser = async (c: Context, user: AuthUser) => {
  // 1. Generate session ID
  const sessionId = generateSessionId();

  // 2. Set session cookie
  setSessionCookie(c, sessionId);

  // 3. Associate the session ID with the user
  await twoFactorStore.addSession(sessionId, user.publicId);
};

const logoutUser = async (c: Context) => {
  const sessionId = getSessionCookie(c);

  if (sessionId) {
    await twoFactorStore.removeSession(sessionId);
    deleteSessionCookie(c);
  }
};

export const twoFactor = {
  generateSessionId,
  getSessionCookie,
  setSessionCookie,
  deleteSessionCookie,

  prepareLogin,
  verifyLogin,
  verifyPreAuth,
  resendCode,
  loginUser,
  logoutUser,
};
