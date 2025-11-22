/**
 * Cart Utility Functions
 * Helper functions for cart operations
 */

import type { CartItem } from './types'

/**
 * Format currency in INR
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Calculate cart summary
 */
export function calculateCartSummary(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 50 // Free shipping above ₹500
  const tax = subtotal * 0.05 // 5% tax
  const total = subtotal + shipping + tax

  return {
    subtotal,
    shipping,
    tax,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

/**
 * Validate cart item quantity
 */
export function validateQuantity(
  quantity: number,
  maxQuantity: number = 999
): number {
  if (quantity < 1) return 1
  if (quantity > maxQuantity) return maxQuantity
  return Math.floor(quantity)
}

/**
 * Check if cart is empty
 */
export function isCartEmpty(items: CartItem[]): boolean {
  return items.length === 0
}

/**
 * Get cart item by product ID
 */
export function getCartItem(
  items: CartItem[],
  productId: string
): CartItem | undefined {
  return items.find((item) => item.productId === productId)
}
