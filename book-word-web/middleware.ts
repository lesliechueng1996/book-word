import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log('pathname', pathname);

  if (pathname.startsWith('/api/app')) {
    if (pathname !== '/api/app/auth/login') {
      const userId = request.headers.get('user-id');
      if (!userId) {
        return new NextResponse(JSON.stringify({ message: 'Missing UserId' }), {
          status: 400,
        });
      }
    }
    if (!pathname.startsWith('/api/app/auth')) {
      // TODO
    }
  }
}
