import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash'),
  github_id: text('github_id').unique(),
  google_id: text('google_id').unique(),
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
