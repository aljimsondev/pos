import { DrizzleConfig } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolConfig } from 'pg';

export const connect = (config: PoolConfig, options: DrizzleConfig) => {
  try {
    const pool = new Pool(config);

    const connection = drizzle(pool, options);

    if (connection.$client) {
      console.info('✅ Database connection initialized!');
    } else {
      console.warn('❌ Database connection failed!');
    }

    return connection;
  } catch (e) {
    throw new Error('Error initializing database connection!' + e);
  }
};

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';
