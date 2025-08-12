import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_super_aman'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { customId: decoded.id },
      select: {
        customId: true,
        username: true,
        email: true,
        role: true,
        karyawan: {
          select: {
            name: true,
            position: true,
            department: true,
            image: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error('🔴 USER ROUTE ERROR:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
