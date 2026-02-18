import 'server-only';
import { createClient, ResultSet } from '@libsql/client/web';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { SQLiteTransaction } from 'drizzle-orm/sqlite-core';

import { sessions, users, records } from './schema';

// Setup sqlite database connection
const client = createClient({
  url: process.env.DATABASE_URL ?? 'file:sqlite.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
export const db = drizzle(client, {
  schema: { users, sessions, records },
});

// Setup lucia adapter
export const luciaAdapter = new DrizzleSQLiteAdapter(db, sessions, users);

// Export Transaction type to be used in repositories
type Schema = {
  users: typeof users;
  sessions: typeof sessions;
  records: typeof records;
};
export type Transaction = SQLiteTransaction<
  'async',
  ResultSet,
  Schema,
  ExtractTablesWithRelations<Schema>
>;
