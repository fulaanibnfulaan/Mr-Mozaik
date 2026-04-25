'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { ShoppingBag, Sun, Moon, Globe, Bike, Store, ChevronLeft, ChevronRight } from 'lucide-react'
import { BottomNav } from '@/components/shared/bottom-nav'
import { OfflineBanner } from '@/components/shared/offline-banner'
import { StoreHydration } from '@/components/shared/store-hydration'
import { useCartStore } from '@/store/cart'
import { useAppStore } from '@/store/app'
import { formatEuros } from '@/lib/utils'
import type { Language } from '@/lib/types'

const LANGS: { code: Language }[] = [
  { code: 'nl' },
  { code: 'en' },
  { code: 'tr' },
  { code: 'ar' },
  { code: 'de' },
]

const LANG_NAMES: Record<Language, Record<Language, string>> = {
  nl: { nl: 'Nederlands',    en: 'Engels',      tr: 'Turks',    ar: 'Arabisch', de: 'Duits'         },
  en: { nl: 'Dutch',         en: 'English',     tr: 'Turkish',  ar: 'Arabic',   de: 'German'        },
  tr: { nl: 'Hollandaca',    en: 'İngilizce',   tr: 'Türkçe',   ar: 'Arapça',   de: 'Almanca'       },
  ar: { nl: 'الهولندية',     en: 'الإنجليزية',  tr: 'التركية',  ar: 'العربية',  de: 'الألمانية'     },
  de: { nl: 'Niederländisch',en: 'Englisch',    tr: 'Türkisch', ar: 'Arabisch', de: 'Deutsch'       },
}

