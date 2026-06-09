import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'gclass_token'
const JWT_COOKIE_NAME = 'gclass_jwt'

// Decode the JWT payload (base64url middle segment) and extract the role claim.
// Returns undefined if the token is missing, malformed, or has no role claim.
function getRoleFromJwt(token: string | undefined): string | undefined {
  if (!token) return undefined
  try {
    const payload = token.split('.')[1]
    if (!payload) return undefined
    // JWT uses base64url — swap URL-safe chars before decoding
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    const parsed = JSON.parse(json) as { role?: string }
    return parsed.role
  } catch {
    return undefined
  }
}

function getHomePath(role: string | undefined): string {
  if (role === 'admin') return '/admin'
  if (role === 'student') return '/student/dashboard'
  return '/dashboard'
}

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/course') ||
    pathname.startsWith('/student') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/behaviour') ||
    pathname.startsWith('/admin')
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasAuthCookie = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value)
  const role = getRoleFromJwt(request.cookies.get(JWT_COOKIE_NAME)?.value)

  // Authenticated users visiting the landing page go to their role-appropriate home.
  if (pathname === '/' && hasAuthCookie) {
    return NextResponse.redirect(new URL(getHomePath(role), request.url))
  }

  // Unauthenticated users cannot access protected routes
  if (isProtectedPath(pathname) && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based route protection — only enforced when the JWT contains a role claim.
  if (hasAuthCookie && role) {
    const isAdminRoute = pathname.startsWith('/admin')
    const isTeacherRoute =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/course') ||
      pathname.startsWith('/behaviour') ||
      pathname.startsWith('/settings')
    // Only /student/dashboard is student-exclusive; /student/[id] is teacher-accessible
    const isStudentDashboard =
      pathname === '/student/dashboard' || pathname.startsWith('/student/dashboard/')

    if (isAdminRoute && role !== 'admin') {
      return NextResponse.redirect(new URL(getHomePath(role), request.url))
    }
    if (isTeacherRoute && role !== 'teacher') {
      return NextResponse.redirect(new URL(getHomePath(role), request.url))
    }
    if (isStudentDashboard && role !== 'student') {
      return NextResponse.redirect(new URL(getHomePath(role), request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/course/:path*',
    '/student/:path*',
    '/settings/:path*',
    '/behaviour/:path*',
    '/admin/:path*',
  ],
}
