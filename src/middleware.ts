import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Додаємо базові заголовки безпеки
  response.headers.set('x-middleware-cache', 'no-cache');
  response.headers.set('x-dns-prefetch-control', 'on');
  response.headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains');
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('referrer-policy', 'origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    // Матчимо всі шляхи окрім статичних ресурсів
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};