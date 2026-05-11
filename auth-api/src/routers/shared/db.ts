import { and, eq } from 'drizzle-orm';

import { db } from '../../db';
import { OAuthProvider, users } from '../../db/schema';
import { hashPassword } from './utils';
import { GoogleUser } from '../oauth-router/oauth/google';
import { RegisterUser } from './middleware';
import { AuthUser } from '.';
import { GithubUser } from '../oauth-router/oauth/github';

const getCredentialsUserByEmail = async (email: string) => {
  const [userData] = await db
    .select()
    .from(users)
    .where(and(eq(users.authType, 'credentials'), eq(users.email, email)))
    .limit(1);

  return userData ?? null;
};

const getCredentialsUserById = async (publicId: string) => {
  const [userData] = await db
    .select()
    .from(users)
    .where(and(eq(users.authType, 'credentials'), eq(users.publicId, publicId)))
    .limit(1);

  return userData ?? null;
};

const getOAuthUser = async (providerId: string, provider?: OAuthProvider) => {
  const [userData] = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.authType, 'oauth'),
        provider ? eq(users.provider, provider) : undefined,
        eq(users.providerId, providerId),
      ),
    )
    .limit(1);

  return userData ?? null;
};

const registerCredentialsUser = async (userData: RegisterUser) => {
  const { name, email, password } = userData;

  // 1. Check if user exists
  const existingUser = await getCredentialsUserByEmail(email);

  if (existingUser) {
    throw new Error(`User with email ${email} already exists!`);
  }

  // 2. Create new user - hash password
  const hashedPassword = await hashPassword(password);

  const [firstName, ...restOfName] = name.split(' ');
  const lastName = restOfName.join(' ');

  const publicId = Bun.randomUUIDv7();

  // 3. Insert into DB
  const [user] = await db
    .insert(users)
    .values({
      email,
      firstName,
      lastName,

      publicId,

      password: hashedPassword,
      authType: 'credentials',
    })
    .returning();

  return toAuthUser(user);
};

const registerGoogleUser = async (userData: GoogleUser) => {
  const { email, picture, given_name, family_name, id } = userData;

  // 1. Check if user exists
  const existingUser = await getOAuthUser(id, 'google');
  if (existingUser) return existingUser;

  const publicId = Bun.randomUUIDv7();

  // 2. Insert into DB
  const [user] = await db
    .insert(users)
    .values({
      email,
      firstName: given_name,
      lastName: family_name,
      avatarUrl: picture,

      publicId,

      authType: 'oauth',
      provider: 'google',
      providerId: id,
    })
    .returning();

  return user;
};

const registerGithubUser = async (userData: GithubUser) => {
  const { email, avatar_url, name, login, id } = userData;

  const providerId = String(id);

  let firstName = '';
  let lastName = '';

  if (name) {
    let [fName, ...restOfName] = name.split(' ');
    firstName = fName;
    lastName = restOfName.join(' ');
  } else {
    firstName = login;
  }

  // 1. Check if user exists
  const existingUser = await getOAuthUser(providerId, 'github');
  if (existingUser) return existingUser;

  const publicId = Bun.randomUUIDv7();

  // 2. Insert into DB
  const [user] = await db
    .insert(users)
    .values({
      email: email ?? 'unknown@github.com',
      firstName,
      lastName,
      avatarUrl: avatar_url,

      publicId,

      authType: 'oauth',
      provider: 'github',
      providerId,
    })
    .returning();

  return user;
};

const registerOAuthUser = async <TMethod extends 'google' | 'github'>(
  method: TMethod,
  userData: TMethod extends 'google' ? GoogleUser : GithubUser,
) => {
  if (method === 'google') {
    return await registerGoogleUser(userData as GoogleUser);
  }

  if (method === 'github') {
    return await registerGithubUser(userData as GithubUser);
  }

  throw new Error('Invalid OAuth registration method');
};

const toAuthUser = (userData: typeof users.$inferSelect): AuthUser => {
  const { email, firstName, lastName, publicId, avatarUrl } = userData;

  return { email, firstName, lastName, publicId, avatarUrl };
};

export const database = {
  getCredentialsUserByEmail,
  getCredentialsUserById,
  getOAuthUser,
  registerCredentialsUser,
  registerOAuthUser,

  toAuthUser,
};
