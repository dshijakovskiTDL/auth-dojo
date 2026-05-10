import { CookieOptions } from 'hono/utils/cookie';
import { object, email, pipe, string, InferInput } from 'valibot';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: true,
  path: '/',
};

export const loginSchema = object({
  email: pipe(string(), email()),
  password: string(),
});

export const registerSchema = object({
  name: string(),
  ...loginSchema.entries,
});

export type RegisterUser = InferInput<typeof registerSchema>;

export type AuthUser = {
  email: string;
  publicId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
};
