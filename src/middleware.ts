import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (path.startsWith('/_next') || path.startsWith('/api') || path.includes('.')) {
    return NextResponse.next();
  }

  // Admin routes that require admin privileges
  const isAdminRoute = path.startsWith('/admin');

  // Interview-related routes that require authentication
  const isProtectedRoute = path.startsWith('/interview') || 
                          path.startsWith('/top-interviews') || 
                          path.includes('interview-history') ||
                          path.startsWith('/prepare-interviews') ||
                          path.startsWith('/placement-data') ||
                          path.startsWith('/profile') ||
                          path.startsWith('/roadmap-test') ||
                          path.startsWith('/sample-test') ||
                          path.startsWith('/company-problems');

  // Public paths that should redirect to home if logged in
  const isPublicPath = path === '/auth/login' || path === '/auth/signup';
  
  // Login-required page should redirect logged-in users to home
  const isLoginRequired = path === '/auth/login-required';

  // Get token from cookies
  const token = request.cookies.get("token")?.value;
  
  // Simple token presence check
  const hasToken = Boolean(token && token.length > 10);

  // Try to decode token to check admin status (basic check)
  let isAdmin = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAdmin = payload.isAdmin === true;
    } catch {
      isAdmin = false;
    }
  }

  // Redirect logged-in users away from auth pages
  if ((isPublicPath || isLoginRequired) && hasToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Block admin routes for non-admin users
  if (isAdminRoute) {
    if (!hasToken) {
      return NextResponse.redirect(new URL('/auth/login-required', request.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Block protected routes for users without tokens
  if (isProtectedRoute && !hasToken) {
    return NextResponse.redirect(new URL('/auth/login-required', request.url));
  }

  return NextResponse.next();
}

// matcher tells where middleware should run
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
