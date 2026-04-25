'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Globe, Star, Phone, MapPin, Clock, ChevronDown, ChevronRight, Bike, Store, Leaf } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAppStore } from '@/store/app'
import { seedMenuItems, seedCategories, seedOpeningHours } from '@/lib/seed-data'
import { hapticFeedback, isRestaurantOpen } from '@/lib/utils'
import { MenuCard } from '@/components/menu/menu-card'
import type { Language } from '@/lib/types'

const LANGS: { code: Language; label: string }[] = [
  { code: 'nl', label: 'Nederlands' },
  { code: 'en', label: 'English'    },
  { code: 'tr', label: 'Türkçe'     },
  { code: 'ar', label: 'العربية'    },
]

const DAY_LABELS: Record<Language, string[]> = {
  nl: ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'],
  en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  tr: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
  ar: ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
}

export default function MenuPage() {
  const { language, setLanguage } = useAppStore()
  const itemCount = useCartStore(s => s.getItemCount())
  const [activeCategory, setActiveCategory] = useState('all')
  const [orderType, setOrderType] = useState<'bezorgen' | 'afhalen'>('bezorgen')
  const [showLang, setShowLang] = useState(false)
  const [showHours, setShowHours] = useState(false)

  const todayHours = seedOpeningHours[new Date().getDay()] ?? null
  const isOpen = isRestaurantOpen(todayHours)
  const todayIdx = new Date().getDay()


  const visibleItems = activeCategory === 'all'
    ? seedMenuItems
    : seedMenuItems.filter(i => i.category_id === activeCategory)

  return (
    <motion.div
      className="min-h-screen"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative h-[55vh] md:h-[50vh] overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Mr. Mozaik"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Light mode gradient */}
        <div
          className="absolute inset-0 dark:opacity-0 transition-opacity duration-300"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(0,0,0,0.08) 0%,
              rgba(0,0,0,0.0) 40%,
              rgba(244,244,239,0.6) 72%,
              #EAE5D6 100%
            )`,
          }}
        />
        {/* Dark mode gradient */}
        <div
          className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(0,0,0,0.35) 0%,
              rgba(0,0,0,0.1) 40%,
              rgba(3,7,18,0.75) 72%,
              #030712 100%
            )`,
          }}
        />

        {/* Hero bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-5 md:px-12 pb-7 md:max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-red-600 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
              {isOpen
                ? (language === 'nl' ? 'Nu open · bezorging ~25 min' : language === 'en' ? 'Open now · delivery ~25 min' : language === 'tr' ? 'Açık · ~25 dk' : 'مفتوح الآن')
                : (language === 'nl' ? 'Momenteel gesloten' : 'Currently closed')}
            </span>
          </div>

          <div className="flex bg-[#F5F0E8] dark:bg-gray-800 rounded-2xl p-1 gap-1 max-w-xs">
            {(['bezorgen', 'afhalen'] as const).map(type => (
              <button
                key={type}
                onClick={() => { hapticFeedback(20); setOrderType(type) }}
                className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  orderType === type
                    ? 'bg-red-600 text-white shadow-[0_4px_16px_rgba(209,0,0,0.4)]'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {type === 'bezorgen' ? <Bike className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                {language === 'nl' ? (type === 'bezorgen' ? 'Bezorgen' : 'Afhalen')  :
                 language === 'en' ? (type === 'bezorgen' ? 'Delivery'  : 'Pickup')   :
                 language === 'tr' ? (type === 'bezorgen' ? 'Teslimat'  : 'Gel al')   :
                                     (type === 'bezorgen' ? 'توصيل'     : 'استلام')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFO STRIP ───────────────────────────── */}
      <div className="border-b border-black/5 dark:border-white/5 bg-[#EAE5D6] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          {/* Social proof */}
          <div className="flex items-center justify-around md:justify-start md:gap-10 py-3.5 px-4 md:px-8">
            <a
              href="https://www.google.com/maps/search/Mr.+Mozaik+Harderwijk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            >
              <Star className="w-4 h-4 text-red-600 fill-red-600" />
              <span className="font-black text-gray-900 dark:text-gray-100 text-sm">4.8</span>
              <span className="text-gray-400 dark:text-gray-500 text-xs">Google</span>
            </a>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">100% Halal</span>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-1.5">
              <Bike className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                {language === 'nl' ? 'Gratis v/a €25' : 'Free from €25'}
              </span>
            </div>
          </div>

          {/* Openingstijden */}
          <button
            onClick={() => setShowHours(v => !v)}
            className="w-full flex items-center justify-between px-4 md:px-8 py-3.5 border-t border-black/5 dark:border-white/5"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-600" />
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                {language === 'nl' ? 'Openingstijden' : language === 'en' ? 'Opening hours' : language === 'tr' ? 'Çalışma saatleri' : 'أوقات العمل'}
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isOpen ? 'bg-red-100 text-red-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                {isOpen ? 'OPEN' : (language === 'nl' ? 'GESLOTEN' : 'CLOSED')}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${showHours ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showHours && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 md:px-8 py-3 md:grid md:grid-cols-2 md:gap-x-12 space-y-2 md:space-y-0">
                  {seedOpeningHours.map((h, i) => (
                    <div key={i} className={`flex justify-between text-sm py-1 ${i === todayIdx ? 'font-bold text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                      <span>{DAY_LABELS[language][i]}</span>
                      <span>{h.closed ? (language === 'nl' ? 'Gesloten' : 'Closed') : `${h.open_time} – ${h.close_time}`}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact */}
          <div className="grid grid-cols-2 border-t border-gray-100 dark:border-gray-800">
            <a href="tel:0341786627" className="flex items-center gap-2.5 px-4 md:px-8 py-3.5 border-r border-black/5 dark:border-white/5 active:bg-black/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  {language === 'nl' ? 'Bellen' : 'Call us'}
                </p>
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">0341 - 78 66 27</p>
              </div>
            </a>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Deventerweg+12,+3843+GD+Harderwijk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4 md:px-8 py-3.5 active:bg-black/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  {language === 'nl' ? 'Adres' : 'Address'}
                </p>
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100">Deventerweg 12, 3843 GD</p>
              </div>
            </a>
          </div>

          {/* Bezorg/Afhaal banner */}
          {orderType === 'bezorgen' && (
            <div className="flex items-center gap-3 px-5 md:px-8 py-3 bg-red-600 text-white">
              <Bike className="w-4 h-4 flex-shrink-0" />
              <p className="text-xs font-semibold flex-1">
                {language === 'nl'
                  ? 'Bezorging in Harderwijk · Gratis v/a €25 · Min. bestelling €10'
                  : 'Delivery in Harderwijk · Free from €25 · Min. order €10'}
              </p>
              <ChevronRight className="w-4 h-4 opacity-70 flex-shrink-0" />
            </div>
          )}
          {orderType === 'afhalen' && (
            <div className="flex items-center gap-3 px-5 md:px-8 py-3 bg-red-600 text-white">
              <Store className="w-4 h-4 flex-shrink-0" />
              <p className="text-xs font-semibold flex-1">
                {language === 'nl'
                  ? 'Afhalen aan de balie · Geen bezorgkosten'
                  : 'Pickup at the counter · No delivery fee'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── CATEGORIE TABS — sticky ──────────────── */}
      <div className="sticky top-0 md:top-[65px] z-40 border-b border-black/5 dark:border-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-[#EAE5D6] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar">
          <CategoryTab
            label={language === 'nl' ? 'Alles' : language === 'en' ? 'All' : language === 'tr' ? 'Hepsi' : 'الكل'}
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {seedCategories.map(cat => (
            <CategoryTab
              key={cat.id}
              label={cat[`name_${language}` as keyof typeof cat] as string}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </div>
      </div>

      {/* ── MENU ─────────────────────────────────── */}
      <div className="pb-24 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {activeCategory === 'all' ? (
              seedCategories.map(cat => {
                const catItems = seedMenuItems.filter(i => i.category_id === cat.id)
                if (catItems.length === 0) return null
                return (
                  <div key={cat.id}>
                    <div className="px-4 md:px-8 pt-8 pb-3">
                      <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-900 dark:text-gray-100">
                        {cat[`name_${language}` as keyof typeof cat] as string}
                      </h2>
                    </div>
                    <div>
                      {catItems.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.22 }}
                        >
                          <MenuCard item={item} language={language} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="pt-2">
                {visibleItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.22 }}
                  >
                    <MenuCard item={item} language={language} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="px-5 py-8 border-t border-black/5 dark:border-white/5 mt-4 text-center">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[0_4px_16px_rgba(209,0,0,0.4)]">
            <span className="font-display font-bold text-white text-2xl leading-none">M</span>
          </div>
          <p className="font-display font-bold text-gray-900 dark:text-gray-100 text-lg">Mr. Mozaik</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Deventerweg 12 · 3843 GD Harderwijk</p>
          <a href="tel:0341786627" className="text-red-600 font-bold text-sm mt-1 block">0341 - 78 66 27</a>
          <p className="text-gray-300 dark:text-gray-600 text-[10px] mt-4">© 2026 Mr. Mozaik · Alle rechten voorbehouden</p>
        </div>
      </div>
    </motion.div>
  )
}

function CategoryTab({ label, active, onClick }: {
  label: string; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-5 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
        active
          ? 'border-red-600 text-red-600'
          : 'border-transparent text-gray-400 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  )
}
