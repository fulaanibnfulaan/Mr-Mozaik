'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Minus, Plus, Heart, Clock, Leaf, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart'
import { useAppStore } from '@/store/app'
import { seedMenuItems, seedAddons } from '@/lib/seed-data'
import { hapticFeedback, formatEuros } from '@/lib/utils'
import { MenuCard } from '@/components/menu/menu-card'
import type { Language } from '@/lib/types'

export default function ItemDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { language } = useAppStore()
  const addItem = useCartStore(s => s.addItem)

  const item = seedMenuItems.find(i => i.id === id)
  const itemAddons = seedAddons.filter(a => a.menu_item_id === id)
  const relatedItems = seedMenuItems.filter(i => i.category_id === item?.category_id && i.id !== id).slice(0, 4)

  const [quantity, setQuantity] = useState(1)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [showAllergens, setShowAllergens] = useState(false)
  const [favorited, setFavorited] = useState(false)

  if (!item) {
    router.push('/')
    return null
  }

  const name = item[`name_${language}` as keyof typeof item] as string
  const desc = item[`description_${language}` as keyof typeof item] as string

  const toggleAddon = (addonId: string) => {
    hapticFeedback(30)
    setSelectedAddons(prev =>
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    )
  }

  const addonsTotal = itemAddons
    .filter(a => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0)

  const totalPrice = (item.price + addonsTotal) * quantity

  const handleAddToCart = () => {
    hapticFeedback()
    const addons = itemAddons.filter(a => selectedAddons.includes(a.id))
    addItem(item as any, addons as any, quantity)
    toast.success(
      language === 'nl' ? `${name} toegevoegd` :
      language === 'en' ? `${name} added` :
      language === 'tr' ? `${name} eklendi` : `تمت إضافة ${name}`,
      { duration: 2000 }
    )
    router.push('/')
  }

  const allergenLabels: Record<string, Record<Language, string>> = {
    gluten: { nl: 'Gluten', en: 'Gluten', tr: 'Gluten', ar: 'جلوتين' },
    nuts: { nl: 'Noten', en: 'Nuts', tr: 'Fındık', ar: 'مكسرات' },
    lactose: { nl: 'Lactose', en: 'Lactose', tr: 'Laktoz', ar: 'لاكتوز' },
    eggs: { nl: 'Eieren', en: 'Eggs', tr: 'Yumurta', ar: 'بيض' },
  }

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen">
      {/* Hero image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={item.image_url} alt={name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 bg-night-2/80 backdrop-blur-sm border border-gold/20 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-cream" />
        </button>

        {/* Favorite */}
        <button
          onClick={() => { hapticFeedback(30); setFavorited(f => !f) }}
          className="absolute top-4 right-4 w-10 h-10 bg-night-2/80 backdrop-blur-sm border border-gold/20 rounded-full flex items-center justify-center"
        >
          <Heart className={`w-5 h-5 transition-colors ${favorited ? 'text-ember fill-ember' : 'text-sand/50'}`} />
        </button>

        {/* Badges */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {item.popular_count > 300 && (
            <span className="bg-ember text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-ember">
              🔥 {language === 'nl' ? 'Bestseller' : 'Bestseller'}
            </span>
          )}
          {item.vegetarian && (
            <span className="bg-green-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              {language === 'nl' ? 'Vegetarisch' : language === 'en' ? 'Vegetarian' : language === 'tr' ? 'Vejetaryen' : 'نباتي'}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-5 pb-36">
        <div className="flex items-start justify-between mb-2 gap-3">
          <h1 className="font-display font-bold text-2xl text-cream leading-tight flex-1">{name}</h1>
          <span className="font-bold text-2xl text-ember flex-shrink-0">{formatEuros(item.price)}</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1 text-sand/50 text-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>{item.preparation_time} {language === 'ar' ? 'دقيقة' : 'min'}</span>
          </div>
        </div>

        <p className="text-sand/60 text-sm leading-relaxed mb-6">{desc}</p>

        {/* Allergens */}
        {Object.values(item.allergens).some(Boolean) && (
          <div className="mb-6">
            <button
              onClick={() => setShowAllergens(v => !v)}
              className="flex items-center gap-2 text-sm font-medium text-sand/60 w-full card-night px-4 py-3 rounded-xl"
            >
              <span className="flex-1 text-left">
                {language === 'nl' ? 'Allergieën' : language === 'en' ? 'Allergens' : language === 'tr' ? 'Alerjenler' : 'مسببات الحساسية'}
              </span>
              {showAllergens ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <AnimatePresence>
              {showAllergens && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-3 px-1">
                    {Object.entries(item.allergens)
                      .filter(([, v]) => v)
                      .map(([key]) => (
                        <span key={key} className="bg-gold/10 text-gold border border-gold/20 text-xs font-medium px-2.5 py-1 rounded-lg">
                          {allergenLabels[key]?.[language] || key}
                        </span>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Add-ons */}
        {itemAddons.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-sm text-sand/50 uppercase tracking-wide mb-3">
              {language === 'nl' ? 'Extras toevoegen' : language === 'en' ? 'Add extras' : language === 'tr' ? 'Ekstra ekle' : 'إضافة إضافات'}
            </h2>
            <div className="space-y-2">
              {itemAddons.map(addon => {
                const addonName = addon[`name_${language}` as keyof typeof addon] as string
                const isSelected = selectedAddons.includes(addon.id)
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-ember bg-ember/10'
                        : 'border-gold/15 bg-night-3 hover:border-gold/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-ember bg-ember' : 'border-gold/20'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? 'text-ember' : 'text-sand/80'}`}>
                        {addonName}
                      </span>
                    </div>
                    {addon.price > 0 && (
                      <span className={`text-sm font-semibold ${isSelected ? 'text-ember' : 'text-sand/50'}`}>
                        +{formatEuros(addon.price)}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Related */}
        {relatedItems.length > 0 && (
          <div>
            <h2 className="font-semibold text-sm text-sand/50 uppercase tracking-wide mb-3">
              {language === 'nl' ? 'Anderen bestelden ook' : language === 'en' ? 'Others also ordered' : language === 'tr' ? 'Diğerleri de sipariş etti' : 'طلب الآخرون أيضاً'}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {relatedItems.map(related => (
                <MenuCard key={related.id} item={related} language={language} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky add to cart */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 py-4 bg-night-2/95 backdrop-blur-xl border-t border-gold/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-night-3 border border-gold/15 rounded-xl p-1">
            <button
              onClick={() => { hapticFeedback(20); setQuantity(q => Math.max(1, q - 1)) }}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <Minus className="w-4 h-4 text-sand/60" />
            </button>
            <span className="w-6 text-center font-bold text-cream">{quantity}</span>
            <button
              onClick={() => { hapticFeedback(20); setQuantity(q => q + 1) }}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <Plus className="w-4 h-4 text-sand/60" />
            </button>
          </div>

          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.97 }}
            disabled={item.sold_out}
            className="flex-1 btn-ember py-3.5 rounded-xl flex items-center justify-between px-4 disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="font-semibold text-sm">
                {item.sold_out
                  ? (language === 'nl' ? 'Uitverkocht' : language === 'en' ? 'Sold out' : language === 'tr' ? 'Tükendi' : 'نفد')
                  : (language === 'nl' ? 'Toevoegen' : language === 'en' ? 'Add to cart' : language === 'tr' ? 'Sepete ekle' : 'أضف إلى السلة')
                }
              </span>
            </div>
            <span className="font-bold">{formatEuros(totalPrice)}</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
