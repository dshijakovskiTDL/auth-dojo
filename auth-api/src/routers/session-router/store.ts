import { LoginUser } from '../shared/credentials';
import { redis, RedisKeyPrefix } from '../shared/redis';
import { durationSeconds, hashValue } from '../shared/utils';

export const STORE_PREFIX: RedisKeyPrefix = 'session:';

const sessionKey = (sessionId: string) => {
  const hashedSessionId = hashValue(sessionId);
  return `${STORE_PREFIX}${hashedSessionId}`;
};

export const getSession = async (sessionId: string) => {
  const key = sessionKey(sessionId);

  const user = await redis.get(key);
  if (!user) return null;

  return JSON.parse(user) as LoginUser;
};

export const addSession = async (sessionId: string, user: LoginUser) => {
  const key = sessionKey(sessionId);
  const ttl = durationSeconds(1, 'days');

  await redis.set(key, JSON.stringify(user), 'EX', ttl);
};

export const removeSession = async (sessionId: string) => {
  const key = sessionKey(sessionId);

  await redis.del(key);
};

export const store = {
  getSession,
  addSession,
  removeSession,
};
