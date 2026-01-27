// middleware.ts
// Auth middleware for session refresh and route protection
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession, shouldSkipAuth } from '@/lib/supabase/middleware';

// Protected routes - require authentication
const protectedRoutes = ['/dashboard'];

// Public-only routes - redirect authenticated users away
const publicOnlyRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files and non-auth routes
  if (shouldSkipAuth(pathname)) {
    return NextResponse.next();
  }

  // Only run session refresh for routes that need it
  const needsAuth = protectedRoutes.some(route => pathname.startsWith(route)) ||
                    publicOnlyRoutes.includes(pathname);

  if (!needsAuth) {
    return NextResponse.next();
  }

  const { user, supabaseResponse } = await updateSession(request);

  // Check if accessing protected route without session
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // Check if accessing public-only route with session
  const isPublicOnlyRoute = publicOnlyRoutes.includes(pathname);
  if (isPublicOnlyRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
