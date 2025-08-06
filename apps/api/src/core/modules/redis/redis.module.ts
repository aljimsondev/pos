import { Global, Module, Provider } from '@nestjs/common';
import { createRedisClient } from '@repo/core';
import { RedisClientOptions } from 'redis';

export const REDIS_OPTION = 'REDIS_OPTION';
export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({})
export class RedisModule {
  static forRoot(options: RedisClientOptions) {
    const RedisOptionProvider: Provider = {
      provide: REDIS_OPTION,
      useValue: options,
    };

    const RedisProvider: Provider = {
      provide: REDIS_CLIENT,
      useFactory: async (options: RedisClientOptions) => {
        const client = await createRedisClient(options);

        return client;
      },
      inject: [REDIS_OPTION],
    };

    return {
      global: true,
      module: RedisModule,
      providers: [RedisOptionProvider, RedisProvider],
      exports: [RedisProvider],
    };
  }
}
