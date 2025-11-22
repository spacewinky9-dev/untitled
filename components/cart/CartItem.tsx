/**
 * Cart Item Component
 * Individual item in the shopping cart
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X } from 'lucide-react'
import { useCartStore } from '@/lib/cart/store'
import { formatCurrency } from '@/lib/cart/utils'
import type { CartItem as CartItemType } from '@/lib/cart/types'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  const handleIncrement = () => {
    updateQuantity(item.productId, item.quantity + 1)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1)
    }
  }

  const handleRemove = () => {
    removeItem(item.productId)
  }

  return (
    <div className="flex gap-4 py-4 border-b border-white/10">
      <Link href={`/marketplace/${item.slug}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white/5">
          <Image
            src={item.image || '/images/placeholder-product.jpg'}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/marketplace/${item.slug}`}
          className="font-medium text-white hover:text-orange-400 transition-colors line-clamp-2"
        >
          {item.name}
        </Link>

        <div className="mt-2 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="w-8 h-8 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4 text-white" />
            </button>

            <span className="w-12 text-center text-white font-medium">
              {item.quantity}
            </span>

            <button
              onClick={handleIncrement}
              disabled={item.quantity >= (item.maxQuantity || 999)}
              className="w-8 h-8 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-lg font-bold text-orange-400">
              {formatCurrency(item.price * item.quantity)}
            </div>
            {item.quantity > 1 && (
              <div className="text-xs text-white/60">
                {formatCurrency(item.price)} each
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 w-8 h-8 rounded-md hover:bg-red-500/20 flex items-center justify-center transition-colors group"
        aria-label="Remove item"
      >
        <X className="w-5 h-5 text-white/60 group-hover:text-red-400 transition-colors" />
      </button>
    </div>
  )
}
