import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TreePine, Users, Home, ShoppingBag } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-lg">
              DV
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Damday Village
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-4">
            Smart Carbon-Free Village
          </p>
          
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            A pioneering smart village in the Himalayan Devbhumi region of India, integrating sustainable development, carbon neutrality, and cultural preservation through technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/marketplace">
              <Button size="lg" className="w-full sm:w-auto">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Visit Marketplace
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                User Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Register
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Admin Portal
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <TreePine className="h-12 w-12 text-green-600 mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Carbon Credits</h3>
              <p className="text-sm text-gray-600">25,000 tree planting goal</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <ShoppingBag className="h-12 w-12 text-orange-600 mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Marketplace</h3>
              <p className="text-sm text-gray-600">22+ organic products</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Home className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Homestays</h3>
              <p className="text-sm text-gray-600">Cultural tourism</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Users className="h-12 w-12 text-purple-600 mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-gray-600">Engagement platform</p>
            </div>
          </div>

          <div className="mt-16 p-6 bg-white rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">Development Progress</h2>
            <div className="text-left max-w-2xl mx-auto">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  <span>PR #1: Documentation Foundation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  <span>PR #2: Admin Panel Core (In Progress)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">⏳</span>
                  <span className="text-gray-600">PR #3: User Panel & Authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">⏳</span>
                  <span className="text-gray-600">PR #4-12: Remaining modules</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
