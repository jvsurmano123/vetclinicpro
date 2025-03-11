import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname === "/login";
    const isAppPage = req.nextUrl.pathname.startsWith("/app");

    // Se estiver na página de login e já estiver autenticado
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/app/dashboard", req.url));
    }

    // Se estiver tentando acessar uma página protegida e não estiver autenticado
    if (isAppPage && !isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true // Deixamos a autorização para ser feita na função middleware
    },
  }
);

export const config = {
  matcher: ["/login", "/app/:path*"]
}; 