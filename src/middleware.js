import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const INITIAL_PATH = '/'
const PUBLIC_PATHS = ['/login', '/registro'];

export async function middleware(req) {
  console.log('Middleware rodando para:', req.nextUrl.pathname);
  const { pathname } = req.nextUrl;

  if (pathname == INITIAL_PATH) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.some((p) => pathname.includes(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;
  console.log('Token Existe:', token);

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    console.log('Validando token:', token);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/profile/:path*', '/api/me', '/api/upload_image_profile'],
};
