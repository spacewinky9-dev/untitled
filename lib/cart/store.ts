/**
 * Cart Store using Zustand
 * Persistent shopping cart state management
 */

'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, CartStore } from './types'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      isOpen: false,

      // Computed values
      get total() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      get subtotal() {
        return get().total
      },

      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      // Actions
      addItem: (product) => {
        const items = get().items
        const existingItem = items.find((item) => item.productId === product.productId)

        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: items.map((item) =>
              item.productId === product.productId
                ? {
                    ...item,
                    quantity: Math.min(
                      item.quantity + 1,
                      product.maxQuantity || 999
                    ),
                  }
                : item
            ),
            isOpen: true,
          })
        } else {
          // Add new item
          set({
            items: [...items, { ...product, quantity: 1 }],
            isOpen: true,
          })
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: Math.min(quantity, item.maxQuantity || 999),
                }
              : item
          ),
        })
      },

      clearCart: () => {
        set({ items: [], isOpen: false })
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },
    }),
    {
      name: 'damday-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
)
