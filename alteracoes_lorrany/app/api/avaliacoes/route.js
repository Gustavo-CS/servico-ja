import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { avaliacoes, servicosRealizados } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req) {
  const { profissionalId, usuario, servico, nota, comentario } = await req.json();

  if (!profissionalId || !usuario || nota == null) {
    return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 });
  }

  const servicoAutorizado = await db.select().from(servicosRealizados).where(
    and(
      eq(servicosRealizados.profissionalId, profissionalId),
      eq(servicosRealizados.usuario, usuario)
    )
  );

  if (servicoAutorizado.length === 0) {
    return NextResponse.json({ error: 'Usuário não pode avaliar esse profissional.' }, { status: 403 });
  }

  const result = await db.insert(avaliacoes).values({
    profissionalId,
    usuario,
    servico,
    nota,
    comentario,
  }).returning();

  return NextResponse.json(result);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const profissionalId = Number(searchParams.get('profissionalId'));

  if (!profissionalId) {
    return NextResponse.json({ error: 'ID do profissional não informado.' }, { status: 400 });
  }

  const data = await db.select().from(avaliacoes).where(eq(avaliacoes.profissionalId, profissionalId));

  const media =
    data.reduce((acc, curr) => acc + curr.nota, 0) / (data.length || 1);

  return NextResponse.json({
    media: media.toFixed(1),
    totalAvaliacoes: data.length,
    avaliacoes: data,
  });
}