import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === '/login' || path === '/signup' ;

  const token = request.cookies.get("token")?.value;

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// matcher tells where midddleware should run
export const config = {
  matcher: [         
    '/login',       // Login page
    '/signup',      // Signup page
    '/profile',     // Profile page
  ],
};
