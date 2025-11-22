/**
 * Cart Button Component
 * Button to open cart drawer, shows item count
 */

'use client'

import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/cart/store'

export default function CartButton() {
  const { itemCount, openCart } = useCartStore()

  return (
    <button
      onClick={openCart}
      className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="w-6 h-6 text-white" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  )
}
