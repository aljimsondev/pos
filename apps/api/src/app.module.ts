import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { ZodValidationPipe } from 'nestjs-zod';
import { auth } from 'src/core/auth/auth';
import { DatabaseModule } from 'src/core/modules/db';
import { RedisModule, RedisService } from 'src/core/modules/redis';
import { ProductModule } from './resources/product/product.module';
import { UserModule } from './resources/user/user.module';

@Module({
  imports: [
    // Load ConfigModule which assists with environment variables
    DatabaseModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    RedisModule.forRoot({
      socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: (process.env.REDIS_PORT || 6379) as number,
      },
    }),
    AuthModule.forRoot(auth),
    UserModule,
    ProductModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    RedisService,
  ],
})
export class AppModule {}
