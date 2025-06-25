import db from "@/infra/database";
import { disponibilidade } from "@root/drizzle/schema";
import { eq } from "drizzle-orm";
import { verifyJWT } from "@/utils/jwt";

export async function GET(req) {
  try {
    // Pega token do header Authorization: Bearer <token>
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Token ausente" }), { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    
    // Verifica token e pega payload
    const payload = await verifyJWT(token);
    const profissionalId = payload.id;

    // Consulta só do profissional logado
    const horarios = await db
      .select()
      .from(disponibilidade)
      .where(eq(disponibilidade.profissionalId, profissionalId))
      .orderBy(disponibilidade.dataHora);

    return new Response(JSON.stringify(horarios), {
      status: horarios.length > 0 ? 200 : 204,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao buscar disponibilidades", error);
    return new Response(JSON.stringify({ error: "Erro interno no servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Token ausente" }), { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const payload = await verifyJWT(token);
    const profissionalId = payload.id;

    const { data_hora } = await req.json();

    if (!data_hora) {
      return new Response(
        JSON.stringify({ error: "data_hora é obrigatório" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const dataHoraIso = new Date(data_hora).toISOString();
    if (isNaN(Date.parse(dataHoraIso))) {
      return new Response(
        JSON.stringify({ error: "Formato de data inválido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await db.insert(disponibilidade).values({
      profissionalId,
      dataHora: dataHoraIso,
      reservado: false,
    });

    return new Response(
      JSON.stringify({ mensagem: "Horário adicionado com sucesso" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao adicionar disponibilidade", error);
    return new Response(
      JSON.stringify({ error: "Erro interno ao adicionar disponibilidade" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}