import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Kullanıcının giriş yapıp yapmadığını kontrol eden çerez
  const hasSession = request.cookies.has('user_session')
  
  // Gidilmek istenen sayfa auth (login/register) sayfası mı?
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register')

  // DURUM 1: Giriş yapmamış biri içerideki sayfalara girmeye çalışıyorsa -> Login'e at
  if (!hasSession && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // DURUM 2: Zaten giriş yapmış biri Login'e girmeye çalışıyorsa -> Dashboard'a at
  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Hangi yollarda çalışacağını belirtiyoruz (API ve statik dosyalar hariç)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}