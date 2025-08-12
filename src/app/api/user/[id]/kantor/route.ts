import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

export async function GET(req: Request, { params }: Params) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        kantor: {
          select: {
            id: true,
            nama: true,
            latitude: true,
            longitude: true,
            radius: true,
          },
        },
      },
    })

    if (!user?.kantor) {
      return NextResponse.json({ error: 'Kantor not found' }, { status: 404 })
    }

    return NextResponse.json(user.kantor)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
