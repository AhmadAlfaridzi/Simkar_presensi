import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_super_aman'
const PUBLIC_PATHS = ['/api/auth/login', '/login', '/favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value || ''

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  try {
    jwt.verify(token, JWT_SECRET)
    return NextResponse.next()
  } catch (error) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'], 
}
