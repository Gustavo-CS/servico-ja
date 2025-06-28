import { NextResponse } from 'next/server';
import db from '@/infra/database';
import { usuario, cliente, profissional, avaliacao } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { like, and, sql, avg } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req, {params}) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'ID não fornecido.' }, { status: 400 });
  }
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

  
  const result = await db
      .select({
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        descricao: usuario.descricaoPerfil,
        regiao: usuario.regiaoAdministrativa,
        fotoPerfilUrl: usuario.fotoPerfilUrl,
        especialidade: profissional.especialidade,
        id: usuario.id,
      })
      .from(profissional)
      .innerJoin(usuario, eq(profissional.usuarioId, usuario.id))
      .where(eq(profissional.id, Number(id)))

  // reviews
  let reviews;
  let media;
  const [prof] = await db
    .select({ usuarioId: profissional.usuarioId })
    .from(profissional)
    .where(eq(profissional.id, Number(id)));

  if (!prof) {
    return [];
  } else {
    const usuarioAvaliadoId = prof.usuarioId;


    reviews = await db
      .select({
        id: avaliacao.id,
        score: avaliacao.score,
        comentario: avaliacao.comentario,
        criadoEm: avaliacao.criadoEm,
        avaliadorId: avaliacao.idAvaliador,
        avaliadorNome: usuario.nome,
        avaliadorFoto: usuario.fotoPerfilUrl,
      })
      .from(avaliacao)
      .innerJoin(usuario, eq(avaliacao.idAvaliador, usuario.id))
      .where(and(
        eq(avaliacao.idAvaliado, usuarioAvaliadoId),
      ))
      .orderBy(avaliacao.criadoEm, 'desc');


      media = await db
        .select({
          media: avg(avaliacao.score),
        })
        .from(avaliacao)
        .where(eq(avaliacao.idAvaliado, usuarioAvaliadoId));
  }


  const data = result[0];
  const avaliacaoMedia = media[0].media ?? null;
  if (!data) {
    // If no data is found, return a 404 Not Found response
    return NextResponse.json({ error: 'Perfil não encontrado.' }, { status: 404 });
  }

  return NextResponse.json({
    nome: data.nome,
    email: data.email,
    descricao_perfil: data.descricao,
    telefone: data.telefone,
    fotoPerfilUrl: data.fotoPerfilUrl,
    regiaoAdministrativa: data.regiao,
    especialidade: data.especialidade,
    id: data.id,
    reviews: reviews,
    avaliacaoMedia: avaliacaoMedia,
  });
}
