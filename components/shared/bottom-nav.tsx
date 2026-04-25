'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ShoppingBag, User, Globe } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAppStore } from '@/store/app'
import type { Language } from '@/lib/types'

const labels: Record<Language, { menu: string; cart: string; account: string }> = {
  nl: { menu: 'Menu', cart: 'Bestelling', account: 'Account' },
  en: { menu: 'Menu', cart: 'Cart',       account: 'Account' },
  tr: { menu: 'Menü', cart: 'Sepet',      account: 'Hesap'   },
  ar: { menu: 'القائمة', cart: 'السلة',   account: 'الحساب'  },
  de: { menu: 'Menü', cart: 'Warenkorb',  account: 'Konto'   },
}

const LANGS: { code: Language }[] = [
  { code: 'nl' },
  { code: 'en' },
  { code: 'tr' },
  { code: 'ar' },
  { code: 'de' },
]

const LANG_NAMES: Record<Language, Record<Language, string>> = {
  nl: { nl: 'Nederlands', en: 'Engels',         tr: 'Turks',       ar: 'Arabisch',  de: 'Duits'          },
  en: { nl: 'Dutch',      en: 'English',         tr: 'Turkish',     ar: 'Arabic',    de: 'German'         },
  tr: { nl: 'Hollandaca', en: 'İngilizce',       tr: 'Türkçe',      ar: 'Arapça',    de: 'Almanca'        },
  ar: { nl: 'الهولندية',  en: 'الإنجليزية',      tr: 'التركية',     ar: 'العربية',   de: 'الألمانية'      },
  de: { nl: 'Niederländisch', en: 'Englisch',    tr: 'Türkisch',    ar: 'Arabisch',  de: 'Deutsch'        },
}

export function BottomNav() {
  const pathname  = usePathname()
  const itemCount = useCartStore(s => s.getItemCount())
  const { language, setLanguage } = useAppStore()
  const t = labels[language]
  const [showLang, setShowLang] = useState(false)

  const tabs = [
    { href: '/',            icon: Home,        label: t.menu    },
    { href: '/winkelwagen', icon: ShoppingBag, label: t.cart,    badge: itemCount > 0 ? itemCount : undefined },
    { href: '/account',     icon: User,        label: t.account },
  ]

  return (
    <>
      {/* Language picker sheet */}
      <AnimatePresence>
        {showLang && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowLang(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="fixed bottom-16 left-0 right-0 z-50 bg-[#F5F0E8] dark:bg-gray-800 rounded-t-2xl shadow-2xl overflow-hidden"
            >
              {LANGS.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLanguage(l.code); setShowLang(false) }}
                  className={`w-full text-left px-6 py-4 text-sm font-semibold border-b border-black/5 last:border-0 transition-colors ${
                    language === l.code ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {LANG_NAMES[language][l.code]}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 safe-bottom bg-[#EAE5D6] dark:bg-gray-950 border-t border-black/5 dark:border-white/5 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map(tab => {
            const isActive = pathname === tab.href
            const Icon = tab.icon
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl touch-target"
              >
                {isActive && (
                  <motion.div
                    layoutId="navActive"
                    className="absolute inset-0 bg-red-50 dark:bg-red-900/20 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <div className="relative z-10">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-red-600' : 'text-gray-300'}`} />
                  {tab.badge !== undefined && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center"
                    >
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </motion.div>
                  )}
                </div>
                <span className={`text-[10px] font-bold transition-colors relative z-10 ${isActive ? 'text-red-600' : 'text-gray-300'}`}>
                  {tab.label}
                </span>
              </Link>
            )
          })}

          {/* Language button */}
          <button
            onClick={() => setShowLang(v => !v)}
            className="relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl touch-target"
          >
            <Globe className="w-5 h-5 text-gray-300" />
            <span className="text-[10px] font-bold text-gray-300 uppercase">{language}</span>
          </button>
        </div>
      </nav>
    </>
  )
}
