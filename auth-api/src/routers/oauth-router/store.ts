import { redis, RedisKeyPrefix } from '../shared/redis';
import { durationSeconds, hashValue } from '../shared/utils';
import { database } from '../shared/db';

const SESSION_PREFIX: RedisKeyPrefix = 'oauth:sessions:';

const sessionKey = (sessionId: string) => {
  const hashedSessionId = hashValue(sessionId);
  return `${SESSION_PREFIX}${hashedSessionId}`;
};

const addSession = async (sessionId: string, providerId: string) => {
  const key = sessionKey(sessionId);
  const ttl = durationSeconds(1, 'days');

  await redis.set(key, providerId, 'EX', ttl);
};

const removeSession = async (sessionId: string) => {
  const key = sessionKey(sessionId);

  await redis.del(key);
};

const getSession = async (sessionId: string) => {
  const key = sessionKey(sessionId);

  const providerId = await redis.get(key);
  if (!providerId) return null;

  const user = await database.getOAuthUser(providerId);

  if (!user) return null;

  return database.toAuthUser(user);
};

export const oAuthStore = {
  addSession,
  removeSession,
  getSession,
};
