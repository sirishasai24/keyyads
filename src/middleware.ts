import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function middleware(request: NextRequest) {
  const adminToken = request.cookies.get('admin-token')?.value

  if (adminToken) {
    try {
      await jwtVerify(adminToken, JWT_SECRET)
      return NextResponse.next()
    } catch (error) {
      console.error('Admin token verification failed:', error)
    }
  }

  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
  matcher: ['/admin/:path*'],
}
