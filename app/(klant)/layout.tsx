'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Toaster } from 'sonner'
import { ShoppingBag, User, Home, Sun, Moon } from 'lucide-react'
import { BottomNav } from '@/components/shared/bottom-nav'
import { OfflineBanner } from '@/components/shared/offline-banner'
import { OnboardingModal } from '@/components/shared/onboarding-modal'
import { StoreHydration } from '@/components/shared/store-hydration'
import { useCartStore } from '@/store/cart'

export default function KlantLayout({ children }: { children: React.ReactNode }) {
  const itemCount = useCartStore(s => s.getItemCount())
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored === 'true') {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('darkMode', String(next))
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <div className="min-h-screen w-full bg-[#F4F4EF] dark:bg-gray-950">
      {/* Desktop top nav — hidden on mobile */}
      <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-[#F4F4EF] dark:bg-gray-900 border-b border-black/5 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Mr. Mozaik" className="h-16 w-auto" />
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors">Menu</Link>
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Wissel weergave"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link href="/account" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors">Account</Link>
          <Link href="/winkelwagen" className="relative flex items-center gap-2 bg-red-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_4px_12px_rgba(209,0,0,0.35)] hover:bg-red-700 transition-colors">
            <ShoppingBag className="w-4 h-4" />
            Bestelling
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-red-600 text-[9px] font-black rounded-full flex items-center justify-center border-2 border-red-600">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <div className="w-full">
        <StoreHydration />
        <OfflineBanner />
        <OnboardingModal />
        <main className="pb-20 md:pb-0">
          {children}
        </main>
        <BottomNav />
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
