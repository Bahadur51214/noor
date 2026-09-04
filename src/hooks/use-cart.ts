'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  slug: string
  image: string
  price: number
  salePrice: number | null
  quantity: number
  stock: number
}

export interface CartStore {
  items: CartItem[]
  isOpen: boolean

  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  getItemCount: () => number
  getSubtotal: () => number
  getItem: (productId: string) => CartItem | undefined
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId
          )
          if (existingItem) {
            if (existingItem.quantity >= item.stock) return state
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              isOpen: true,
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }], isOpen: true }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.productId !== productId),
            }
          }
          return {
            items: state.items.map((i) => {
              if (i.productId === productId) {
                const newQuantity = Math.min(quantity, i.stock)
                return { ...i, quantity: newQuantity }
              }
              return i
            }),
          }
        }),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const effectivePrice = item.salePrice ?? item.price
          return total + effectivePrice * item.quantity
        }, 0)
      },

      getItem: (productId) => {
        return get().items.find((i) => i.productId === productId)
      },
    }),
    {
      name: 'noor-cart-storage',
      skipHydration: true,
    }
  )
)
