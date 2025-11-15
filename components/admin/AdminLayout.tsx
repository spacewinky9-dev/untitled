'use client'

import { ReactNode, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Building2, 
  MapPin, 
  FileText, 
  Settings, 
  Leaf,
  TrendingUp,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js'
    script.async = true
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).particlesJS) {
        (window as any).particlesJS('particles-js-admin', {
          particles: {
            number: { value: 40, density: { enable: true, value_area: 800 } },
            color: { value: ['#ff6b35', '#4ade80'] },
            shape: { type: 'circle' },
            opacity: { value: 0.3, random: true },
            size: { value: 2, random: true },
            line_linked: { enable: true, distance: 150, color: '#fbbf24', opacity: 0.1, width: 1 },
            move: { enable: true, speed: 1, direction: 'none', random: true }
          }
        })
      }
    }
    if (!document.querySelector('script[src*="particles"]')) {
      document.body.appendChild(script)
    }
  }, [])

  const menuItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', href: '/admin' },
    { icon: <Users className="h-5 w-5" />, label: 'Users', href: '/admin/users' },
    { icon: <ShoppingBag className="h-5 w-5" />, label: 'Products', href: '/admin/products' },
    { icon: <Building2 className="h-5 w-5" />, label: 'Homestays', href: '/admin/homestays' },
    { icon: <MapPin className="h-5 w-5" />, label: 'Tours', href: '/admin/tours' },
    { icon: <FileText className="h-5 w-5" />, label: 'Bookings', href: '/admin/bookings' },
    { icon: <FileText className="h-5 w-5" />, label: 'Blog', href: '/admin/blog' },
    { icon: <Leaf className="h-5 w-5" />, label: 'Blockchain', href: '/admin/blockchain' },
    { icon: <TrendingUp className="h-5 w-5" />, label: 'Reports', href: '/admin/reports' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', href: '/admin/settings' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-emerald-900 relative">
      {/* Particles Background */}
      <div id="particles-js-admin" className="fixed inset-0 z-0" />
      <div className="fixed inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-green-500/10 z-[1]" />

      <div className="relative z-10 min-h-screen flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 
          bg-black/40 backdrop-blur-xl border-r border-white/10
          transform transition-transform duration-300 z-50
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <Link href="/admin" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🇮🇳</span>
                </div>
                <div>
                  <h2 className="text-white font-bold">Admin Panel</h2>
                  <p className="text-orange-300 text-xs">Damday Village</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {menuItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                    ${pathname === item.href 
                      ? 'bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-lg' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">👤</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Admin User</p>
                  <p className="text-white/60 text-xs">admin@damday.com</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-[60] bg-black/40 backdrop-blur-xl border border-white/20 text-white p-3 rounded-xl"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {menuItems.find(item => item.href === pathname)?.label || 'Admin Panel'}
                  </h1>
                  <p className="text-white/60">Manage your Damday Village platform</p>
                </div>
                <Link 
                  href="/" 
                  className="bg-gradient-to-r from-orange-500 to-green-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all"
                >
                  View Site
                </Link>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
