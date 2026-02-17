import { defineConfig } from 'drizzle-kit';

const url = process.env.DATABASE_URL || 'file:sqlite.db';
const isLocal = url === 'file:sqlite.db';

export default defineConfig({
  dialect: isLocal ? 'turso' : 'sqlite',
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dbCredentials: isLocal
    ? {
        url,
      }
    : {
        url,
        authToken: process.env.DATABASE_AUTH_TOKEN,
      },
});
