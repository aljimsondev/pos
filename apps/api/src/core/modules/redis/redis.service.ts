import { Inject, Injectable } from '@nestjs/common';
import { Cache } from '@repo/core';
import * as Redis from 'redis';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisService extends Cache {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis.RedisClientType,
  ) {
    super(redis);
  }
}
