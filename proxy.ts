import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'gclass_token'

function isProtectedPath(pathname: string) {
  return (
    pathname === '/' ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/course') ||
    pathname.startsWith('/student')
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasAuthCookie = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value)

  if (pathname.startsWith('/login') && hasAuthCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isProtectedPath(pathname) && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/course/:path*', '/student/:path*'],
}
