import { durationSeconds, hashToken } from '../shared/utils';
import { redis, RedisKeyPrefix } from '../shared/redis';

export type TokenUser = { email: string; userId: string };
export type AccessToken = { user: TokenUser; exp: number; jti: string };

const STORE_PREFIX: RedisKeyPrefix = 'token:';
const BLACKLIST_PREFIX: RedisKeyPrefix = `${STORE_PREFIX}blacklist:`;

const getUser = async (refreshToken: string) => {
  const hashedToken = hashToken(refreshToken);
  const key = `${STORE_PREFIX}${hashedToken}`;

  const user = await redis.get(key);
  if (!user) return null;

  return JSON.parse(user) as TokenUser;
};

const addUser = async (refreshToken: string, user: TokenUser) => {
  const hashedToken = hashToken(refreshToken);
  const key = `${STORE_PREFIX}${hashedToken}`;
  const ttl = durationSeconds(1, 'days');

  await redis.set(key, JSON.stringify(user), 'EX', ttl);
};

const removeUser = async (refreshToken: string) => {
  const hashedToken = hashToken(refreshToken);
  const key = `${STORE_PREFIX}${hashedToken}`;

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

export const store = {
  getUser,
  addUser,
  removeUser,
  blacklistToken,
  isBlacklisted,
};
