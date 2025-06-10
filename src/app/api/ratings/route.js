import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ratings } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  const { professionalId, score, comment } = await req.json();

  if (!professionalId || !score) {
    return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 });
  }

  const result = await db.insert(ratings).values({
    professionalId,
    score,
    comment,
  }).returning();

  return NextResponse.json(result);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const professionalId = Number(searchParams.get('professionalId'));

  if (!professionalId) {
    return NextResponse.json({ error: 'ID do profissional não informado.' }, { status: 400 });
  }

  const data = await db.select().from(ratings).where(eq(ratings.professionalId, professionalId));

  const average =
    data.reduce((acc, curr) => acc + curr.score, 0) / (data.length || 1);

  return NextResponse.json({
    average: average.toFixed(1),
    totalRatings: data.length,
    ratings: data,
  });
}