import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isAuthenticated = Boolean(token);

  const isPrivateRoute = pathname.startsWith('/history');
  const isAuthRoute = pathname.startsWith('/auth/sign-in') || pathname.startsWith('/auth/sign-up');

  if (!isAuthenticated && isPrivateRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/401';
    return NextResponse.rewrite(url, { status: 401 });
  }

  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/history/:path*', '/auth/sign-in', '/auth/sign-up'],
};
