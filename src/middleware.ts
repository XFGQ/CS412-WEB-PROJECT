import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Cookie that checks if the user is logged in
  const hasSession = request.cookies.has('user_session')
  
  // Check if the requested page is an auth (login/register) page
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register')

  // CASE 1: If user is NOT logged in and tries to access protected pages -> Redirect to Login
  if (!hasSession && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // CASE 2: If user IS already logged in and tries to access Login/Register -> Redirect to Dashboard
  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Define which paths the middleware should run on (excluding API and static files)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}