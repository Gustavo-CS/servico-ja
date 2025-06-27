import db from "@/infra/database";
import { agendamentos, disponibilidade, cancelamentos, cliente } from "@root/drizzle/schema";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";

async function getUserIdFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Token ausente");

  const token = authHeader.replace("Bearer ", "");
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const verified = await jwtVerify(token, secret);
  return verified.payload.id;
}

export async function DELETE(request, context) {
  try {
    const userId = await getUserIdFromRequest(request);
    const agendamentoId = Number(context.params.id);

    if (isNaN(agendamentoId)) {
      return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
    }

    // Busca agendamento
    const agendamentoRows = await db
      .select({
        id: agendamentos.id,
        clienteId: agendamentos.clienteId,
        disponibilidadeId: agendamentos.disponibilidadeId,
        status: agendamentos.status,
      })
      .from(agendamentos)
      .where(eq(agendamentos.id, agendamentoId))
      .limit(1);

    const agendamento = agendamentoRows[0] ?? null;

    if (!agendamento) {
      return new Response(JSON.stringify({ error: "Agendamento não encontrado" }), { status: 404 });
    }

    if (agendamento.status === "cancelado") {
      return new Response(JSON.stringify({ error: "Agendamento já está cancelado" }), { status: 400 });
    }

    // Busca disponibilidade (pra saber quem é o profissional)
    const disponibilidadeRows = await db
      .select({ profissionalId: disponibilidade.profissionalId })
      .from(disponibilidade)
      .where(eq(disponibilidade.id, agendamento.disponibilidadeId))
      .limit(1);

    const disponibilidadeRecord = disponibilidadeRows[0] ?? null;

    if (!disponibilidadeRecord) {
      return new Response(JSON.stringify({ error: "Disponibilidade não encontrada" }), { status: 404 });
    }

    const isCliente = userId === agendamento.clienteId;
    const isProfissional = userId === disponibilidadeRecord.profissionalId;

    if (!isCliente && !isProfissional) {
      return new Response(JSON.stringify({ error: "Não autorizado a cancelar o agendamento" }), { status: 403 });
    }

    // Buscar o cliente da tabela 'cliente' com base no usuário (clienteId)
    const clienteRows = await db
      .select({ id: cliente.id })
      .from(cliente)
      .where(eq(cliente.usuarioId, agendamento.clienteId))
      .limit(1);

    const clienteRecord = clienteRows[0] ?? null;

    if (!clienteRecord) {
      return new Response(JSON.stringify({ error: "Cliente não encontrado" }), { status: 404 });
    }

    // Extrai motivo do cancelamento do body
    const { motivo } = await request.json();

    if (!motivo || motivo.trim() === "") {
      return new Response(JSON.stringify({ error: "Motivo do cancelamento obrigatório" }), { status: 400 });
    }

    // Salva o cancelamento
    await db.insert(cancelamentos).values({
      agendamentoId: agendamento.id,
      clienteId: clienteRecord.id,
      motivo,
      canceladoPor: isCliente ? "cliente" : "profissional",
      canceladoEm: new Date().toISOString(),
    });

    // Atualiza o status do agendamento para "cancelado"
    await db
      .update(agendamentos)
      .set({ status: "cancelado" })
      .where(eq(agendamentos.id, agendamento.id));

    // Libera a disponibilidade
    await db
      .update(disponibilidade)
      .set({ reservado: false })
      .where(eq(disponibilidade.id, agendamento.disponibilidadeId));

    return new Response(
      JSON.stringify({ mensagem: "Agendamento cancelado com sucesso" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao cancelar agendamento", error);
    return new Response(JSON.stringify({ error: "Erro interno ao cancelar agendamento" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}