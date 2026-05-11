import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: int().primaryKey({ autoIncrement: true }),
  publicId: text().notNull().unique(), // UUIDv7, exposed externally

  email: text().notNull(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  avatarUrl: text(),

  password: text(), // null for OAuth users
  authType: text().$type<'credentials' | 'oauth'>().notNull(), // 'credentials' | 'oauth'

  // OAuth only
  provider: text().$type<'google' | 'github' | 'facebook' | 'twitter' | 'linkedin'>(), // 'google' | 'github' | 'facebook' | 'twitter' | 'linkedin' | null
  providerId: text(), // provider's user ID | null
});

export type AuthType = (typeof users.$inferSelect)['authType'];
export type OAuthProvider = NonNullable<(typeof users.$inferSelect)['provider']>;
