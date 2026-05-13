import { CookieOptions } from 'hono/utils/cookie';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  path: '/',
};

export type AuthUser = {
  email: string;
  publicId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
};

export type ValidationMiddleware = {
  Variables: {
    user: AuthUser;
  };
};
