import db from "@/infra/database";
import { profissional, cliente, usuario } from "@root/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    if (tipo === "cliente") {
      //falta melhorar as tabelas pra fazer a busca
    } else {

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