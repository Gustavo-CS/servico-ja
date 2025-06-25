import db from "@/infra/database";
import { agendamentos, cliente, disponibilidade, usuario } from '@root/drizzle/schema';
import { eq } from 'drizzle-orm';
import { jwtVerify } from 'jose';

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

    // Aqui filtro os agendamentos do cliente (pode adaptar para profissional também)
    const resultado = await db
      .select({
        id: agendamentos.id,
        cliente_id: agendamentos.clienteId,
        data_hora: disponibilidade.dataHora,
        cliente_nome: usuario.nome,
        confirmado: agendamentos.confirmado,
      })
      .from(agendamentos)
      .leftJoin(disponibilidade, eq(agendamentos.disponibilidadeId, disponibilidade.id))
      .leftJoin(cliente, eq(agendamentos.clienteId, cliente.id))
      .leftJoin(usuario, eq(cliente.usuarioId, usuario.id))
      .where(eq(agendamentos.clienteId, userId)); // filtra só os do cliente logado

    if (resultado.length > 0) {
      return new Response(JSON.stringify(resultado), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(null, { status: 204 });
    }
  } catch (error) {
    console.error("Erro ao buscar agendamentos", error);
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request) {
  try {
    // 1. Pegar o token do header Authorization
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Token ausente ou inválido" }), { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");

    // 2. Verificar e decodificar o token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    let payload;
    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch (err) {
      return new Response(JSON.stringify({ error: "Token inválido ou expirado" }), { status: 401 });
    }

    const cliente_id = payload.id; // ou outro campo que contenha o id do usuário no JWT

    // 3. Pegar o slot_id do corpo da requisição
    const { slot_id } = await request.json();

    if (!slot_id) {
      return new Response(JSON.stringify({ error: "slot_id é obrigatório" }), { status: 400 });
    }

    // 4. Criar o agendamento com o cliente_id extraído do token
    await db.insert(agendamentos).values({
      disponibilidadeId: slot_id,
      clienteId: cliente_id,
      confirmado: false,
    });

    // 5. Atualizar o slot para reservado = true
    await db.update(disponibilidade).set({ reservado: true }).where(eq(disponibilidade.id, slot_id));

    return new Response(JSON.stringify({ mensagem: "Agendamento criado com sucesso" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao criar agendamento", error);
    return new Response(JSON.stringify({ error: "Erro interno ao criar agendamento" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PATCH(request) {
  try {
    const { id, profissionalAceitou } = await request.json();

    if (!id || !profissionalAceitou) {
      return new Response(JSON.stringify({ error: 'id e profissionalAceitou são obrigatórios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.update(agendamentos)
      .set({ confirmado: true })
      .where(eq(agendamentos.id, id));

    return new Response(JSON.stringify({ mensagem: 'Agendamento confirmado com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Erro ao confirmar agendamento", error);
    return new Response(JSON.stringify({ error: 'Erro interno ao confirmar agendamento' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
