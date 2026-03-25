import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that don't require authentication
const publicPaths = ['/student/login', '/student/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Protect /student routes
  if (pathname.startsWith('/student')) {
    // Check for auth cookie
    const authToken = request.cookies.get('sb-access-token')

    if (!authToken) {
      // Redirect to login
      const loginUrl = new URL('/student/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/student/:path*'],
}
