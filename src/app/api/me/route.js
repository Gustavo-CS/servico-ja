import { NextResponse } from 'next/server';
import db from '@/infra/database';
import { usuario, cliente, profissional } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
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

  const email = decoded.email;

  const [user] = await db.select().from(usuario).where(eq(usuario.email, email));
  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
  }

  // Verifica o tipo de conta (cliente ou profissional)
  const [clienteResult] = await db.select().from(cliente).where(eq(cliente.usuarioId, user.id));
  const [profissionalResult] = await db.select().from(profissional).where(eq(profissional.usuarioId, user.id));

  let tipoConta = null;
  if (clienteResult) tipoConta = 'cliente';
  if (profissionalResult) tipoConta = 'profissional';

  return NextResponse.json({
    id: user.id,
    nome: user.nome,
    email: user.email,
    cpf: user.cpf,
    telefone: user.telefone,
    endereco: user.endereco,
    dataNascimento: user.dataNascimento,
    fotoPerfilUrl: user.fotoPerfilUrl,
    tipoConta,
  });
}
