import * as v from 'valibot';
import { createMiddleware } from 'hono/factory';
import { vValidator } from '@hono/valibot-validator';

import { database } from './db';
import { verifyPassword } from './utils';
import { ValidationMiddleware } from '.';

export type RegisterUser = v.InferInput<typeof registerSchema>;

const loginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
});

const registerSchema = v.object({
  name: v.string(),
  ...loginSchema.entries,
});

const registerAuthModeSchema = v.object({
  authMode: v.picklist(['token', 'session']),
});

const validateRegister = vValidator('json', registerSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: 'Invalid request' }, 400);
  }
});

const validateRegisterAuthMode = vValidator(
  'query',
  registerAuthModeSchema,
  (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid auth mode' }, 400);
    }
  },
);

const validateCredentials = createMiddleware<ValidationMiddleware>(async (c, next) => {
  const result = v.safeParse(loginSchema, await c.req.json());

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

export const middleware = {
  validateRegister,
  validateRegisterAuthMode,

  validateCredentials,
};
