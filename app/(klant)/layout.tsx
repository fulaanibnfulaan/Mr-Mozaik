'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { Sun, Moon, Globe, Bike, Store, ChevronLeft } from 'lucide-react'
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
  const hideStartBtn = pathname === '/' || pathname === '/winkelwagen' || pathname === '/checkout'
  const isCheckout = pathname === '/checkout'
  const hideOrderToggle = pathname === '/' || pathname === '/checkout' || pathname === '/menu' || pathname === '/winkelwagen' || pathname === '/register' || pathname === '/wachtwoord-vergeten'
  const [dark, setDark] = useState(false)
  const [showLang, setShowLang] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

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
      {/* Welkomspagina toolbar — taal + donkere modus */}
      {isStartPage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-1">
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Wissel weergave"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="relative" onMouseEnter={() => setShowLang(true)} onMouseLeave={() => setShowLang(false)}>
            <button className="flex items-center gap-1.5 p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <Globe className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">{language}</span>
            </button>
            <AnimatePresence>
              {showLang && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8 rounded-xl shadow-lg overflow-hidden z-50 min-w-[148px]"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Mobile top strip — hidden on desktop, hidden on start page */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 items-center justify-between px-4 py-2.5 bg-[#EAE5D6]/80 dark:bg-gray-950/80 backdrop-blur-xl ${isStartPage ? 'hidden' : 'flex'}`}>
        {!hideStartBtn && (
          <Link href="/" className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-bold">Start</span>
          </Link>
        )}
        {!hideOrderToggle && (
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
        )}
      </div>

      {/* Desktop top nav — hidden on mobile, hidden on start page */}
      <nav className={`${isStartPage || isCheckout ? '!hidden' : 'hidden md:flex'} items-center justify-between px-8 py-4 bg-[#EAE5D6] dark:bg-gray-900 border-b border-black/5 dark:border-gray-800 sticky top-0 z-50 shadow-sm`}>
        {!hideStartBtn ? (
          <Link href="/" className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-bold">Start</span>
          </Link>
        ) : <div />}
        <div className="flex items-center gap-8">
          {/* Bezorgen / Afhalen toggle */}
          {!hideOrderToggle && (
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
          )}

          {!hideOrderToggle && (
            <Link href="/menu" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors">Menu</Link>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Wissel weergave"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Language switcher */}
          <div className="relative" ref={langRef} onMouseEnter={() => setShowLang(true)} onMouseLeave={() => setShowLang(false)}>
            <button
              className="flex items-center gap-1.5 p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Taal wijzigen"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">{language}</span>
            </button>
            <AnimatePresence>
              {showLang && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8 rounded-xl shadow-lg overflow-hidden z-50 min-w-[148px]"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {userMode !== 'guest' && (
            <Link href="/account" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors">Account</Link>
          )}
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
