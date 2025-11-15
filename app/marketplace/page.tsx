import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Star } from 'lucide-react'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function MarketplacePage() {
  const products = await prisma.product.findMany({
    where: {
      active: true
    },
    include: {
      category: true
    },
    orderBy: {
      featured: 'desc'
    }
  })

  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { name: 'asc' }
  })

  const featuredProducts = products.filter(p => p.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                DV
              </div>
              <div>
                <h1 className="text-2xl font-bold">Damday Marketplace</h1>
                <p className="text-sm text-gray-600">Fresh Organic Products from the Himalayas</p>
              </div>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart (0)
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Organic Himalayan Products</h2>
          <p className="text-xl mb-6">
            Supporting local farmers while enjoying fresh, chemical-free produce from Damday Village
          </p>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold">{products.length}</div>
              <div className="text-sm">Products Available</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold">{categories.length}</div>
              <div className="text-sm">Categories</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm">Organic</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Categories Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Shop by Category</h3>
          <div className="flex gap-3 flex-wrap">
            <Link href="/marketplace">
              <Button variant="outline">All Products</Button>
            </Link>
            {categories.map((category) => (
              <Link key={category.id} href={`/marketplace?category=${category.slug}`}>
                <Button variant="outline">{category.name}</Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              Featured Products
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <div>
          <h3 className="text-2xl font-bold mb-6">All Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

function ProductCard({ product }: { product: any }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <Link href={`/marketplace/${product.slug}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {product.featured && (
            <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded z-10">
              Featured
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10">
              {discountPercent}% OFF
            </div>
          )}
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🌿
          </div>
        </div>
        <CardContent className="p-4">
          <div className="text-xs text-blue-600 font-medium mb-1">
            {product.category?.name}
          </div>
          <h4 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h4>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">₹{product.compareAtPrice}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${product.quantity > 10 ? 'text-green-600' : product.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </span>
            <Button size="sm" disabled={product.quantity === 0}>
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
