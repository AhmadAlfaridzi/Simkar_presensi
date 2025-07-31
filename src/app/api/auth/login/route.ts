import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password harus diisi' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { username: username.trim() }
    })

    if (!user) {
      await bcrypt.compare(password, '$2a$10$fakehashforprotection')
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    if (user.status !== 'AKTIF') {
      return NextResponse.json({ error: 'Akun tidak aktif. Hubungi admin.' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        position: user.position,
        department: user.department,
        image: user.image,
      }
    })
  } catch (error) {
    console.error('🔴 LOGIN ERROR:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}