import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { Pool } from 'pg';
import * as schema from 'src/core/auth/schema';

// export const auth = betterAuth({
//   database: drizzleAdapter(
// connect(
//   { connectionString: process.env.DB_CONNECTION_STRING },
//   { schema: { ...authSchema } as any },
// ),
//     { provider: 'pg', schema: { ...authSchema } as any },
//   ),
//   emailAndPassword: {
//     enabled: true,
//   },
// });

const db = new Pool({ connectionString: process.env.DB_CONNECTION_STRING });

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
});
