import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Star, Search, Filter, TrendingUp, Award, Leaf, Truck, Shield, Heart } from 'lucide-react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

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
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0)

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-green-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
                <Leaf className="w-5 h-5" />
                <span className="text-sm font-bold">100% ORGANIC</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Organic Himalayan Products</h1>
              <p className="text-xl md:text-2xl mb-8 text-white/95">
                Supporting local farmers while enjoying fresh, chemical-free produce from Damday Village
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                <div className="glass-dark rounded-xl px-8 py-4 backdrop-blur-sm">
                  <div className="text-4xl font-bold">{products.length}</div>
                  <div className="text-sm opacity-90">Products Available</div>
                </div>
                <div className="glass-dark rounded-xl px-8 py-4 backdrop-blur-sm">
                  <div className="text-4xl font-bold">{categories.length}</div>
                  <div className="text-sm opacity-90">Categories</div>
                </div>
                <div className="glass-dark rounded-xl px-8 py-4 backdrop-blur-sm">
                  <div className="text-4xl font-bold">100%</div>
                  <div className="text-sm opacity-90">Organic</div>
                </div>
                <div className="glass-dark rounded-xl px-8 py-4 backdrop-blur-sm">
                  <div className="text-4xl font-bold">⭐ 4.9</div>
                  <div className="text-sm opacity-90">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters & Widgets */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search Widget */}
              <div className="glass rounded-2xl shadow-xl border border-white/60 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-orange-600" />
                  Search Products
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Categories Filter */}
              <div className="glass rounded-2xl shadow-xl border border-white/60 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-green-600" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <Link href="/marketplace">
                    <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-orange-50 hover:to-green-50 transition-all">
                      All Products ({products.length})
                    </Button>
                  </Link>
                  {categories.map((category) => {
                    const count = products.filter(p => p.categoryId === category.id).length
                    return (
                      <Link key={category.id} href={`/marketplace?category=${category.slug}`}>
                        <Button variant="ghost" className="w-full justify-between hover:bg-gradient-to-r hover:from-orange-50 hover:to-green-50 transition-all">
                          <span>{category.name}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{count}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="glass rounded-2xl shadow-xl border border-white/60 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-green-50 p-2 rounded transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Under ₹100</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-green-50 p-2 rounded transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-green-600" />
                    <span className="text-sm">₹100 - ₹500</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-green-50 p-2 rounded transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-green-600" />
                    <span className="text-sm">₹500 - ₹1000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-green-50 p-2 rounded transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Over ₹1000</span>
                  </label>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="glass rounded-2xl shadow-xl border border-white/60 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-green-50 p-2 rounded transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-green-600" defaultChecked />
                    <span className="text-sm">In Stock ({products.filter(p => p.quantity > 0).length})</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-green-50 p-2 rounded transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Featured ({featuredProducts.length})</span>
                  </label>
                </div>
              </div>

              {/* Why Shop Widget */}
              <div className="glass rounded-2xl shadow-xl border border-white/60 p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  Why Shop With Us?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Leaf className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">100% Organic</div>
                      <div className="text-xs text-gray-600">Chemical-free produce</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Fast Delivery</div>
                      <div className="text-xs text-gray-600">Same-day local delivery</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Quality Guaranteed</div>
                      <div className="text-xs text-gray-600">100% satisfaction</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Support Farmers</div>
                      <div className="text-xs text-gray-600">Direct from producers</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Widget */}
              <div className="glass rounded-2xl shadow-xl border border-white/60 p-6 bg-gradient-to-br from-orange-50 to-amber-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  Marketplace Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Products</span>
                    <span className="font-bold text-orange-600">{products.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">In Stock</span>
                    <span className="font-bold text-green-600">{products.filter(p => p.quantity > 0).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Featured</span>
                    <span className="font-bold text-purple-600">{featuredProducts.length}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-600">Total Value</span>
                    <span className="font-bold text-blue-600">₹{totalInventoryValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Sort & View Options */}
              <div className="glass rounded-2xl shadow-lg border border-white/60 p-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Showing</span>
                    <span className="font-bold text-gray-900">{products.length}</span>
                    <span className="text-sm text-gray-600">products</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                      <option>Sort by: Featured</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Name: A to Z</option>
                      <option>Newest First</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Featured Products */}
              {featuredProducts.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />
                    <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Products */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">All Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}

function ProductCard({ product }: { product: any }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <Link href={`/marketplace/${product.slug}`}>
      <Card className="glass hover:shadow-2xl transition-all duration-300 cursor-pointer h-full group hover:-translate-y-1 border border-white/60">
        <div className="aspect-square bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
          {product.featured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full z-10 shadow-lg font-bold">
              ⭐ Featured
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs px-3 py-1 rounded-full z-10 shadow-lg font-bold">
              {discountPercent}% OFF
            </div>
          )}
          <div className="w-full h-full flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-300">
            🌿
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <CardContent className="p-5">
          <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">
            {product.category?.name}
          </div>
          <h4 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h4>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">₹{product.compareAtPrice}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm font-semibold ${product.quantity > 10 ? 'text-green-600' : product.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </span>
            <Button 
              size="sm" 
              disabled={product.quantity === 0}
              className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
