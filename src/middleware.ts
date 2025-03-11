import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verifica se o usuário tem uma clínica associada
  if (!token.clinicId && request.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/register-clinic', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*']
}; 