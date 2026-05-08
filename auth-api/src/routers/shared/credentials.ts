import { CookieOptions } from 'hono/utils/cookie';
import * as v from 'valibot';

export const secretLogin = {
  email: 'daniel@correct.com',
  password: 'secret123',
  userId: 'user_123',
};

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: true,
  path: '/',
};

export const loginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
});

export type LoginUser = { email: string; userId: string };
