import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const session = await auth()
  
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-gray-600 mt-1">Create a new product for the marketplace</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
