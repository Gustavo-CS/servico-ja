import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/schema.js',
  out: './drizzle',
  dialect: "postgresql",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!,
  },
} 

satisfies Config;