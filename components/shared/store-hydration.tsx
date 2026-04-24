'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { useAppStore } from '@/store/app'

export function StoreHydration() {
  useEffect(() => {
    useAppStore.persist.rehydrate()
    useCartStore.persist.rehydrate()
  }, [])
  return null
}
