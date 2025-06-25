import { NextRequest, NextResponse } from 'next/server';
import db from '@/infra/database.js';
import { usuario, cliente, profissional } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req) {
  const { email, senha } = await req.json();

  if (!email || !senha) {
    return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 });
  }

  try {
    // Busca usuário pelo email
    const [user] = await db.select().from(usuario).where(eq(usuario.email, email));

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
    }

    // Verifica se é cliente ou profissional
    const [isCliente] = await db.select().from(cliente).where(eq(cliente.usuarioId, user.id));
    const [isProfissional] = await db.select().from(profissional).where(eq(profissional.usuarioId, user.id));

    let tipoConta = null;
    if (isCliente) tipoConta = 'cliente';
    else if (isProfissional) tipoConta = 'profissional';

    // Gera token JWT
    const token = jwt.sign(
      {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipoConta,
      },
      JWT_SECRET,
      { expiresIn: '6h' }
    );

    const response = NextResponse.json({
      message: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipoConta,
        fotoPerfilUrl: user.fotoPerfilUrl,
      },
    }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 dia
      sameSite: 'lax',
    });

    return response;

  } catch (err) {
    console.error('Erro ao realizar login:', err);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}