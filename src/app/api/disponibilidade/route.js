import db from "@/infra/database";
import { disponibilidade } from "@root/drizzle/schema";
import { eq } from "drizzle-orm";
import { verifyJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Token ausente" }), { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    
    const payload = await verifyJWT(token);
    const profissionalIdDoToken = payload.id;

    const url = new URL(req.url);
    const profissionalIdQuery = url.searchParams.get('profissional_id');

    const profissionalId = profissionalIdQuery ?? profissionalIdDoToken;

    const horarios = await db
      .select()
      .from(disponibilidade)
      .where(eq(disponibilidade.profissionalId, profissionalId))
      .orderBy(disponibilidade.dataHora);

    return new Response(JSON.stringify(horarios), {
      status: 200,
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
      return NextResponse.json({ error: "Token ausente" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const payload = await verifyJWT(token);
    const profissionalId = payload.id;

    const { data_hora } = await req.json();

    if (!data_hora) {
      return NextResponse.json({ error: "data_hora é obrigatório" }, { status: 400 });
    }

    const dataHoraIso = new Date(data_hora).toISOString();
    if (isNaN(Date.parse(dataHoraIso))) {
      return NextResponse.json({ error: "Formato de data inválido" }, { status: 400 });
    }

    await db.insert(disponibilidade).values({
      profissionalId,
      dataHora: dataHoraIso,
      reservado: false,
    });

    return NextResponse.json({ mensagem: "Horário adicionado com sucesso" }, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar disponibilidade", error);
    return NextResponse.json({ error: "Erro interno ao adicionar disponibilidade" }, { status: 500 });
  }
}