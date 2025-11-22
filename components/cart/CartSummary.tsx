/**
 * Cart Summary Component
 * Displays cart totals and checkout button
 */

'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/cart/store'
import { formatCurrency, calculateCartSummary } from '@/lib/cart/utils'
import { Button } from '@/components/ui/button'

export default function CartSummary() {
  const { items, closeCart } = useCartStore()
  const summary = calculateCartSummary(items)

  return (
    <div className="border-t border-white/10 pt-4 mt-4">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-white/80">Subtotal</span>
          <span className="text-white font-medium">
            {formatCurrency(summary.subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-white/80">Shipping</span>
          <span className="text-white font-medium">
            {summary.shipping === 0 ? (
              <span className="text-green-400">FREE</span>
            ) : (
              formatCurrency(summary.shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-white/80">Tax (5%)</span>
          <span className="text-white font-medium">
            {formatCurrency(summary.tax)}
          </span>
        </div>

        <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
          <span className="text-white">Total</span>
          <span className="text-orange-400">{formatCurrency(summary.total)}</span>
        </div>
      </div>

      {summary.subtotal < 500 && (
        <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <p className="text-xs text-orange-300">
            Add {formatCurrency(500 - summary.subtotal)} more for FREE shipping!
          </p>
        </div>
      )}

      <Link href="/checkout" onClick={() => closeCart()}>
        <Button className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Proceed to Checkout
        </Button>
      </Link>

      <Link href="/cart" onClick={() => closeCart()}>
        <Button variant="outline" className="w-full mt-2 border-white/20 text-white hover:bg-white/10">
          View Full Cart
        </Button>
      </Link>
    </div>
  )
}
