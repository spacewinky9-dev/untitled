'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  TreePine,
  ShoppingBag,
  Home,
  Newspaper
} from 'lucide-react'

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

const futureModules = [
  { title: 'Marketplace', icon: ShoppingBag, status: 'Coming in PR #4' },
  { title: 'Homestays', icon: Home, status: 'Coming in PR #5' },
  { title: 'Blog', icon: Newspaper, status: 'Coming in PR #6' },
  { title: 'Carbon Credits', icon: TreePine, status: 'Coming in PR #7' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
            DV
          </div>
          <div>
            <h2 className="font-bold text-lg">Damday Village</h2>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Future Modules
          </p>
          {futureModules.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400"
                title={item.status}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </div>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
