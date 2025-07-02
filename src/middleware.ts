import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (path.startsWith('/_next') || path.startsWith('/api') || path.includes('.')) {
    return NextResponse.next();
  }

  // Interview-related routes that require authentication
  const isInterviewRoute = path.startsWith('/interview') || 
                          path.startsWith('/top-interviews') || 
                          path.includes('interview-history') ||
                          path.startsWith('/prepare-interviews') ||
                          path.startsWith('/placement-data');

  // Public paths that should redirect to home if logged in
  const isPublicPath = path === '/auth/login' || path === '/auth/signup';
  
  // Login-required page should redirect logged-in users to home
  const isLoginRequired = path === '/auth/login-required';

  // Try to get token from cookies
  let token = request.cookies.get("token")?.value;
  
  // Validate token if present
  let isValidToken = false;
  if (token) {
    try {
      jwt.verify(token, process.env.TOKEN_SECRET!);
      isValidToken = true;
    } catch (error) {
      console.log('Invalid token detected, clearing it');
      isValidToken = false;
      // Clear invalid token
      const response = NextResponse.next();
      response.cookies.delete('token');
    }
  }

  // Debug logging (remove in production)
  console.log('Middleware Debug:', {
    path,
    isInterviewRoute,
    token: token ? 'present' : 'absent',
    isValidToken,
    userAgent: request.headers.get('user-agent')?.slice(0, 50)
  });

  // Redirect logged-in users away from auth pages
  if ((isPublicPath || isLoginRequired) && isValidToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Block interview routes for users without valid tokens
  if (isInterviewRoute && !isValidToken) {
    console.log('Redirecting to login-required for path:', path);
    return NextResponse.redirect(new URL('/auth/login-required', request.url));
  }

  return NextResponse.next();
}

// matcher tells where middleware should run
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
