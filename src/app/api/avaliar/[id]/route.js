import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import db from '@/infra/database';
import { avaliacao } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req, {params}) {
  const { id } = await params;
  const cookies = req.cookies;
  const token = cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });

  let userId;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    userId = payload.id;
  } catch {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 403 });
  }

  const { tipo_avaliacao, score, comentario } = await req.json();

  if (
    !['cliente_avaliado', 'profissional_avaliado'].includes(tipo_avaliacao) ||
    typeof score !== 'number' ||
    score < 0 ||
    score > 5
  ) {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
  }

  await db.insert(avaliacao).values({
    tipo_avaliacao,
    idAvaliado: id,
    idAvaliador: userId,
    score,
    comentario: comentario || null,
  });

  return NextResponse.json({ message: 'Avaliação registrada.' });
}