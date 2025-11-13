import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ShoppingCart, Truck, Shield, Leaf, Star } from 'lucide-react'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: {
      slug: params.slug,
      active: true
    },
    include: {
      category: true
    }
  })

  if (!product) {
    notFound()
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      active: true,
      id: { not: product.id }
    },
    take: 4
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/marketplace" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Link>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                DV
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div>
            <div className="aspect-square bg-white rounded-lg shadow-lg relative overflow-hidden mb-4">
              {product.featured && (
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded z-10">
                  <Star className="w-4 h-4 inline mr-1 fill-white" />
                  Featured
                </div>
              )}
              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded z-10">
                  {discountPercent}% OFF
                </div>
              )}
              <div className="w-full h-full flex items-center justify-center text-9xl">
                🌿
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Fresh organic product from Damday Village
            </p>
          </div>

          {/* Product Info */}
          <div>
            <div className="text-sm text-blue-600 font-medium mb-2">
              {product.category?.name}
            </div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-green-600">₹{product.price}</span>
              {hasDiscount && (
                <>
                  <span className="text-2xl text-gray-500 line-through">₹{product.compareAtPrice}</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            <div className="mb-6">
              <span className={`text-lg font-medium ${product.quantity > 10 ? 'text-green-600' : product.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                {product.quantity > 0 ? `${product.quantity} units in stock` : 'Out of stock'}
              </span>
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.weight && (
              <div className="mb-6">
                <span className="text-sm text-gray-600">Weight: {product.weight} kg</span>
              </div>
            )}

            <div className="flex gap-4 mb-8">
              <Button size="lg" className="flex-1" disabled={product.quantity === 0}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" disabled={product.quantity === 0}>
                Buy Now
              </Button>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Leaf className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="font-medium">100% Organic</div>
                    <div className="text-xs text-gray-600">Chemical-free</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Truck className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="font-medium">Fast Delivery</div>
                    <div className="text-xs text-gray-600">Within 3-5 days</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="font-medium">Quality Assured</div>
                    <div className="text-xs text-gray-600">Verified products</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                  <div>
                    <div className="font-medium">Local Support</div>
                    <div className="text-xs text-gray-600">Supports farmers</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/marketplace/${relatedProduct.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🌿
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 line-clamp-2">{relatedProduct.name}</h4>
                      <div className="text-xl font-bold text-green-600">₹{relatedProduct.price}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
