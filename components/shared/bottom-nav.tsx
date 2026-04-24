'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ShoppingBag, User } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAppStore } from '@/store/app'
import type { Language } from '@/lib/types'

const labels: Record<Language, { menu: string; cart: string; account: string }> = {
  nl: { menu: 'Menu', cart: 'Bestelling', account: 'Account' },
  en: { menu: 'Menu', cart: 'Cart',       account: 'Account' },
  tr: { menu: 'Menü', cart: 'Sepet',      account: 'Hesap'   },
  ar: { menu: 'القائمة', cart: 'السلة',   account: 'الحساب'  },
}

export function BottomNav() {
  const pathname  = usePathname()
  const itemCount = useCartStore(s => s.getItemCount())
  const { language } = useAppStore()
  const t = labels[language]

  const tabs = [
    { href: '/',            icon: Home,        label: t.menu    },
    { href: '/winkelwagen', icon: ShoppingBag, label: t.cart,    badge: itemCount > 0 ? itemCount : undefined },
    { href: '/account',     icon: User,        label: t.account },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 safe-bottom bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(tab => {
          const isActive = pathname === tab.href
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center gap-1 px-6 py-1.5 rounded-xl touch-target"
            >
              {isActive && (
                <motion.div
                  layoutId="navActive"
                  className="absolute inset-0 bg-red-50 rounded-xl"
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
      </div>
    </nav>
  )
}
