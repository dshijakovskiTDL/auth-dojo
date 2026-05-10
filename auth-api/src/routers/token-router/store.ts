import { durationSeconds, hashValue } from '../shared/utils';
import { redis, RedisKeyPrefix } from '../shared/redis';
import { database } from '../shared/db';
import { AuthUser } from '../shared';

export type AccessToken = { user: AuthUser; exp: number; jti: string };

const STORE_PREFIX: RedisKeyPrefix = 'token:';
const BLACKLIST_PREFIX: RedisKeyPrefix = `${STORE_PREFIX}blacklist:`;

const tokenKey = (token: string) => {
  const hashedToken = hashValue(token);
  return `${STORE_PREFIX}${hashedToken}`;
};

const getUser = async (refreshToken: string) => {
  const key = tokenKey(refreshToken);

  const publicId = await redis.get(key);
  if (!publicId) return null;

  const userData = await database.getCredentialsUserById(publicId);
  if (!userData) return null;

  return database.toAuthUser(userData);
};

const addUser = async (refreshToken: string, publicId: string) => {
  const key = tokenKey(refreshToken);
  const ttl = durationSeconds(1, 'days');

  await redis.set(key, publicId, 'EX', ttl);
};

const removeUser = async (refreshToken: string) => {
  const key = tokenKey(refreshToken);

  await redis.del(key);
};

const blacklistToken = async (payload: AccessToken) => {
  const key = `${BLACKLIST_PREFIX}${payload.jti}`;

  const remainingTtl = payload.exp - Math.floor(Date.now() / 1000);
  if (remainingTtl <= 0) return;

  await redis.set(key, '1', 'EX', remainingTtl);
};

const isBlacklisted = async (payload: AccessToken) => {
  return !!(await redis.get(`${BLACKLIST_PREFIX}${payload.jti}`));
};

export const tokenStore = {
  getUser,
  addUser,
  removeUser,

  blacklistToken,
  isBlacklisted,
};
