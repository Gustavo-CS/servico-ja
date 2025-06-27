import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const profissionais = pgTable('profissionais', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
});

export const servicosRealizados = pgTable('servicos_realizados', {
  id: serial('id').primaryKey(),
  profissionalId: integer('profissional_id').notNull(),
  usuario: varchar('usuario', { length: 100 }).notNull(),
  servico: varchar('servico', { length: 100 }),
  data: timestamp('data').defaultNow(),
});

export const avaliacoes = pgTable('avaliacoes', {
  id: serial('id').primaryKey(),
  profissionalId: integer('profissional_id')
    .references(() => profissionais.id)
    .notNull(),
  usuario: varchar('usuario', { length: 100 }).notNull(),
  servico: varchar('servico', { length: 100 }),
  nota: integer('nota').notNull(),
  comentario: varchar('comentario', { length: 500 }),
  criadoEm: timestamp('criado_em').defaultNow(),
});