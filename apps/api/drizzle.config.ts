import type { Config } from 'drizzle-kit';

export default {
  schema: './src/core/auth/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING!,
  },
} satisfies Config;
