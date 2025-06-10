import { pgTable, unique, integer, text, varchar, date, foreignKey, timestamp, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const usuario = pgTable("usuario", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "usuario_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	nome: text().notNull(),
	cpf: varchar({ length: 11 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	telefone: varchar({ length: 15 }).notNull(),
	endereco: text().notNull(),
	dataNascimento: date("data_nascimento").notNull(),
}, (table) => [
	unique("usuario_cpf_unique").on(table.cpf),
	unique("usuario_email_unique").on(table.email),
]);

export const cliente = pgTable("cliente", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "cliente_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	usuarioId: integer("usuario_id").notNull(),
	observacao: text(),
}, (table) => [
	foreignKey({
			columns: [table.usuarioId],
			foreignColumns: [usuario.id],
			name: "cliente_usuario_id_usuario_id_fk"
		}),
]);

export const profissional = pgTable("profissional", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "profissional_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	usuarioId: integer("usuario_id").notNull(),
	especialidade: text(),
}, (table) => [
	foreignKey({
			columns: [table.usuarioId],
			foreignColumns: [usuario.id],
			name: "profissional_usuario_id_usuario_id_fk"
		}),
]);

export const disponibilidade = pgTable("disponibilidade", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "disponibilidade_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	profissionalId: integer("profissional_id").notNull(),
	dataHora: timestamp("data_hora", { mode: 'string' }).notNull(),
	reservado: boolean().default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.profissionalId],
			foreignColumns: [usuario.id],
			name: "disponibilidade_profissional_id_usuario_id_fk"
		}).onDelete("cascade"),
]);

export const agendamentos = pgTable("agendamentos", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "agendamentos_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	disponibilidadeId: integer("disponibilidade_id").notNull(),
	clienteId: integer("cliente_id"),
	confirmado: boolean().default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.disponibilidadeId],
			foreignColumns: [disponibilidade.id],
			name: "agendamentos_disponibilidade_id_disponibilidade_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.clienteId],
			foreignColumns: [usuario.id],
			name: "agendamentos_cliente_id_usuario_id_fk"
		}).onDelete("cascade"),
]);

export const cancelamentos = pgTable("cancelamentos", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "cancelamentos_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	agendamentoId: integer("agendamento_id").notNull(),
	clienteId: integer("cliente_id").notNull(),
	motivo: text().notNull(),
	canceladoPor: integer("cancelado_por"),
	canceladoEm: timestamp("cancelado_em", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.agendamentoId],
			foreignColumns: [agendamentos.id],
			name: "cancelamentos_agendamento_id_agendamentos_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.clienteId],
			foreignColumns: [cliente.id],
			name: "cancelamentos_cliente_id_cliente_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.canceladoPor],
			foreignColumns: [usuario.id],
			name: "cancelamentos_cancelado_por_usuario_id_fk"
		}).onDelete("set null"),
]);

export const neonTable = pgTable("neonTable", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "noTable4_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	titulo: text().notNull(),
	column1: text("column_1"),
});

export const ratings = pgTable('ratings', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "ratings_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
  professionalId: integer('professional_id')
    .references(() => profissional.id)
    .notNull(),
  score: integer('score').notNull(),
  comment: varchar('comment', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
});