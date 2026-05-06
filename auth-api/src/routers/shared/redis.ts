import { Redis } from 'ioredis';

export type RedisKeyPrefix = `${string}:`;

const redisUrl = Bun.env.REDIS_URL || 'redis://localhost:6379';
export const redis = new Redis(redisUrl);
