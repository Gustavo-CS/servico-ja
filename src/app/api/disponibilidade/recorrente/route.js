import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import db from '@/infra/database';
import { disponibilidade } from '@root/drizzle/schema';
import { verifyJWT } from '@/utils/jwt';

async function getUserIdFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = await verifyJWT(token);
    return decoded?.id || null;
  } catch (err) {
    console.error('Erro ao verificar token JWT:', err);
    return null;
  }
}

function gerarHorariosRecorrentes(diasSelecionados, hora) {
  const horarios = [];
  const agora = new Date();

  for (let i = 0; i < 28; i++) {
    const data = new Date(agora);
    data.setDate(agora.getDate() + i);

    if (diasSelecionados.includes(data.getDay())) {
      const [h, m] = hora.split(':');
      data.setHours(parseInt(h), parseInt(m), 0, 0);
      horarios.push(new Date(data));
    }
  }

  return horarios;
}

export async function POST(request) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { dias, hora } = body;

    if (!Array.isArray(dias) || dias.length === 0 || typeof hora !== 'string') {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const datasGeradas = gerarHorariosRecorrentes(dias, hora);

    const novosHorarios = datasGeradas.map((dataHora) => ({
      dataHora: dataHora.toISOString(),
      profissionalId: userId,
    }));

    await db.insert(disponibilidade).values(novosHorarios);

    return NextResponse.json({ message: 'Horários fixos inseridos com sucesso' }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar horários fixos:', error);
    return NextResponse.json({ error: 'Erro ao criar horários fixos' }, { status: 500 });
  }
}
