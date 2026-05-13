import { RedisClient } from 'bun';

import { env } from '../../env';

export type RedisKeyPrefix = `${string}:`;

export const redis = new RedisClient(env.REDIS_URL);
