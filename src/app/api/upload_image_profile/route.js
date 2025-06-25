import { NextResponse } from 'next/server';
import cloudinary from '@root/lib/cloudinary';
import { eq } from 'drizzle-orm';
import db from '@/infra/database';
import { usuario } from '@/drizzle/schema';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  // 1. Verifica o token no cabeçalho Authorization
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

  // 2. Processa o FormData
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'Arquivo ausente.' }, { status: 400 });
  }

  // 3. Busca usuário pelo e-mail do token
  const [user] = await db.select().from(usuario).where(eq(usuario.email, email));
  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
  }

  // 4. Deleta imagem anterior, se existir
  if (user.fotoPerfilUrl) {
    const publicId = getPublicIdFromUrl(user.fotoPerfilUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  }

  // 5. Faz upload da nova imagem
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'servico-ja' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });

  // 6. Atualiza o campo fotoPerfilUrl
  await db
    .update(usuario)
    .set({ fotoPerfilUrl: result.secure_url })
    .where(eq(usuario.id, user.id));

  return NextResponse.json({ secure_url: result.secure_url });
}

// Função auxiliar para extrair public_id da URL antiga
function getPublicIdFromUrl(url) {
  try {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1]; // ex: abc123.jpg
    const folder = parts[parts.length - 2];   // ex: fotos_perfil
    return `${folder}/${fileName.split('.')[0]}`;
  } catch {
    return null;
  }
}