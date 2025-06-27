import { pgTable, unique, integer, text, varchar, date, timestamp, foreignKey, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const usuario = pgTable("usuario", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "usuario_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	nome: text().notNull(),
	cpf: varchar({ length: 11 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	telefone: varchar({ length: 15 }).notNull(),
	endereco: text().notNull(),
	dataNascimento: date("data_nascimento").notNull(),
	senha: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	regiaoAdministrativa: text().notNull(),
	fotoPerfilUrl: varchar({ length: 2048 }).default(''),
	descricaoPerfil: text("descricao_perfil"),
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

export const avaliacao = pgTable("avaliacao", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({
    name: "avaliacao_id_seq",
    startWith: 1,
    increment: 1,
    cache: 1,
  }),
  idAvaliado: integer("id_avaliado").notNull(),
  tipo_avaliacao: varchar({ length: 20 }).notNull(),
  idAvaliador: integer("id_avaliador").notNull(),
  score: integer("score").notNull(),
  comentario: text("comentario"),
  criadoEm: timestamp("criado_em").defaultNow(),
}, (table) => [
  foreignKey({
    columns: [table.idAvaliado],
    foreignColumns: [usuario.id],
    name: "avaliacao_avaliado_fk",
  })
    .onDelete("cascade")
    .onUpdate("cascade"),

  foreignKey({
    columns: [table.idAvaliador],
    foreignColumns: [usuario.id],
    name: "avaliacao_avaliador_fk",
  })
    .onDelete("cascade")
    .onUpdate("cascade"),
]);

export const neonTable = pgTable("neonTable", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "noTable4_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	titulo: text().notNull(),
	column1: text("column_1"),
});

export const disponibilidade = pgTable("disponibilidade", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "disponibilidade_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	profissionalId: integer("profissional_id").notNull(),
	dataHora: timestamp("data_hora", { mode: 'string' }).notNull(),
	reservado: boolean().default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.profissionalId],
			foreignColumns: [usuario.id],
			name: "disponibilidade_profissional_id_profissional_id_fk"
		}).onDelete("cascade"),
]);

export const agendamentos = pgTable("agendamentos", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "agendamentos_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	disponibilidadeId: integer("disponibilidade_id").notNull(),
	clienteId: integer("cliente_id"),
	confirmado: boolean().default(false).notNull(),
	status: text().default('pendente').notNull(),
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

export const cancelamentos = pgTable("cancelamentos", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "cancelamentos_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	agendamentoId: integer("agendamento_id").notNull(),
	clienteId: integer("cliente_id").notNull(),
	motivo: text().notNull(),
	canceladoPor: text("cancelado_por").notNull(),
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
]);
