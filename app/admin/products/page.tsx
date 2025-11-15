import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductActions from '@/components/admin/ProductActions'
import AdminSidebar from '@/components/admin/Sidebar'

export default async function AdminProductsPage() {
  const session = await auth()
  
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const categories = await prisma.category.findMany()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-1">Manage marketplace products</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {products.filter(p => p.active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {products.filter(p => p.featured).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Stock</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sku}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {product.category?.name}
                      </span>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">₹{product.price}</div>
                        {product.compareAtPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            ₹{product.compareAtPrice}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`font-medium ${product.quantity > 10 ? 'text-green-600' : product.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {product.quantity} units
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div>
                          <span className={`px-2 py-1 rounded text-xs ${product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {product.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {product.featured && (
                          <div>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <ProductActions 
                        productId={product.id}
                        productName={product.name}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
