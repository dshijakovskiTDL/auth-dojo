import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

import { oAuth, OAuthModule } from '..';
import { env } from '../../../../env';

export type GoogleUser = {
  id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};

const config = oAuth.createConfig('google', {
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userDataUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
});

const googleAuthUrl = (codes: { state: string; codeChallenge: string }) => {
  const { state, codeChallenge } = codes;

  const url = new URL(config.authUrl);

  url.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
  url.searchParams.set('redirect_uri', config.redirectUrl);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');

  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');

  return url.toString();
};

const exchangeToken = async (codes: { code: string; codeVerifier: string }) => {
  const { code, codeVerifier } = codes;

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    body: JSON.stringify({
      code,
      code_verifier: codeVerifier,

      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,

      redirect_uri: config.redirectUrl,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error('Failed to exchange token!');
  }

  const tokenData = (await response.json()) as { access_token: string };

  return tokenData;
};

const getUserData = async (accessToken: string) => {
  const response = await fetch(config.userDataUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error('Failed to get user data!');
  }

  const userData = (await response.json()) as GoogleUser;

  return userData;
};

export const googleOAuth: OAuthModule<GoogleUser> = {
  login: async (c) => {
    // 1. Generate state, code verifier, code challenge
    const { state, codeChallenge, codeVerifier } = await oAuth.generateLoginCodes();

    // 2. Set cookies for state and code verifier
    setCookie(c, config.cookies.state, state, oAuth.stateCookieOptions());

    setCookie(
      c,
      config.cookies.codeVerifier,
      codeVerifier,
      oAuth.codeVerifierCookieOptions(),
    );

    // 3. Construct auth url
    return googleAuthUrl({ state, codeChallenge });
  },

  loginCallback: async (c, { state, code }) => {
    const serverState = getCookie(c, config.cookies.state);
    if (!serverState) {
      throw new Error('State cookie is missing!');
    }

    // 1. CSRF protection - state mismatch check
    if (serverState !== state) {
      throw new Error('State mismatch!');
    }

    const codeVerifier = getCookie(c, config.cookies.codeVerifier);
    if (!codeVerifier) {
      throw new Error('Code verifier cookie is missing!');
    }

    // 2. Clear cookies - invalidate state for multiple usage
    deleteCookie(c, config.cookies.state, oAuth.stateCookieOptions());
    deleteCookie(c, config.cookies.codeVerifier, oAuth.codeVerifierCookieOptions());

    // 3. Exchange code for token
    const tokenData = await exchangeToken({ code, codeVerifier });

    // 4. Get user info with token
    const userData = await getUserData(tokenData.access_token);

    return userData;
  },
};
