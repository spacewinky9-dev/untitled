import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import TourForm from '@/components/admin/TourForm'

export default async function NewTourPage() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Add New Tour</h1>
      <TourForm />
    </div>
  )
}
