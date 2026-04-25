'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { hapticFeedback, formatEuros } from '@/lib/utils'
import type { Language } from '@/lib/types'
import type { seedMenuItems } from '@/lib/seed-data'

type MenuItem = (typeof seedMenuItems)[0]

export function MenuCard({ item, language }: { item: MenuItem; language: Language }) {
  const addItem = useCartStore(s => s.addItem)
  const [added, setAdded] = useState(false)

  const name = item[`name_${language}` as keyof MenuItem] as string
  const desc = item[`description_${language}` as keyof MenuItem] as string

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (item.sold_out) return
    hapticFeedback()
    addItem(item as any, [])
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <Link href={`/item/${item.id}`} className="block px-4 md:px-8 pb-2.5">
      <motion.div
        whileTap={{ scale: 0.985 }}
        className={`bg-[#F5F0E8] dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm p-4 flex items-center justify-between gap-4 ${item.sold_out ? 'opacity-50' : ''}`}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-[15px] leading-snug mb-1">{name}</h3>
          <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-2 leading-relaxed">{desc}</p>

          <div className="flex items-center gap-3 mt-2.5">
            <span className="font-black text-red-600 text-sm">{formatEuros(item.price)}</span>
          </div>
        </div>

        <motion.button
          onClick={handleAdd}
          whileTap={{ scale: 0.82 }}
          disabled={item.sold_out}
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            item.sold_out ? 'bg-gray-100 cursor-not-allowed' :
            added ? 'bg-green-500 shadow-[0_4px_12px_rgba(34,197,94,0.35)]' :
            'bg-red-600 shadow-[0_4px_14px_rgba(209,0,0,0.4)]'
          }`}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-white text-sm font-black">✓</motion.span>
            ) : (
              <motion.div key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Plus className={`w-4 h-4 ${item.sold_out ? 'text-gray-300' : 'text-white'}`} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </Link>
  )
}
