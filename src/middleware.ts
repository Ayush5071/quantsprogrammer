import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (path.startsWith('/_next') || path.startsWith('/api') || path.includes('.')) {
    return NextResponse.next();
  }

  // Interview-related routes
  const isInterviewRoute = path.startsWith('/interview') || path.startsWith('/top-interviews');

  // Public paths that should redirect to profile if logged in
  const isPublicPath = path === '/login' || path === '/signup';
  
  // Login-required page should redirect logged-in users to home
  const isLoginRequired = path === '/auth/login-required';

  // Try to get token from cookies (standard) and from headers (edge case)
  let token = request.cookies.get("token")?.value;
  if (!token) {
    // Some deployments may send cookies in headers
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/token=([^;]+)/);
      if (match) token = match[1];
    }
  }

  // Debug logging to console (temporary)
  console.log('Middleware Debug:', {
    path,
    isInterviewRoute,
    token: token ? 'present' : 'absent',
    cookieHeader: request.headers.get('cookie'),
    cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]))
  });

  // Redirect logged-in users away from public pages
  if ((isPublicPath || isLoginRequired) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Block interview routes for not-logged-in users ONLY
  if (isInterviewRoute && !token) {
    console.log('Redirecting to login-required for path:', path);
    // Redirect to a beautiful themed page for login-required
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
