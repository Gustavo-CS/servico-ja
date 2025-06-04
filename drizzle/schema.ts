import { pgTable, integer, varchar, date, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const neonTable = pgTable("neonTable", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "noTable4_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	titulo: text().notNull(),
	column1: text("column_1"),
});

export const usuario = pgTable("usuario", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "usuario_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
  nome: text("nome").notNull(),
  cpf: varchar("cpf", { length: 11 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  telefone: varchar("telefone", { length: 15 }).notNull(),
  endereco: text("endereco").notNull(),
  data_nascimento: date("data_nascimento").notNull(),
});

export const profissional = pgTable("profissional", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "profissional_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
  usuarioId: integer("usuario_id").references(() => usuario.id).notNull(),
  especialidade: text("especialidade"),
});

export const cliente = pgTable("cliente", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "cliente_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
  usuarioId: integer("usuario_id").references(() => usuario.id).notNull(),
  observacao: text("observacao"),
});
