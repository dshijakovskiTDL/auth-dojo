import * as v from 'valibot';

const EnvSchema = v.object({
  PORT: v.fallback(v.number(), 3000),
  BUN_ENV: v.fallback(v.picklist(['development', 'production']), 'development'),

  FRONTEND_URL: v.fallback(v.string(), 'http://localhost:5173'),
  API_URL: v.fallback(v.string(), 'http://localhost:3000'),
  JWT_SECRET: v.string(),

  REDIS_URL: v.string(),
  REDIS_PASSWORD: v.optional(v.string()),

  GOOGLE_CLIENT_ID: v.string(),
  GOOGLE_CLIENT_SECRET: v.string(),

  GITHUB_CLIENT_ID: v.string(),
  GITHUB_CLIENT_SECRET: v.string(),

  TURSO_DB_URL: v.string(),
  TURSO_DB_TOKEN: v.string(),

  RESEND_API_KEY: v.string(),
});

let env: v.InferInput<typeof EnvSchema>;

try {
  env = v.parse(EnvSchema, Bun.env);
} catch (e) {
  console.log('Invalid environment variables');
  console.log(e);

  process.exit(0);
}

export { env };
