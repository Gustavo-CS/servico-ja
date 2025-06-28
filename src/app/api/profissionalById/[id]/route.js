import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import db from '@/infra/database';
import { avaliacao, usuario, profissional, cliente } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(req, {params}) {
  const { id } = await params;
  const cookies = req.cookies;
  const token = cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });



  const result = await db
  .select({ profissionalId: profissional.id })
  .from(profissional)
  .where(eq(profissional.usuarioId, id));

  const row = result[0];
  console.log(row)

  if (!row) {
    return NextResponse.json({ error: 'Profissional não encontrado.' }, { status: 404 });
  }

  return NextResponse.json({profissionalId: row.profissionalId});
}