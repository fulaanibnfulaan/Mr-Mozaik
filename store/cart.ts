'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, MenuItem, Addon, SelectedOption } from '@/lib/types'

interface CartState {
  items: CartItem[]
  tip: number
  noCutlery: boolean
  couponCode: string
  couponDiscount: number
  addItem: (menuItem: MenuItem, options: SelectedOption[], quantity?: number) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  setTip: (tip: number) => void
  setNoCutlery: (value: boolean) => void
  setCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tip: 0,
      noCutlery: false,
      couponCode: '',
      couponDiscount: 0,

      addItem: (menuItem, options, quantity = 1) => {
        const optionKey = options.map(o => o.value_id).sort().join(',')
        const existing = get().items.find(i =>
          i.menu_item.id === menuItem.id &&
          (i.selected_options ?? []).map(o => o.value_id).sort().join(',') === optionKey
        )
        if (existing) {
          get().updateQuantity(existing.id, existing.quantity + quantity)
        } else {
          const id = `${menuItem.id}-${optionKey}-${Date.now()}`
          set(state => ({
            items: [...state.items, {
              id,
              menu_item: menuItem,
              quantity,
              selected_addons: [],
              selected_options: options,
            }],
          }))
        }
      },

      removeItem: (cartItemId) => {
        set(state => ({ items: state.items.filter(i => i.id !== cartItemId) }))
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId)
          return
        }
        set(state => ({
          items: state.items.map(i => i.id === cartItemId ? { ...i, quantity } : i),
        }))
      },

      clearCart: () => set({ items: [], tip: 0, noCutlery: false, couponCode: '', couponDiscount: 0 }),

      setTip: (tip) => set({ tip }),
      setNoCutlery: (value) => set({ noCutlery: value }),
      setCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      removeCoupon: () => set({ couponCode: '', couponDiscount: 0 }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const optionsTotal = (item.selected_options ?? []).reduce((s, o) => s + o.price, 0)
          const addonsTotal  = (item.selected_addons  ?? []).reduce((s, a) => s + a.price, 0)
          return total + (item.menu_item.price + optionsTotal + addonsTotal) * item.quantity
        }, 0)
      },

      getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    { name: 'mozaik-cart', skipHydration: true }
  )
)
