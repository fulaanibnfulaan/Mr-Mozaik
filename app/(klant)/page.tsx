'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, User, Shield } from 'lucide-react'
import { useAppStore } from '@/store/app'

export default function WelcomePage() {
  const { language } = useAppStore()

  const t = {
    nl: {
      welkom: 'Welkom bij Mr. Mozaik',
      sub: 'Turks & mediterraans eten in Harderwijk. Vers bereid, 100% halal — bezorgd aan de deur of klaar om af te halen.',
      gast: 'Bestel als gast',
      account: 'Inloggen op je account',
      eigenaar: 'Ik ben de eigenaar',
    },
    en: {
      welkom: 'Welcome to Mr. Mozaik',
      sub: 'Turkish & Mediterranean food in Harderwijk. Freshly prepared, 100% halal — delivered to your door or ready to pick up.',
      gast: 'Order as guest',
      account: 'Log in to your account',
      eigenaar: 'I am the owner',
    },
    de: {
      welkom: 'Willkommen bei Mr. Mozaik',
      sub: 'Türkisches & mediterranes Essen in Harderwijk. Frisch zubereitet, 100% halal — geliefert oder zur Abholung bereit.',
      gast: 'Als Gast bestellen',
      account: 'In meinem Konto anmelden',
      eigenaar: 'Ich bin der Inhaber',
    },
    tr: {
      welkom: "Mr. Mozaik'e Hoş Geldiniz",
      sub: "Harderwijk'te Türk ve Akdeniz mutfağı. Taze hazırlanmış, %100 helal — kapınıza teslim veya gel-al.",
      gast: 'Misafir olarak sipariş ver',
      account: 'Hesabıma giriş yap',
      eigenaar: 'Ben sahibim',
    },
    ar: {
      welkom: 'مرحباً بك في Mr. Mozaik',
      sub: 'مطبخ تركي ومتوسطي في هاردرويك. طازج ومحضر يومياً، حلال 100% — توصيل إلى بابك أو استلام من المطعم.',
      gast: 'اطلب كضيف',
      account: 'تسجيل الدخول إلى حسابي',
      eigenaar: 'أنا المالك',
    },
  }[language]

  return (
    <div
      className="min-h-[calc(100vh-49px)] md:min-h-screen flex flex-col items-center justify-center px-6 py-12 -mt-[49px] md:mt-0"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Background hero blur */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image src="/hero.jpg" alt="" fill className="object-cover object-center scale-105 blur-sm opacity-20 dark:opacity-10" />
        <div className="absolute inset-0 bg-[#EAE5D6]/80 dark:bg-gray-950/90" />
      </div>

      <motion.div
        className="w-full max-w-sm flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Logo */}
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.3 }}>
          <Image src="/logo.png" alt="Mr. Mozaik" width={100} height={100} className="h-24 w-auto mb-6 drop-shadow-md" />
        </motion.div>

        {/* Title */}
        <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-gray-100 leading-tight mb-3">
          {t.welkom}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-10">
          {t.sub}
        </p>

        {/* Buttons */}
        <div className="w-full space-y-3">
          <Link
            href="/menu"
            className="flex items-center justify-between w-full bg-red-600 text-white font-bold px-5 py-4 rounded-2xl shadow-[0_4px_20px_rgba(209,0,0,0.4)] hover:bg-red-700 transition-colors"
          >
            <span>{t.gast}</span>
            <ChevronRight className="w-5 h-5 opacity-80" />
          </Link>

          <Link
            href="/account"
            className="flex items-center justify-between w-full bg-[#F5F0E8] dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold px-5 py-4 rounded-2xl border border-black/8 dark:border-white/8 hover:bg-[#ede8da] dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-red-600" />
              <span>{t.account}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 w-full py-3 text-gray-400 dark:text-gray-500 text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t.eigenaar}</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
