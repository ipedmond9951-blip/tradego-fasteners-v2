import { NextResponse, type NextRequest } from 'next/server';

/**
 * Force www canonical at the edge.
 * Eliminates GSC "网页会自动重定向" errors by redirecting
 * https://tradego-fasteners.com/* to https://www.tradego-fasteners.com/* (308).
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  // Match non-www OR http
  if (host === 'tradego-fasteners.com' || host.startsWith('tradego-fasteners.com:')) {
    const url = request.nextUrl.clone();
    url.host = 'www.tradego-fasteners.com';
    url.protocol = 'https';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except _next, favicon, images with extensions
    '/((?!_next/|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)',
  ],
};
