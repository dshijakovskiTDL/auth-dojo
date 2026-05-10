import { Context } from 'hono';

import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

import { oAuth } from '.';
import { GoogleCallbackSchema } from '../middleware';
import { cookieOptions } from '../../shared';

const apiUrl = Bun.env.API_URL || 'http://localhost:3000';
const REDIRECT_API_URL = `${apiUrl}/oauth/google/callback`;

const REDIRECT_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_EXCHANGE_URL = 'https://oauth2.googleapis.com/token';
const USER_DATA_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

const STATE_COOKIE = 'auth-dojo-google-state';
const CODE_VERIFIER_COOKIE = 'auth-dojo-google-code-verifier';

export type GoogleUser = {
  id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};

const base64url = (arr: Uint8Array) => {
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const generateVerifier = () => {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
};

export const generateChallenge = async (verifier: string) => {
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

const googleRedirectUrl = (codes: { state: string; codeChallenge: string }) => {
  const { state, codeChallenge } = codes;

  const url = new URL(REDIRECT_URL);

  url.searchParams.set('client_id', Bun.env.GOOGLE_CLIENT_ID!);
  url.searchParams.set('redirect_uri', REDIRECT_API_URL);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');

  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');

  return url.toString();
};

const exchangeToken = async (codes: { code: string; codeVerifier: string }) => {
  const { code, codeVerifier } = codes;

  const response = await fetch(TOKEN_EXCHANGE_URL, {
    method: 'POST',
    body: JSON.stringify({
      code,
      code_verifier: codeVerifier,

      client_id: Bun.env.GOOGLE_CLIENT_ID,
      client_secret: Bun.env.GOOGLE_CLIENT_SECRET,

      redirect_uri: REDIRECT_API_URL,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = (await response.json()) as { access_token: string };

  return tokenData;
};

const getUserData = async (accessToken: string) => {
  const response = await fetch(USER_DATA_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const userData = (await response.json()) as GoogleUser;

  return userData;
};

const login = async (c: Context) => {
  // 1. Generate state, code verifier, code challenge
  const { state, codeChallenge, codeVerifier } = await generateLoginCodes();

  // 2. Set cookies for state and code verifier
  setCookie(c, STATE_COOKIE, state, {
    ...cookieOptions,
    sameSite: 'lax',
    maxAge: 5 * 60, // 5 minutes
  });

  setCookie(c, CODE_VERIFIER_COOKIE, codeVerifier, {
    ...cookieOptions,
    sameSite: 'lax',
    maxAge: 5 * 60, // 5 minutes
  });

  // 3. Construct redirect url
  return googleRedirectUrl({ state, codeChallenge });
};

const loginCallback = async (c: Context, { state, code }: GoogleCallbackSchema) => {
  const serverState = getCookie(c, STATE_COOKIE)!;

  // 1. CSRF protection - state mismatch check
  if (serverState !== state) {
    throw new Error('State mismatch!');
  }

  const codeVerifier = getCookie(c, CODE_VERIFIER_COOKIE)!;

  // 2. Clear cookies - invalidate state for multiple usage
  deleteCookie(c, STATE_COOKIE);
  deleteCookie(c, CODE_VERIFIER_COOKIE);

  // 3. Exchange code for token
  const tokenData = await exchangeToken({ code, codeVerifier });

  // 4. Get user info with token
  const userData = await getUserData(tokenData.access_token);

  return userData;
};

export const googleOAuth = {
  login,
  loginCallback,
};
