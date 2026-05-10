import { redis, RedisKeyPrefix } from '../shared/redis';
import { durationSeconds, hashValue } from '../shared/utils';

const USERS_PREFIX: RedisKeyPrefix = 'oauth:users:';
const SESSION_PREFIX: RedisKeyPrefix = 'oauth:sessions:';

const usersKey = (userId: string) => {
  return `${USERS_PREFIX}${userId}`;
};

const sessionKey = (sessionId: string) => {
  const hashedSessionId = hashValue(sessionId);
  return `${SESSION_PREFIX}${hashedSessionId}`;
};

const addUser = async (userData: { id: string }) => {
  const key = usersKey(userData.id);

  const userExists = await redis.exists(key);
  if (userExists) return;

  await redis.set(key, JSON.stringify(userData));
};

const addSession = async (sessionId: string, userId: string) => {
  const key = sessionKey(sessionId);
  const ttl = durationSeconds(1, 'days');

  await redis.set(key, userId, 'EX', ttl);
};

const removeSession = async (sessionId: string) => {
  const key = sessionKey(sessionId);

  await redis.del(key);
};

const getSession = async (sessionId: string) => {
  const key = sessionKey(sessionId);

  const userId = await redis.get(key);
  if (!userId) return null;

  const userKey = usersKey(userId);

  const user = await redis.get(userKey);
  if (!user) return null;

  return JSON.parse(user) as unknown;
};

export const oAuthStore = {
  addUser,
  addSession,
  removeSession,
  getSession,
};
