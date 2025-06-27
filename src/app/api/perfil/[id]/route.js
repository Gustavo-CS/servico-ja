import { NextResponse } from 'next/server';
import db from '@/infra/database';
import { usuario, cliente, profissional } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req, {params}) {
  const { id } = await params;
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Token não fornecido.' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 403 });
  }

  // Verifica o tipo de conta (cliente ou profissional)
  const result = await db
      .select({
        nome: usuario.nome,
        email: usuario.email,
        descricao: usuario.descricao_perfil,
        telefone: usuario.telefone,
        regiao: usuario.regiaoAdministrativa,
        especialidade: profissional.especialidade,
      })
      .from(profissional)
      .innerJoin(usuario, eq(profissional.usuarioId, usuario.id))
      .where(eq(profissional.id, Number(id)))
      .limit(1);


  const data = result[0];
  return NextResponse.json({
    nome: data.nome,
    email: data.email,
    descricao_perfil: data.descricao,
    telefone: data.telefone,
    regiaoAdministrativa: data.regiao,
    regiaoAdministrativa: data.especialidade,
  });
}
