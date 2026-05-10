import { drizzle } from 'drizzle-orm/libsql';

export const db = drizzle({
  connection: {
    url: Bun.env.TURSO_DB_URL,
    authToken: Bun.env.TURSO_DB_TOKEN,
  },
});
