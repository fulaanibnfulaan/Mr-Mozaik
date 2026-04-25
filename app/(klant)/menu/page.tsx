'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Phone, MapPin, Clock, ChevronDown, ChevronLeft, ChevronRight, Bike, Store, Drumstick } from 'lucide-react'
import type { Language } from '@/lib/types'
import { useAppStore } from '@/store/app'
import { seedMenuItems, seedCategories, seedOpeningHours } from '@/lib/seed-data'
import { isRestaurantOpen } from '@/lib/utils'
import { MenuCard } from '@/components/menu/menu-card'

const DAY_LABELS: Record<Language, string[]> = {
  nl: ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'],
  en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  tr: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
  ar: ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
  de: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
}

export default function MenuPage() {
  const { language, orderType } = useAppStore()
  const [activeCategory, setActiveCategory] = useState(seedCategories[0]?.id ?? '')
  const [showHours, setShowHours] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const tabsRef = useRef<HTMLDivElement>(null)
  const isUserScrollingTabs = useRef(false)

  const todayHours = seedOpeningHours[new Date().getDay()] ?? null
  const isOpen = isRestaurantOpen(todayHours)
  const todayIdx = new Date().getDay()

  const checkScroll = useCallback(() => {
    const el = tabsRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cat = entry.target.getAttribute('data-cat')
            if (cat) setActiveCategory(cat)
          }
        })
      },
      { rootMargin: '-130px 0px -72% 0px', threshold: 0 }
    )
    seedCategories.forEach(cat => {
      const el = document.getElementById(`section-${cat.id}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isUserScrollingTabs.current) return
    const tabId = activeCategory === 'all' ? 'tab-all' : `tab-${activeCategory}`
    const btn = document.getElementById(tabId)
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeCategory])

  const handleTabClick = (catId: string) => {
    const el = document.getElementById(`section-${catId}`)
    if (el) {
      const navHeight = window.innerWidth >= 768 ? 122 : 100
      const offset = el.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top: offset, behavior: 'smooth' })
    }
  }

  return (
    <motion.div
      className="min-h-screen"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative h-[55vh] md:h-[50vh] overflow-hidden -mt-[49px] md:mt-0">
        <Image
          src="/hero.jpg"
          alt="Mr. Mozaik"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 dark:opacity-0 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.0) 40%, rgba(244,244,239,0.6) 72%, #EAE5D6 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(3,7,18,0.75) 72%, #030712 100%)`,
          }}
        />
<div className="absolute bottom-0 left-0 right-0 px-5 md:px-12 pb-7 md:max-w-4xl">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-gray-900 dark:text-white leading-none drop-shadow-sm">
            Mr. Mozaik
          </h1>
        </div>
      </section>

      {/* ── INFO STRIP ───────────────────────────── */}
      <div className="border-b border-black/5 dark:border-white/5 bg-[#EAE5D6] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 px-4 md:px-8 py-3 border-black/5 dark:border-white/5 overflow-x-auto no-scrollbar">
            <Link href="/" className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors flex-shrink-0">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">Start</span>
            </Link>
            <div className="w-px h-3.5 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
            <a href="https://www.google.com/maps/search/Mr.+Mozaik+Harderwijk" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:opacity-70 transition-opacity flex-shrink-0">
              <Star className="w-3.5 h-3.5 text-red-600 fill-red-600" />
              <span className="font-black text-gray-900 dark:text-gray-100 text-xs">4.8</span>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Google</span>
            </a>
            <div className="w-px h-3.5 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
            <div className="flex items-center gap-1 flex-shrink-0">
              <Drumstick className="w-3.5 h-3.5 text-red-600" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">100% Halal</span>
            </div>
            <div className="w-px h-3.5 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
            {orderType === 'bezorgen' ? (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Bike className="w-3.5 h-3.5 text-red-600" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {language === 'nl' ? 'Gratis v/a €25 · Min. €10' : language === 'de' ? 'Gratis ab €25 · Min. €10' : 'Free from €25 · Min. €10'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Store className="w-3.5 h-3.5 text-red-600" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {language === 'nl' ? 'Geen bezorgkosten' : language === 'de' ? 'Keine Lieferkosten' : 'No delivery fee'}
                </span>
              </div>
            )}
            <div className="w-px h-3.5 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
            <button onClick={() => setShowHours(v => !v)} className="flex items-center gap-1.5 hover:opacity-70 transition-opacity flex-shrink-0">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span className={`text-xs font-semibold ${isOpen ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                {todayHours && !todayHours.closed
                  ? `${todayHours.open_time} – ${todayHours.close_time}`
                  : (language === 'nl' ? 'Gesloten' : language === 'de' ? 'Geschlossen' : 'Closed')}
              </span>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showHours ? 'rotate-180' : ''}`} />
            </button>
            <div className="w-px h-3.5 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
            <a href="tel:0341786627" className="flex items-center gap-1 hover:opacity-70 transition-opacity flex-shrink-0">
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">0341 - 78 66 27</span>
            </a>
            <div className="w-px h-3.5 bg-gray-200 dark:bg-gray-700 hidden md:block" />
            <a href="https://www.google.com/maps/dir/?api=1&destination=Deventerweg+12,+3843+GD+Harderwijk"
              target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 hover:opacity-70 transition-opacity flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Deventerweg 12, 3843 GD Harderwijk</span>
            </a>
          </div>

          <AnimatePresence>
            {showHours && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-4 md:px-8 py-3 border-t border-black/5 dark:border-white/5 md:grid md:grid-cols-2 md:gap-x-12 space-y-1.5 md:space-y-0">
                  {seedOpeningHours.map((h, i) => (
                    <div key={i} className={`flex justify-between text-xs py-0.5 ${i === todayIdx ? 'font-bold text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                      <span>{DAY_LABELS[language][i]}</span>
                      <span>{h.closed ? (language === 'nl' ? 'Gesloten' : language === 'de' ? 'Geschlossen' : 'Closed') : `${h.open_time} – ${h.close_time}`}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── CATEGORIE TABS — sticky ──────────────── */}
      <div className="sticky top-[49px] md:top-[73px] z-40 border-b border-black/5 dark:border-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-[#EAE5D6] dark:bg-gray-950">
        <div className="relative max-w-7xl mx-auto">
          <div ref={tabsRef} onScroll={checkScroll} className="flex overflow-x-auto no-scrollbar">
            {seedCategories.map(cat => (
              <CategoryTab
                key={cat.id}
                id={`tab-${cat.id}`}
                label={cat[`name_${language}` as keyof typeof cat] as string}
                active={activeCategory === cat.id}
                onClick={() => handleTabClick(cat.id)}
              />
            ))}
          </div>
          <AnimatePresence>
            {canScrollLeft && (
              <motion.div key="fade-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#EAE5D6] dark:from-gray-950 to-transparent pointer-events-none flex items-center justify-start pl-2">
                <ChevronLeft className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {canScrollRight && (
              <motion.div key="fade-right" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#EAE5D6] dark:from-gray-950 to-transparent pointer-events-none flex items-center justify-end pr-2">
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── MENU ─────────────────────────────────── */}
      <div className="pb-24 max-w-7xl mx-auto">
        {seedCategories.map(cat => {
          const catItems = seedMenuItems.filter(i => i.category_id === cat.id)
          if (catItems.length === 0) return null
          return (
            <div key={cat.id} id={`section-${cat.id}`} data-cat={cat.id}>
              <div className="px-4 md:px-8 pt-8 pb-3">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-900 dark:text-gray-100">
                  {cat[`name_${language}` as keyof typeof cat] as string}
                </h2>
              </div>
              <div>
                {catItems.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04, duration: 0.22 }}>
                    <MenuCard item={item} language={language} />
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Footer */}
        <div className="px-5 py-8 border-t border-black/5 dark:border-white/5 mt-4 text-center">
          <p className="font-display font-bold text-gray-900 dark:text-gray-100 text-lg">Mr. Mozaik</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Deventerweg 12 · 3843 GD Harderwijk</p>
          <a href="tel:0341786627" className="text-red-600 font-bold text-sm mt-1 block">0341 - 78 66 27</a>
          <p className="text-gray-300 dark:text-gray-600 text-[10px] mt-4">© 2026 Mr. Mozaik · Alle rechten voorbehouden</p>
        </div>
      </div>
    </motion.div>
  )
}

function CategoryTab({ id, label, active, onClick }: {
  id: string; label: string; active: boolean; onClick: () => void
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`flex-shrink-0 px-5 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
        active
          ? 'border-red-600 text-red-600'
          : 'border-transparent text-gray-900 dark:text-gray-100 hover:text-gray-600'
      }`}
    >
      {label}
    </button>
  )
}
