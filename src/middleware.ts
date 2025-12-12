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
                          path.startsWith('/sample-test');
  // Public paths that should redirect to home if logged in
  const isPublicPath = path === '/auth/login' || path === '/auth/signup';
  
  // Login-required page should redirect logged-in users to home
  const isLoginRequired = path === '/auth/login-required';

  // Get token from cookies
  const token = request.cookies.get("token")?.value;
  
  // Simple token presence check - must be at least 20 chars (valid JWT or token)
  const hasToken = Boolean(token && token.length > 20);

  // Try to decode token to check admin status
  let isAdmin = false;
  let userEmail = "";
  if (token && token.length > 20) {
    try {
      // Check if it's a JWT token (has 3 parts separated by dots)
      const parts = token.split('.');
      if (parts.length === 3) {
        // It's a JWT - decode the payload
        const payload = JSON.parse(atob(parts[1]));
        userEmail = payload.email?.trim().toLowerCase() || "";
        
        // Check both: token's isAdmin flag AND if email is in ADMINS env var
        const adminEmails = process.env.ADMINS ? process.env.ADMINS.split(",").map(e => e.trim().toLowerCase()) : [];
        isAdmin = payload.isAdmin === true || adminEmails.includes(userEmail);
        
        // Debug logging for admin routes
        if (path.startsWith('/admin')) {
          console.log('[Middleware] Admin Route Check (JWT):', {
            path,
            hasToken,
            userEmail,
            isAdminFromToken: payload.isAdmin,
            adminEmails,
            isInAdminList: adminEmails.includes(userEmail),
            finalIsAdmin: isAdmin
          });
        }
      } else {
        // Not a JWT, but token exists - allow it (NextAuth or other session token)
        console.log('[Middleware] Non-JWT token found, allowing access');
        isAdmin = false; // Default to non-admin for non-JWT tokens
      }
    } catch (err) {
      console.log('[Middleware] Token decode error:', err);
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
