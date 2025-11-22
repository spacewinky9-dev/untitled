/**
 * Cart Drawer Component
 * Slide-out shopping cart panel
 */

'use client'

import { useEffect } from 'react'
import { X, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/cart/store'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import EmptyCart from './EmptyCart'

export default function CartDrawer() {
  const { isOpen, closeCart, items } = useCartStore()

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-[9999] flex flex-col animate-slide-in-right"
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold text-white">
              Shopping Cart
              {items.length > 0 && (
                <span className="ml-2 text-sm font-normal text-white/60">
                  ({items.length} {items.length === 1 ? 'item' : 'items'})
                </span>
              )}
            </h2>
          </div>

          <button
            onClick={closeCart}
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <EmptyCart onClose={closeCart} />
          ) : (
            <div className="space-y-0">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer with Summary */}
        {items.length > 0 && (
          <div className="p-6 bg-slate-900/50 border-t border-white/10">
            <CartSummary />
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
