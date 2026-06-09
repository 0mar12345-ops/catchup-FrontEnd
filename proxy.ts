import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'gclass_token'
const ROLE_COOKIE_NAME = 'catchup_role'

// Return the home path for a given role (used for redirects)
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
  const role = request.cookies.get(ROLE_COOKIE_NAME)?.value

  // Authenticated users visiting public pages go to their role-appropriate home
  if ((pathname === '/' || pathname.startsWith('/login')) && hasAuthCookie) {
    return NextResponse.redirect(new URL(getHomePath(role), request.url))
  }

  // Unauthenticated users cannot access protected routes
  if (isProtectedPath(pathname) && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based route protection — only enforced when the role cookie is present.
  // If the cookie is absent (e.g. a returning session before this feature shipped),
  // we fall through and let auth-cookie presence alone gate access.
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
