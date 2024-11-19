import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const data = await req.json()
    const telegramId = data.telegramId
    const points = data.points

    const user = await prisma.user.update({
      where: { telegramId },
      data: {
        points: { increment: points },
        lastSeen: new Date()
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to increase points:', error)
    return NextResponse.json({ error: 'Failed to increase points' }, { status: 500 })
  }
}
