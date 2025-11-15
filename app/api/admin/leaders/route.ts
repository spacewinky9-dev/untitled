import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const leaders = await prisma.leader.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })
    return Response.json(leaders)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch leaders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const leader = await prisma.leader.create({ data })
    return Response.json(leader)
  } catch (error) {
    return Response.json({ error: 'Failed to create leader' }, { status: 500 })
  }
}
