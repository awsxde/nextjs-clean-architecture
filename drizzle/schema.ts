import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  password_hash: text('password_hash').notNull(),
});

export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: integer('expires_at').notNull(),
});

export const records = sqliteTable('records', {
  id: integer('id').primaryKey(),
  description: text('description').notNull(),
  amount: integer('amount').notNull(),
  type: text('type').notNull(),
  date: text('date').notNull(),
  category: text('category').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
});
