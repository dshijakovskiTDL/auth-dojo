import { database } from '../shared/db';
import { redis, RedisKeyPrefix } from '../shared/redis';
import { durationSeconds, hashValue } from '../shared/utils';

const STORE_PREFIX: RedisKeyPrefix = '2fa:session:';
const PRE_AUTH_PREFIX: RedisKeyPrefix = '2fa:pre_auth:';

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

export const addSession = async (sessionId: string, userId: string) => {
  const key = sessionKey(sessionId);
  const ttl = durationSeconds(1, 'days');

  await redis.set(key, userId, 'EX', ttl);
};

export const removeSession = async (sessionId: string) => {
  const key = sessionKey(sessionId);

  await redis.del(key);
};

const preAuthKey = (preAuthToken: string) => {
  const hashedPreAuthToken = hashValue(preAuthToken);
  return `${PRE_AUTH_PREFIX}${hashedPreAuthToken}`;
};

type PreAuthEntry = { userId: string; hashedOtpCode: string };
const addPreAuth = async (preAuthToken: string, entry: PreAuthEntry) => {
  const key = preAuthKey(preAuthToken);
  const ttl = durationSeconds(10, 'minutes');

  await redis.set(key, JSON.stringify(entry), 'EX', ttl);
};

const getPreAuth = async (preAuthToken: string) => {
  const key = preAuthKey(preAuthToken);

  const entry = await redis.get(key);
  if (!entry) return null;

  return JSON.parse(entry) as PreAuthEntry;
};

const removePreAuth = async (preAuthToken: string) => {
  const key = preAuthKey(preAuthToken);

  await redis.del(key);
};

export const twoFactorStore = {
  getSession,
  addSession,
  removeSession,

  addPreAuth,
  getPreAuth,
  removePreAuth,
};
