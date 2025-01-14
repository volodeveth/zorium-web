import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Генеруємо nonce для додаткової безпеки
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const cspHeader = `
    default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;
    script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https: chrome-extension:;
    style-src 'self' 'unsafe-inline' https: chrome-extension:;
    img-src 'self' data: https: blob: chrome-extension:;
    font-src 'self' data: https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    frame-src 'self' https: chrome-extension:;
    manifest-src 'self';
    media-src 'self' https:;
    worker-src 'self' blob:;
    child-src 'self' blob:;
    connect-src 'self' https: wss: data: blob:;
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // Встановлюємо заголовки безпеки
  const securityHeaders = {
    'Content-Security-Policy': cspHeader,
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Додаємо всі заголовки до відповіді
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icons/ (icons directory)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icons/).*)',
  ],
};