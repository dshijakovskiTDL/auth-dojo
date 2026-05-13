import { database } from '../shared/db';
import { redis, RedisKeyPrefix } from '../shared/redis';
import { durationSeconds, hashValue } from '../shared/utils';

const STORE_PREFIX: RedisKeyPrefix = 'sessions:credential:';

const sessionKey = (sessionId: string) => {
  const hashedSessionId = hashValue(sessionId);
  return `${STORE_PREFIX}${hashedSessionId}`;
};

export const getSession = async (sessionId: string) => {
  const key = sessionKey(sessionId);

  const publicId = await redis.get(key);
  if (!publicId) return null;

  const userData = await database.getCredentialsUserById(publicId);
  if (!userData) return null;

  return database.toAuthUser(userData);
};

export const addSession = async (sessionId: string, publicId: string) => {
  const key = sessionKey(sessionId);
  const ttl = durationSeconds(1, 'days');

  await redis.set(key, publicId, 'EX', ttl);
};

export const removeSession = async (sessionId: string) => {
  const key = sessionKey(sessionId);

  await redis.del(key);
};

export const sessionStore = {
  getSession,
  addSession,
  removeSession,
};
