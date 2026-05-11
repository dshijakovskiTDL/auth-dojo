import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { oAuth, OAuthModule } from '.';
import { cookieOptions } from '../../shared';

export type GithubUser = {
  id: number;
  email: string | null;
  login: string;
  name: string | null;
  avatar_url: string;
};

const config = oAuth.createConfig('github', {
  authUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  userDataUrl: 'https://api.github.com/user',

  emailsUrl: 'https://api.github.com/user/emails',
});

const githubAuthUrl = (codes: { state: string; codeChallenge: string }) => {
  const { state, codeChallenge } = codes;

  const url = new URL(config.authUrl);

  url.searchParams.set('client_id', Bun.env.GITHUB_CLIENT_ID!);
  url.searchParams.set('redirect_uri', config.redirectUrl);
  url.searchParams.set('scope', 'user:email read:user');

  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');

  url.searchParams.set('prompt', 'select_account');

  return url.toString();
};

const exchangeToken = async (codes: { code: string; codeVerifier: string }) => {
  const { code, codeVerifier } = codes;

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      code_verifier: codeVerifier,

      client_id: Bun.env.GITHUB_CLIENT_ID,
      client_secret: Bun.env.GITHUB_CLIENT_SECRET,

      redirect_uri: config.redirectUrl,
    }),
  });

  const tokenData = (await response.json()) as { access_token: string };

  return tokenData;
};

const getUserData = async (accessToken: string) => {
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(config.userDataUrl, { headers });

  const userData = (await response.json()) as GithubUser;

  if (!userData.email) {
    const response = await fetch(config.emailsUrl, { headers });
    const emails = (await response.json()) as Array<{
      email: string;
      primary: boolean;
      verified: boolean;
    }>;

    const verifiedEmail = emails.find((email) => email.primary && email.verified);
    userData.email = verifiedEmail?.email ?? null;
  }

  return userData;
};

export const githubOAuth: OAuthModule<GithubUser> = {
  login: async (c) => {
    // 1. Generate state, code verifier, code challenge
    const { state, codeChallenge, codeVerifier } = await oAuth.generateLoginCodes();

    // 2. Set cookies for state and code verifier
    setCookie(c, config.cookies.state, state, {
      ...cookieOptions,
      sameSite: 'lax',
      maxAge: 5 * 60, // 5 minutes
    });

    setCookie(c, config.cookies.codeVerifier, codeVerifier, {
      ...cookieOptions,
      sameSite: 'lax',
      maxAge: 5 * 60, // 5 minutes
    });

    // 3. Construct auth url
    return githubAuthUrl({ state, codeChallenge });
  },

  loginCallback: async (c, { state, code }) => {
    const serverState = getCookie(c, config.cookies.state)!;

    // 1. CSRF protection - state mismatch check
    if (serverState !== state) {
      throw new Error('State mismatch!');
    }

    const codeVerifier = getCookie(c, config.cookies.codeVerifier)!;

    // 2. Clear cookies - invalidate state for multiple usage
    deleteCookie(c, config.cookies.state);
    deleteCookie(c, config.cookies.codeVerifier);

    // 3. Exchange code for token
    const tokenData = await exchangeToken({ code, codeVerifier });

    // 4. Get user info with token
    const userData = await getUserData(tokenData.access_token);

    return userData;
  },
};
