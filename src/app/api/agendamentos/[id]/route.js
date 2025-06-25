import db from "@/infra/database";
import { agendamentos, disponibilidade, cancelamentos } from '@root/drizzle/schema';
import { eq } from 'drizzle-orm';
import { jwtVerify } from "jose";

async function getUserIdFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Token ausente");

  const token = authHeader.replace("Bearer ", "");
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const verified = await jwtVerify(token, secret);
  return verified.payload.id;
}

export async function DELETE(request, { params }) {
  try {
    const userId = await getUserIdFromRequest(request);
    const id = Number(params.id);

    if (!id) {
      return new Response(JSON.stringify({ error: "ID do agendamento inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(request.url);
    const motivo = url.searchParams.get("motivo");
    if (!motivo) {
      return new Response(JSON.stringify({ error: "Motivo do cancelamento é obrigatório" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verifica se o agendamento pertence ao usuário que está cancelando
    const agendamento = await db.query.agendamentos.findFirst({
      where: eq(agendamentos.id, id),
    });

    if (!agendamento) {
      return new Response(JSON.stringify({ error: "Agendamento não encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Opcional: cheque se o usuário é o dono do agendamento (cliente) ou o profissional
    if (agendamento.clienteId !== userId) {
      return new Response(JSON.stringify({ error: "Sem permissão para cancelar este agendamento" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Insere cancelamento e libera slot
    await db.insert(cancelamentos).values({
      agendamentoId: id,
      clienteId: agendamento.clienteId,
      motivo,
      canceladoPor: userId,
    });

    await db.update(agendamentos).set({ confirmado: false }).where(eq(agendamentos.id, id));
    // Se quiser liberar o slot (disponibilidade), pode atualizar aqui também

    return new Response(JSON.stringify({ mensagem: "Agendamento cancelado com sucesso" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao cancelar agendamento", error);
    return new Response(JSON.stringify({ error: "Erro interno ao cancelar agendamento" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
