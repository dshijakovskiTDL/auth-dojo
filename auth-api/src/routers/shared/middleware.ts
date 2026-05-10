import { safeParse } from 'valibot';
import { createMiddleware } from 'hono/factory';
import { vValidator } from '@hono/valibot-validator';

import { AuthUser, loginSchema, registerSchema } from './credentials';
import { database } from './db';
import { verifyPassword } from './utils';

export const validateRegister = vValidator('json', registerSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: 'Invalid request' }, 401);
  }
});

// Shared middleware for validating mock credentials for Token and Session routers
export const validateCredentials = createMiddleware<{
  Variables: { user: AuthUser };
}>(async (c, next) => {
  const result = safeParse(loginSchema, await c.req.json());
  if (!result.success) {
    return c.json({ error: 'Invalid request' }, 400);
  }

  const { email, password } = result.output;

  // 1. Check if email exists/Get user from DB
  const user = await database.getCredentialsUserByEmail(email);

  if (!user) {
    return c.json({ error: 'Email is incorrect' }, 401);
  }

  // 2. Check if password is correct
  const validPassword = await verifyPassword(password, user.password!);

  if (!validPassword) {
    return c.json({ error: 'Password is incorrect' }, 401);
  }

  // Return user from DB
  c.set('user', database.toAuthUser(user));

  await next();
});
