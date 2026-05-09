import { RedisClient } from 'bun';

export type RedisKeyPrefix = `${string}:`;

const redisUrl = Bun.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new RedisClient(redisUrl);
