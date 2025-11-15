import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const settings = await prisma.settings.findMany()
    return Response.json(settings)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    
    // Update or create setting
    const setting = await prisma.settings.upsert({
      where: { key: data.key },
      update: { value: data.value },
      create: { key: data.key, value: data.value }
    })

    return Response.json(setting)
  } catch (error) {
    console.error('Settings update error:', error)
    return Response.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
