import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_super_aman'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password harus diisi' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
      select: {
        customId: true,
        username: true,
        email: true,
        role: true,
        passwordHash: true, 
        karyawan: {
          select: {
            customId: true,
            name: true,
            status: true,
            position: true,
            department: true,
            image: true,
          },
        },
  },
})

    if (!user) {
      await bcrypt.compare(password, '$2a$10$fakehashforprotection')
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    if (user.karyawan?.status !== 'AKTIF') {
      return NextResponse.json({ error: 'Akun tidak aktif. Hubungi admin.' }, { status: 403 })
    }

    const token = jwt.sign(
      {
        id: user.customId,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    return NextResponse.json({
      success: true,
      token, 
      data: {
        id: user.customId,
        username: user.username,
        email: user.email,
        role: user.role,
        karyawan: {
          name: user.karyawan?.name || '',
          position: user.karyawan?.position || '',
          department: user.karyawan?.department || '',
          image: user.karyawan?.image || '',
        },
      },
    })
  } catch (error) {
    console.error('🔴 LOGIN ERROR:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}