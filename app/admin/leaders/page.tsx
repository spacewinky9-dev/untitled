import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/admin/Sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function AdminLeadersPage() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const leaders = await prisma.leader.findMany({
    orderBy: { order: 'asc' }
  })

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Leaders Management</h1>
              <p className="text-gray-600">Manage PM, CM, and Gram Pradhan</p>
            </div>
            <Link href="/admin/leaders/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Leader
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaders.map(leader => (
              <Card key={leader.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{leader.name}</h3>
                  <p className="text-sm text-gray-600">{leader.position}</p>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/admin/leaders/${leader.id}/edit`}>
                      <Button size="sm" variant="outline">Edit</Button>
                    </Link>
                    <Button size="sm" variant="destructive">Delete</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
