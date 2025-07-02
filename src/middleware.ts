import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

  // Get token from cookies - simplified approach
  const token = request.cookies.get("token")?.value;
  
  // Simple token presence check (we'll let the API validate the token properly)
  const hasToken = Boolean(token && token.length > 10);

  // Debug logging (remove in production)
  console.log('Middleware Debug:', {
    path,
    isInterviewRoute,
    hasToken,
    tokenLength: token?.length || 0
  });

  // Redirect logged-in users away from auth pages
  if ((isPublicPath || isLoginRequired) && hasToken) {
    console.log('Redirecting authenticated user away from auth page');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Block interview routes for users without tokens
  if (isInterviewRoute && !hasToken) {
    console.log('Redirecting unauthenticated user to login-required for path:', path);
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
