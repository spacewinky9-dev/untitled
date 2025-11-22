/**
 * Add to Cart Button Component
 * Button to add product to shopping cart
 */

'use client'

import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/cart/store'
import { Button } from '@/components/ui/button'
import type { CartItem } from '@/lib/cart/types'

interface AddToCartButtonProps {
  product: Omit<CartItem, 'quantity'>
  className?: string
  variant?: 'default' | 'outline'
}

export default function AddToCartButton({
  product,
  className = '',
  variant = 'default',
}: AddToCartButtonProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    addItem(product)
  }

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      className={className}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Add to Cart
    </Button>
  )
}
