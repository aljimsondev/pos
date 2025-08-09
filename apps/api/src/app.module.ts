import { AuthGuard, AuthModule } from '@mguay/nestjs-better-auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { DATABASE_CONNECTION } from '@repo/core';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ZodValidationPipe } from 'nestjs-zod';
import { DatabaseModule } from 'src/core/modules/db';
import { RedisModule, RedisService } from 'src/core/modules/redis';
import * as schema from './core/auth/schema';
import { ProductModule } from './resources/product/product.module';
import { UserModule } from './resources/user/user.module';

@Module({
  imports: [
    // Load ConfigModule which assists with environment variables
    ConfigModule.forRoot({ envFilePath: '.env' }),
    RedisModule.forRoot({
      socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: (process.env.REDIS_PORT || 6379) as number,
      },
    }),
    AuthModule.forRootAsync({
      useFactory: (db: NodePgDatabase) => {
        return {
          auth: betterAuth({
            database: drizzleAdapter(db, { provider: 'pg', schema }),
            emailAndPassword: {
              enabled: true,
            },
          }),
        };
      },
      inject: [DATABASE_CONNECTION],
      imports: [DatabaseModule],
    }),
    UserModule,
    ProductModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    RedisService,
  ],
})
export class AppModule {}
