'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { hapticFeedback, formatEuros } from '@/lib/utils'
import { getOptionGroups } from '@/lib/option-groups'
import { ItemSheet } from './item-sheet'
import type { Language } from '@/lib/types'
import type { seedMenuItems } from '@/lib/seed-data'

type MenuItem = (typeof seedMenuItems)[0]

export function MenuCard({ item, language }: { item: MenuItem; language: Language }) {
  const [showSheet, setShowSheet] = useState(false)
  const hasOptions = getOptionGroups(item.category_id).length > 0

  const lang = language === 'de' ? 'en' : language
  const name = item[`name_${lang}` as keyof MenuItem] as string
  const desc = item[`description_${lang}` as keyof MenuItem] as string

  const handleClick = () => {
    if (item.sold_out) return
    hapticFeedback()
    setShowSheet(true)
  }

  return (
    <>
      <div className="block px-4 md:px-8 pb-2.5" onClick={handleClick}>
        <motion.div
          whileTap={{ scale: 0.985 }}
          className={`bg-[#F5F0E8] dark:bg-gray-800 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm p-4 flex items-center justify-between gap-4 ${item.sold_out ? 'opacity-50' : 'cursor-pointer'}`}
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-[15px] leading-snug mb-1">{name}</h3>
            <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-2 leading-relaxed">{desc}</p>
            <div className="flex items-center gap-3 mt-2.5">
              <span className="font-black text-red-600 text-sm">{formatEuros(item.price)}</span>
            </div>
          </div>

          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            item.sold_out
              ? 'bg-gray-100 dark:bg-gray-700'
              : 'bg-red-600 shadow-[0_4px_14px_rgba(209,0,0,0.4)]'
          }`}>
            <Plus className={`w-4 h-4 ${item.sold_out ? 'text-gray-300' : 'text-white'}`} />
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showSheet && (
          <ItemSheet
            item={item}
            language={language}
            onClose={() => setShowSheet(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
