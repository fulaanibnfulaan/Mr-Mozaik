'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Check } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { hapticFeedback, formatEuros } from '@/lib/utils'
import { getOptionGroups } from '@/lib/option-groups'
import type { Language } from '@/lib/types'
import type { SelectedOption, OptionGroup } from '@/lib/types'
import type { seedMenuItems } from '@/lib/seed-data'

type MenuItem = (typeof seedMenuItems)[0]

export function ItemSheet({
  item,
  language,
  onClose,
}: {
  item: MenuItem
  language: Language
  onClose: () => void
}) {
  const addItem = useCartStore(s => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [selected, setSelected] = useState<Record<string, string[]>>({})
  const [added, setAdded] = useState(false)

  const lang = language === 'de' ? 'en' : language
  const name = item[`name_${lang}` as keyof MenuItem] as string
  const desc = item[`description_${lang}` as keyof MenuItem] as string
  const optionGroups = getOptionGroups(item.category_id)

  const toggle = (group: OptionGroup, valueId: string) => {
    hapticFeedback(10)
    setSelected(prev => {
      const current = prev[group.id] ?? []
      if (group.is_multi_select) {
        const next = current.includes(valueId)
          ? current.filter(v => v !== valueId)
          : [...current, valueId]
        return { ...prev, [group.id]: next }
      } else {
        return { ...prev, [group.id]: current[0] === valueId ? [] : [valueId] }
      }
    })
  }

  const buildSelectedOptions = (): SelectedOption[] => {
    return optionGroups.flatMap(group =>
      (selected[group.id] ?? []).map(valueId => {
        const val = group.values.find(v => v.id === valueId)!
        return {
          group_id: group.id,
          value_id: val.id,
          name_nl: val.name_nl,
          name_en: val.name_en,
          name_tr: val.name_tr,
          name_ar: val.name_ar,
          price: val.price,
        }
      })
    )
  }

  const optionsTotal = optionGroups.reduce((sum, group) => {
    return sum + (selected[group.id] ?? []).reduce((s, vid) => {
      const val = group.values.find(v => v.id === vid)
      return s + (val?.price ?? 0)
    }, 0)
  }, 0)

  const total = (item.price + optionsTotal) * quantity

  const handleAdd = () => {
    hapticFeedback()
    addItem(item as any, buildSelectedOptions(), quantity)
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
        className="relative z-10 w-full md:max-w-lg bg-[#EAE5D6] dark:bg-gray-900 rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 bg-black/15 dark:bg-white/15 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-snug">{name}</h2>
            {desc && <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 line-clamp-2">{desc}</p>}
            <p className="font-black text-red-600 text-base mt-1.5">{formatEuros(item.price)}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center flex-shrink-0 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Scrollable options */}
        <div className="flex-1 overflow-y-auto px-5 pb-2 space-y-5">
          {optionGroups.map(group => (
            <div key={group.id}>
              <h3 className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2.5">
                {group[`name_${lang}` as keyof typeof group] as string}
              </h3>
              <div className="space-y-1.5">
                {group.values.map(val => {
                  const isSelected = (selected[group.id] ?? []).includes(val.id)
                  const label = val[`name_${lang}` as keyof typeof val] as string
                  return (
                    <button
                      key={val.id}
                      onClick={() => toggle(group, val.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all text-left ${
                        isSelected
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'bg-[#F5F0E8] dark:bg-gray-800 border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                          isSelected
                            ? 'bg-white/25 border-white/40'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-sm font-semibold">{label}</span>
                      </div>
                      {val.price > 0 && (
                        <span className={`text-xs font-bold ${isSelected ? 'text-white/80' : 'text-red-600'}`}>
                          +{formatEuros(val.price)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 pt-4 pb-20 md:pb-6 border-t border-black/5 dark:border-white/5 mt-2">
          <div className="flex items-center justify-between gap-4">
            {/* Quantity */}
            <div className="flex items-center gap-2 bg-[#F5F0E8] dark:bg-gray-800 rounded-2xl p-1">
              <button
                onClick={() => { hapticFeedback(10); setQuantity(q => Math.max(1, q - 1)) }}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <Minus className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </button>
              <span className="w-6 text-center font-bold text-gray-900 dark:text-gray-100 text-sm">{quantity}</span>
              <button
                onClick={() => { hapticFeedback(10); setQuantity(q => Math.min(20, q + 1)) }}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Add button */}
            <motion.button
              onClick={handleAdd}
              disabled={item.sold_out || added}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-between px-4 transition-all ${
                added
                  ? 'bg-green-500 text-white shadow-[0_4px_16px_rgba(34,197,94,0.4)]'
                  : 'bg-red-600 text-white shadow-[0_4px_16px_rgba(209,0,0,0.35)]'
              }`}
            >
              <span>
                {added
                  ? (language === 'nl' ? 'Toegevoegd!' : language === 'en' ? 'Added!' : language === 'tr' ? 'Eklendi!' : language === 'de' ? 'Hinzugefügt!' : 'تمت الإضافة!')
                  : (language === 'nl' ? 'Toevoegen' : language === 'en' ? 'Add' : language === 'tr' ? 'Ekle' : language === 'de' ? 'Hinzufügen' : 'أضف')}
              </span>
              <span className="font-black">{formatEuros(total)}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
