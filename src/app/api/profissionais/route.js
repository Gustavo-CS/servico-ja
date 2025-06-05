import { db } from '@/infra/database';
import { profissionais } from '@/drizzle/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await db.select().from(profissionais);
  return NextResponse.json(result);
}
