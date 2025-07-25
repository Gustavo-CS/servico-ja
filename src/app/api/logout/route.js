import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Deslogado com sucesso.' });

  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0), // expira imediatamente
  });

  return response;
}