export default function KlantLayout({ children }: { children: React.ReactNode }) {
  const { items, getItemCount, getSubtotal } = useCartStore()
  const itemCount = getItemCount()
  const { language, setLanguage, orderType, setOrderType, userMode } = useAppStore()
  const pathname = usePathname()
  const isStartPage = pathname === '/'
  const hideStartBtn = pathname === '/' || pathname === '/winkelwagen'
  const [dark, setDark] = useState(false)
  const [showLang, setShowLang] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored === 'true') {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLang(false)
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) setShowCart(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('darkMode', String(next))
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <div className="min-h-screen w-full bg-[#EAE5D6] dark:bg-gray-950">
      {/* Mobile top strip — hidden on desktop, hidden on start page */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2.5 bg-[#EAE5D6]/80 dark:bg-gray-950/80 backdrop-blur-xl ${isStartPage ? 'hidden' : ''}`}>
        {!hideStartBtn && (
          <Link href="/" className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-bold">Start</span>
          </Link>
        )}
        <div className={`flex bg-[#F5F0E8] dark:bg-gray-800 rounded-xl p-0.5 gap-0.5 ${hideStartBtn ? 'mx-auto' : ''}`}>
          {(['bezorgen', 'afhalen'] as const).map(type => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
                orderType === type
                  ? 'bg-red-600 text-white shadow-[0_2px_8px_rgba(209,0,0,0.35)]'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {type === 'bezorgen' ? <Bike className="w-3 h-3" /> : <Store className="w-3 h-3" />}
              {type === 'bezorgen' ? (language === 'nl' ? 'Bezorgen' : language === 'en' ? 'Delivery' : language === 'tr' ? 'Teslimat' : language === 'de' ? 'Liefern' : 'توصيل')
                                  : (language === 'nl' ? 'Afhalen'  : language === 'en' ? 'Pickup'   : language === 'tr' ? 'Gel al'   : language === 'de' ? 'Abholen' : 'استلام')}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop top nav — hidden on mobile, hidden on start page */}
      <nav className={`${isStartPage ? '!hidden' : 'hidden md:flex'} items-center justify-between px-8 py-4 bg-[#EAE5D6] dark:bg-gray-900 border-b border-black/5 dark:border-gray-800 sticky top-0 z-50 shadow-sm`}>
        {!hideStartBtn ? (
          <Link href="/" className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-bold">Start</span>
          </Link>
        ) : <div />}
        <div className="flex items-center gap-8">
          {/* Bezorgen / Afhalen toggle */}
          <div className="flex bg-[#F5F0E8] dark:bg-gray-800 rounded-xl p-0.5 gap-0.5">
            {(['bezorgen', 'afhalen'] as const).map(type => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-xs font-bold transition-all ${
                  orderType === type
                    ? 'bg-red-600 text-white shadow-[0_2px_8px_rgba(209,0,0,0.35)]'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {type === 'bezorgen' ? <Bike className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                {type === 'bezorgen' ? (language === 'nl' ? 'Bezorgen' : language === 'en' ? 'Delivery' : language === 'tr' ? 'Teslimat' : language === 'de' ? 'Liefern' : 'توصيل')
                                    : (language === 'nl' ? 'Afhalen'  : language === 'en' ? 'Pickup'   : language === 'tr' ? 'Gel al'   : language === 'de' ? 'Abholen' : 'استلام')}
              </button>
            ))}
          </div>

          <Link href="/menu" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors">Menu</Link>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Wissel weergave"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Language switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLang(v => !v)}
              className="flex items-center gap-1.5 p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Taal wijzigen"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">{language}</span>
            </button>
            {showLang && (
              <div className="absolute top-full right-0 mt-2 bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8 rounded-xl shadow-lg overflow-hidden z-50 min-w-[148px]">
                {LANGS.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLanguage(l.code); setShowLang(false) }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${
                      language === l.code
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {LANG_NAMES[language][l.code]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {userMode !== 'guest' && (
            <Link href="/account" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors">Account</Link>
          )}
          <div
            ref={cartRef}
            className="relative"
            onMouseEnter={() => setShowCart(true)}
            onMouseLeave={() => setShowCart(false)}
          >
            <button
              onClick={() => setShowCart(v => !v)}
              className="relative flex items-center gap-2 bg-red-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(209,0,0,0.35)] hover:bg-red-700 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Bestelling
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-red-600 text-[9px] font-black rounded-full flex items-center justify-center border-2 border-red-600">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showCart && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  {items.length === 0 ? (
                    <div className="p-5 text-center">
                      <ShoppingBag className="w-8 h-8 text-gray-200 dark:text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        {language === 'nl' ? 'Je winkelwagen is leeg' : language === 'de' ? 'Dein Warenkorb ist leer' : 'Your cart is empty'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 space-y-1.5 max-h-60 overflow-y-auto">
                        {items.map(item => {
                          const dl = language === 'de' ? 'en' : language
                          return (
                            <div key={item.id} className="flex items-center justify-between gap-2 px-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs font-black text-red-600 w-5 flex-shrink-0">{item.quantity}×</span>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                    {item.menu_item[`name_${dl}` as keyof typeof item.menu_item] as string}
                                  </p>
                                  {(item.selected_options ?? []).length > 0 && (
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                                      {(item.selected_options ?? []).map(o => o[`name_${dl}` as keyof typeof o] as string).join(' · ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm font-bold text-gray-900 dark:text-gray-100 flex-shrink-0">
                                {formatEuros((item.menu_item.price + (item.selected_options ?? []).reduce((s, o) => s + o.price, 0)) * item.quantity)}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="border-t border-black/8 dark:border-white/8 p-3 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                            {language === 'nl' ? 'Totaal' : language === 'de' ? 'Gesamt' : 'Total'}
                          </p>
                          <p className="font-black text-gray-900 dark:text-gray-100 text-base">{formatEuros(getSubtotal())}</p>
                        </div>
                        <Link
                          href="/winkelwagen"
                          onClick={() => setShowCart(false)}
                          className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(209,0,0,0.35)] hover:bg-red-700 transition-colors"
                        >
                          {language === 'nl' ? 'Bekijken' : language === 'de' ? 'Ansehen' : 'View cart'}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <div className="w-full">
        <StoreHydration />
        <OfflineBanner />
        <main className={`${isStartPage ? 'pt-0' : 'pt-[49px]'} md:pt-0 ${isStartPage ? 'pb-0' : 'pb-20'} md:pb-0`}>
          {children}
        </main>
        {!isStartPage && <BottomNav />}
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '12px',
            color: '#111111',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          },
        }}
      />
    </div>
  )
}
