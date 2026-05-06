import * as v from 'valibot';

export const secretLogin = {
  email: 'daniel@correct.com',
  password: 'secret123',
  userId: 'user_123',
};

export const loginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
});
