import Layout from '@/components/Layout'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Leaf, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function MarketplacePage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    take: 12
  }).catch(() => [])

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500/20 to-green-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Local Marketplace</h1>
            <p className="text-xl text-white/70 mb-8">
              Discover authentic organic products directly from Damday Village artisans
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                <div className="flex items-center space-x-2 text-white">
                  <Leaf className="h-5 w-5 text-green-400" />
                  <span className="font-semibold">100% Organic</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                <div className="flex items-center space-x-2 text-white">
                  <MapPin className="h-5 w-5 text-orange-400" />
                  <span className="font-semibold">Locally Sourced</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Featured Products</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/marketplace/${product.slug}`}>
                  <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer">
                    <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-green-500/20 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image src={product.images[0]} alt={product.name} width={400} height={400} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="h-16 w-16 text-white/40" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-white">₹{product.price}</p>
                        <p className="text-white/60 text-xs">per {'unit'}</p>
                      </div>
                      <Button className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Products Yet</h3>
              <p className="text-white/60">Check back soon for amazing local products!</p>
            </div>
          )}
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Organic Food', 'Handicrafts', 'Textiles', 'Herbs & Spices'].map((category, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all hover:scale-105 cursor-pointer">
                <div className="text-4xl mb-3">🛍️</div>
                <p className="text-white font-semibold">{category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
