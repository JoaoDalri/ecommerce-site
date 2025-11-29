import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Exemplo simples: proteger rota /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Aqui você validaria o token JWT
    // return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}