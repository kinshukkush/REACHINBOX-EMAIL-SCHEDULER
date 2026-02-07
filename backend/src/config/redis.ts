import { RedisOptions } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

export const redisConfig: RedisOptions | string = process.env.REDIS_URL || {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
};
