import db from "@/infra/database";
import {cancelamentos, agendamentos, cliente, profissional, usuario, disponibilidade} from "@root/drizzle/schema";
import { eq, or } from "drizzle-orm";
import { jwtVerify } from "jose";

async function getUserIdFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Token ausente");

  const token = authHeader.replace("Bearer ", "");
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const verified = await jwtVerify(token, secret);
  return verified.payload.id;
}

export async function GET(request) {
  try {
    const userId = await getUserIdFromRequest(request);

    // Ver se é profissional
    const profRow = await db.select().from(profissional).where(eq(profissional.usuarioId, userId)).limit(1);
    const isProf = profRow.length > 0;

    // Ver se é cliente
    const cliRow = await db.select().from(cliente).where(eq(cliente.usuarioId, userId)).limit(1);
    const isCli = cliRow.length > 0;

    if (!isProf && !isCli) {
      return new Response(JSON.stringify({ error: "Usuário não é cliente nem profissional." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    let whereClause;

    if (isProf) {
      whereClause = eq(disponibilidade.profissionalId, userId);
    } else {
      whereClause = eq(cancelamentos.clienteId, cliRow[0].id);
    }

    const resultado = await db
      .select({
        id: cancelamentos.id,
        motivo: cancelamentos.motivo,
        canceladoPor: cancelamentos.canceladoPor,
        canceladoEm: cancelamentos.canceladoEm,
        clienteNome: usuario.nome,
        clienteId: cliente.id,
        profissionalNome: usuario.nome,
        dataHora: disponibilidade.dataHora,
      })
      .from(cancelamentos)
      .leftJoin(agendamentos, eq(cancelamentos.agendamentoId, agendamentos.id))
      .leftJoin(disponibilidade, eq(agendamentos.disponibilidadeId, disponibilidade.id))
      .leftJoin(cliente, eq(cancelamentos.clienteId, cliente.id))
      .leftJoin(usuario, or(
        eq(cliente.usuarioId, usuario.id),       // nome do cliente
        eq(disponibilidade.profissionalId, usuario.id) // nome do profissional
      ))
      .where(whereClause);

    if (!resultado.length) {
      return new Response(null, { status: 204 });
    }

    return new Response(JSON.stringify(resultado), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Erro ao buscar cancelamentos:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
