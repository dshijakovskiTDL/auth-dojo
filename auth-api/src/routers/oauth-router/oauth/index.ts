import { Context } from 'hono';
import { randomBytes } from 'node:crypto';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

import { durationSeconds } from '../../shared/utils';
import { cookieOptions } from '../../shared';
import { OAuthProvider } from '../../../db/schema';
import { CallbackSchema } from '../middleware';

const apiUrl = Bun.env.API_URL || 'http://localhost:3000';

const SESSION_COOKIE = 'auth-dojo-oauth-session';

const generateRandomState = () => {
  return crypto.randomUUID();
};

const base64url = (arr: Uint8Array) => {
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const generateVerifier = () => {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
};

const generateChallenge = async (verifier: string) => {
  return base64url(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)),
    ),
  );
};

const generateLoginCodes = async () => {
  const state = oAuth.generateRandomState();
  const codeVerifier = generateVerifier();
  const codeChallenge = await generateChallenge(codeVerifier);

  return { state, codeVerifier, codeChallenge };
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

type ConfigUrl<T extends Record<string, string>> = {
  authUrl: string;
  tokenUrl: string;
  userDataUrl: string;
} & T;
const createConfig = <T extends Record<string, string>>(
  provider: OAuthProvider,
  urls: ConfigUrl<T>,
) => ({
  ...urls,

  redirectUrl: `${apiUrl}/oauth/${provider}/callback`,

  cookies: {
    state: `auth-dojo-${provider}-state`,
    codeVerifier: `auth-dojo-${provider}-code-verifier`,
  },
});

export type OAuthModule<T = unknown> = {
  login: (c: Context) => Promise<string>;
  loginCallback: (c: Context, callbackSchema: CallbackSchema) => Promise<T>;
};

export const oAuth = {
  generateRandomState,
  generateLoginCodes,

  getSessionCookie,
  deleteSessionCookie,
  createSession,

  createConfig,
};
