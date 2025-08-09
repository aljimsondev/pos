import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATABASE_CONNECTION, connect } from '@repo/core';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        return connect({
          connectionString: configService.getOrThrow('DB_CONNECTION_STRING'),
        });
      },
      inject: [ConfigService], // inject to use service
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
