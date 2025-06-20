import db from "@/infra/database";
import { profissional, cliente, usuario } from "@root/drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(req, res) {
  try {
    const profissionaisRaw = await db
      .select()
      .from(profissional)
      .innerJoin(usuario, eq(profissional.usuarioId, usuario.id));

    const clientesRaw = await db
      .select()
      .from(cliente)
      .innerJoin(usuario, eq(cliente.usuarioId, usuario.id));

    const profissionais = profissionaisRaw.map((row) => ({
      ...row,
      tipo: 'profissional',
    }));

    const clientes = clientesRaw.map((row) => ({
      ...row,
      tipo: 'cliente',
    }));

    const data = [...profissionais, ...clientes];

    if (data.length > 0) {
      return res.status(200).json(data);
    } else {
      return res.status(204).end();
    }

  } catch (error) {
    console.error("Erro ao buscar usuarios", error);
    res.status(500);
  }
}