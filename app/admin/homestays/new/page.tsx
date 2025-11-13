import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import HomestayForm from '@/components/admin/HomestayForm'

export default async function NewHomestayPage() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Add New Homestay</h1>
      <HomestayForm />
    </div>
  )
}
