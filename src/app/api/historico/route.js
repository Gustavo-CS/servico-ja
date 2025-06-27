import db from "@/infra/database";
import { profissional, cliente, usuario } from "@root/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    let profissionaisRaw = [];
    let clientesRaw = [];

    if (tipo == "profissional") {
      profissionaisRaw = await db
        .select()
        .from(profissional)
        .innerJoin(usuario, eq(profissional.usuarioId, usuario.id));
    } else if (tipo == "cliente") {
      clientesRaw = await db
        .select()
        .from(cliente)
        .innerJoin(usuario, eq(cliente.usuarioId, usuario.id));
    }

    let profissionais = [];
    if (profissionaisRaw.length > 0) {
      profissionais = profissionaisRaw.map((row) => ({
        ...row,
        tipo: 'profissional',
      }));
    }

    let clientes = [];
    if (clientesRaw.length > 0) {
      clientes = clientesRaw.map((row) => ({
        ...row,
        tipo: 'cliente',
      }));
    }

    const data = [...profissionais, ...clientes];

    if (data.length > 0) {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(null, { status: 204 });
    }

  } catch (error) {
    console.error("Erro ao buscar usuarios", error);
    return new Response(JSON.stringify({ error: "Erro interno no servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}