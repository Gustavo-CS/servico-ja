import db from "@/infra/database";
import { profissional, cliente, usuario, agendamentos, disponibilidade } from "@root/drizzle/schema";
import { eq } from "drizzle-orm";
import { alias } from 'drizzle-orm/sqlite-core'; // ou 'drizzle-orm/pg-core' se for PostgreSQL

export async function GET(request, { params }) {
  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    const usuarioCliente = alias(usuario, 'usuarioCliente');
    const usuarioProfissional = alias(usuario, 'usuarioProfissional');

    let atendimentos = [];
    if (tipo === "cliente") {
      const clienteRaw = await db
        .select()
        .from(agendamentos)
        .innerJoin(cliente, eq(cliente.id, agendamentos.clienteId))
        .innerJoin(usuarioCliente, eq(usuarioCliente.id, cliente.usuarioId))
        .innerJoin(disponibilidade, eq(disponibilidade.id, agendamentos.disponibilidadeId))
        .innerJoin(profissional, eq(profissional.id, disponibilidade.profissionalId))
        .innerJoin(usuarioProfissional, eq(profissional.usuarioId, usuarioProfissional.id))
        .where(eq(agendamentos.clienteId, id))
      atendimentos = clienteRaw.map((row) => ({
        ...row,
        tipo: 'cliente',
      }));
    } else {
      const profissionalRaw = await db
        .select()
        .from(agendamentos)
        .innerJoin(cliente, eq(cliente.id, agendamentos.clienteId))
        .innerJoin(usuarioCliente, eq(usuarioCliente.id, cliente.usuarioId))
        .innerJoin(disponibilidade, eq(disponibilidade.id, agendamentos.disponibilidadeId))
        .innerJoin(profissional, eq(profissional.id, disponibilidade.profissionalId))
        .innerJoin(usuarioProfissional, eq(profissional.usuarioId, usuarioProfissional.id))
        .where(eq(disponibilidade.profissionalId, id))
      atendimentos = profissionalRaw.map((row) => ({
        ...row,
        tipo: 'profissional',
      }));
    }

    if (atendimentos.length > 0) {
      return new Response(JSON.stringify(atendimentos), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Erro ao buscar usuarios", error);
    return new Response(JSON.stringify({ error: "Erro interno no servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}