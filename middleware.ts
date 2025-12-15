import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';


//without login cannnot access these routes
const protectedRoutes = ['/chat', '/dashboard', '/profile', '/groups'];

//is login or register route
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  // Kullanıcının gitmek istediği yol
  const { pathname } = request.nextUrl;
  
//take token from cookie
  const token = request.cookies.get('token')?.value;

  // is token valid
  let verifiedToken = null;
  if (token) {
    verifiedToken = await verifyJWT(token);
  }
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // wrong token or no token go to login page
    if (!verifiedToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    // if already logged in redirect to main page
    if (verifiedToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/chat'; // TO MAİN PAGE
      return NextResponse.redirect(url);
    }
  }

   return NextResponse.next();
} 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
