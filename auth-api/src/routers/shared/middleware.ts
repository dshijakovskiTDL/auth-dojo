import { safeParse } from 'valibot';
import { createMiddleware } from 'hono/factory';

import { loginSchema, secretLogin } from './credentials';
import { TokenUser } from '../tokens-router/store';

// Shared middleware for validating mock credentials for Token and Session routers
export const validateCredentials = createMiddleware<{
  Variables: { user: TokenUser };
}>(async (c, next) => {
  const result = safeParse(loginSchema, await c.req.json());
  if (!result.success) {
    return c.json({ error: 'Invalid request' }, 400);
  }

  const { email, password } = result.output;

  if (email !== secretLogin.email) {
    return c.json({ error: 'Email is incorrect' }, 401);
  }

  if (password !== secretLogin.password) {
    return c.json({ error: 'Password is incorrect' }, 401);
  }

  c.set('user', { email, userId: secretLogin.userId });
  await next();
});
