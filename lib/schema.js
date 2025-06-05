import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const professionals = pgTable('professionals', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const ratings = pgTable('ratings', {
  id: serial('id').primaryKey(),
  professionalId: integer('professional_id')
    .references(() => professionals.id)
    .notNull(),
  score: integer('score').notNull(),
  comment: varchar('comment', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
});