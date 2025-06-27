import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import db from '@/infra/database';
import { usuario } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }

  let payload;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const jwtRes = await jwtVerify(token, secret);
    payload = jwtRes.payload;
  } catch {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 403 });
  }

  const body = await req.json();
  const { descricao_perfil } = body;
  if (typeof descricao_perfil !== 'string' || descricao_perfil.length > 240) {
    return NextResponse.json({ error: 'Descrição inválida.' }, { status: 400 });
  }

  await db
    .update(usuario)
    .set({ descricao_perfil })
    .where(eq(usuario.id, payload.id));

  return NextResponse.json({ message: 'Descrição atualizada.' });
}