'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface Category {
  id: string
  name: string
}

interface Product {
  id?: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number
  cost?: number
  categoryId: string
  sku: string
  quantity: number
  trackInventory: boolean
  weight?: number
  featured: boolean
  active: boolean
}

interface ProductFormProps {
  categories: Category[]
  product?: Product
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    compareAtPrice: product?.compareAtPrice || 0,
    cost: product?.cost || 0,
    categoryId: product?.categoryId || categories[0]?.id || '',
    sku: product?.sku || '',
    quantity: product?.quantity || 0,
    trackInventory: product?.trackInventory !== false,
    weight: product?.weight || 0,
    featured: product?.featured || false,
    active: product?.active !== false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }))

    // Auto-generate slug from name
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = product?.id ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const method = product?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save product')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Himalayan Apples"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  placeholder="himalayan-apples"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md min-h-[120px]"
                  placeholder="Fresh organic apples from the Himalayan region..."
                />
              </div>

              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  placeholder="FRUIT-APL-001"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="150"
                  />
                </div>

                <div>
                  <Label htmlFor="compareAtPrice">Compare at Price (₹)</Label>
                  <Input
                    id="compareAtPrice"
                    name="compareAtPrice"
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={handleChange}
                    placeholder="200"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cost">Cost (₹)</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="100"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="trackInventory"
                  name="trackInventory"
                  checked={formData.trackInventory}
                  onChange={handleChange}
                  className="rounded"
                />
                <Label htmlFor="trackInventory">Track inventory</Label>
              </div>

              {formData.trackInventory && (
                <div>
                  <Label htmlFor="quantity">Quantity in Stock *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    placeholder="100"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="1.0"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="categoryId">Category *</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="rounded"
                />
                <Label htmlFor="active">Active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {error && (
              <div className="p-3 bg-red-50 text-red-800 rounded border border-red-200">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : product?.id ? 'Update Product' : 'Create Product'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/products')}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
