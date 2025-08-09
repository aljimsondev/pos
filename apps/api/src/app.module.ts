import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { ZodValidationPipe } from 'nestjs-zod';
import { auth } from 'src/core/auth/auth';
import { Brand } from 'src/core/entity/brand.entity';
import { Category } from 'src/core/entity/category.entity';
import { LineItem } from 'src/core/entity/line-items.entity';
import { Photo } from 'src/core/entity/photo.entity';
import { Product } from 'src/core/entity/product.entity';
import { Sale } from 'src/core/entity/sale.entity';
import { Variation } from 'src/core/entity/variation.entity';
import { DatabaseModule } from 'src/core/modules/db';
import { RedisModule, RedisService } from 'src/core/modules/redis';
import { User } from './core/entity/user.entity';
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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Product,
        LineItem,
        Photo,
        Brand,
        Sale,
        Variation,
        Category,
      ],
      synchronize: true, // disable for production
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
    RedisService,
  ],
})
export class AppModule {}
