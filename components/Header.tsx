'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Home, ShoppingBag, Building2, BookOpen, TreePine, Users, MapPin, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CartButton from '@/components/cart/CartButton'

interface NavItem {
  id: string
  label: string
  href: string
  icon?: string
  order: number
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Navigation items - will be fetched from database in admin panel
  const navItems: NavItem[] = [
    { id: '1', label: 'Home', href: '/', icon: 'Home', order: 1 },
    { id: '2', label: 'Homestays', href: '/homestays', icon: 'Building2', order: 2 },
    { id: '3', label: 'Tours', href: '/tours', icon: 'MapPin', order: 3 },
    { id: '4', label: 'Marketplace', href: '/marketplace', icon: 'ShoppingBag', order: 4 },
    { id: '5', label: 'Community', href: '/community', icon: 'Users', order: 5 },
    { id: '6', label: 'Carbon Credits', href: '/carbon', icon: 'TreePine', order: 6 },
    { id: '7', label: 'Contact', href: '/contact', icon: 'MessageSquare', order: 7 },
  ]

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Home: <Home className="h-4 w-4" />,
      ShoppingBag: <ShoppingBag className="h-4 w-4" />,
      Building2: <Building2 className="h-4 w-4" />,
      Users: <Users className="h-4 w-4" />,
      TreePine: <TreePine className="h-4 w-4" />,
      BookOpen: <BookOpen className="h-4 w-4" />,
      MapPin: <MapPin className="h-4 w-4" />,
      MessageSquare: <MessageSquare className="h-4 w-4" />,
    }
    return icons[iconName] || null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mr-8">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            DV
          </div>
          <span className="font-bold text-lg hidden sm:inline-block bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
            Damday Village
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-1">
          {navItems.sort((a, b) => a.order - b.order).map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              {item.icon && getIcon(item.icon)}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2 ml-auto">
          <CartButton />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
              Register
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="outline" size="sm">
              Admin
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto flex items-center gap-2">
          <CartButton />
          <button
            className="p-2 hover:bg-gray-100 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navItems.sort((a, b) => a.order - b.order).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon && getIcon(item.icon)}
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-4 border-t space-y-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-green-600">
                  Register
                </Button>
              </Link>
              <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
