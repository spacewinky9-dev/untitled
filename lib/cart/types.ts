/**
 * Cart Types
 * TypeScript interfaces for shopping cart functionality
 */

export interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  quantity: number
  image: string
  maxQuantity?: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export interface CartActions {
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

export type CartStore = CartState & CartActions & {
  total: number
  itemCount: number
  subtotal: number
}
