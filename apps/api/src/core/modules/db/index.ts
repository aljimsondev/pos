import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATABASE_CONNECTION, connect } from '@repo/core';
import * as authSchema from 'src/core/auth/schema';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        return connect(
          {
            connectionString: configService.getOrThrow('DB_CONNECTION_STRING'),
          },
          { schema: { ...authSchema } as any },
        );
      },
      inject: [ConfigService], // inject to use service
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
