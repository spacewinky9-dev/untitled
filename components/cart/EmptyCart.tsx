/**
 * Empty Cart Component
 * Shown when cart has no items
 */

'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyCartProps {
  onClose?: () => void
}

export default function EmptyCart({ onClose }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
        <ShoppingBag className="w-12 h-12 text-white/40" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
      <p className="text-white/60 mb-6 max-w-sm">
        Looks like you haven&apos;t added anything to your cart yet. Explore our marketplace!
      </p>

      <Link href="/marketplace" onClick={onClose}>
        <Button className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Browse Products
        </Button>
      </Link>
    </div>
  )
}
