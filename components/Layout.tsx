'use client'

import { ReactNode, useEffect } from 'react'
import Link from 'next/link'
import { Home, ShoppingBag, Building2, MapPin, Leaf, Users, Award, Store } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
  showStats?: boolean
}

export default function Layout({ children, showStats = true }: LayoutProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js'
    script.async = true
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).particlesJS) {
        (window as any).particlesJS('particles-js', {
          particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: ['#ff6b35', '#f7931e', '#4ade80'] },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#fbbf24', opacity: 0.2, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: true }
          }
        })
      }
    }
    if (!document.querySelector('script[src*="particles"]')) {
      document.body.appendChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-emerald-900 relative overflow-hidden">
      {/* Particles Background */}
      <div id="particles-js" className="fixed inset-0 z-0" />
      <div className="fixed inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-green-500/10 z-[1]" />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-xl border-b border-white/10 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">🇮🇳</span>
                </div>
                <div>
                  <h1 className="text-white font-bold text-xl">Damday Village</h1>
                  <p className="text-orange-300 text-xs">Carbon-Free Paradise</p>
                </div>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <NavLink href="/" icon={<Home className="h-4 w-4" />} label="Home" />
                <NavLink href="/homestays" icon={<Building2 className="h-4 w-4" />} label="Homestays" />
                <NavLink href="/marketplace" icon={<ShoppingBag className="h-4 w-4" />} label="Marketplace" />
                <NavLink href="/tours" icon={<MapPin className="h-4 w-4" />} label="Tours" />
                <NavLink href="/blockchain" icon={<Leaf className="h-4 w-4" />} label="Carbon Credits" />
                <Link href="/login" className="bg-gradient-to-r from-orange-500 to-green-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Content with Sidebar Layout */}
        <div className="pt-20">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Content - 8 columns */}
              <div className="lg:col-span-8">
                {children}
              </div>
              
              {/* Sidebar - 4 columns */}
              {showStats && (
                <div className="lg:col-span-4">
                  <VerticalSidebar />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center space-x-2 text-white/80 hover:text-orange-400 transition-colors">
      {icon}
      <span>{label}</span>
    </Link>
  )
}

function VerticalSidebar() {
  const stats = [
    { icon: <Users className="h-6 w-6" />, value: '2,500+', label: 'Community Members', color: 'from-orange-500 to-red-500' },
    { icon: <Store className="h-6 w-6" />, value: '150+', label: 'Local Products', color: 'from-green-500 to-emerald-500' },
    { icon: <Building2 className="h-6 w-6" />, value: '25+', label: 'Eco Homestays', color: 'from-blue-500 to-cyan-500' },
    { icon: <Leaf className="h-6 w-6" />, value: '100%', label: 'Carbon Neutral', color: 'from-purple-500 to-pink-500' },
    { icon: <Award className="h-6 w-6" />, value: '#1', label: 'Green Village', color: 'from-yellow-500 to-orange-500' },
  ]

  return (
    <div className="space-y-6 sticky top-24">
      {/* Leaders Section */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
        <h3 className="text-white font-bold text-xl mb-6 text-center">Our Leaders</h3>
        
        {/* PM Image */}
        <div className="text-center mb-6">
          <div className="w-32 h-32 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-500 to-green-600 p-1">
            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <div className="text-6xl">👤</div>
            </div>
          </div>
          <p className="text-white font-semibold text-lg">Hon. Prime Minister</p>
          <p className="text-white/60 text-sm">Shri Narendra Modi</p>
        </div>

        {/* CM Image */}
        <div className="text-center mb-6">
          <div className="w-28 h-28 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <div className="text-5xl">👤</div>
            </div>
          </div>
          <p className="text-white font-semibold">Hon. Chief Minister</p>
          <p className="text-white/60 text-sm">Uttarakhand</p>
        </div>

        {/* Gram Panchayat Pradhan */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-500 to-teal-600 p-1">
            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <div className="text-4xl">👤</div>
            </div>
          </div>
          <p className="text-white font-semibold">Gram Panchayat Pradhan</p>
          <p className="text-white/60 text-sm">Damday Village</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="space-y-3">
        <h3 className="text-white font-bold text-lg mb-4 px-2">Live Statistics</h3>
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-lg`}>
                <div className="text-white">{stat.icon}</div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
