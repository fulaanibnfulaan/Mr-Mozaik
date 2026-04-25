'use client'

import { motion } from 'framer-motion'
import { Gift, ShoppingBag, Heart, MapPin, Utensils, Globe, Bell, Building2, ChevronRight, LogOut } from 'lucide-react'
import { useAppStore } from '@/store/app'
import type { Language } from '@/lib/types'

const PROFILE = { name: 'Yilmaz Demir', stamp_count: 7 }
export default function AccountPage() {
  const { language } = useAppStore()

  const menuLinks = [
    { icon: ShoppingBag, nl: 'Ordergeschiedenis', en: 'Order history', tr: 'Sipariş geçmişi', ar: 'سجل الطلبات' },
    { icon: Heart, nl: 'Favorieten', en: 'Favorites', tr: 'Favoriler', ar: 'المفضلة' },
    { icon: MapPin, nl: 'Mijn adressen', en: 'My addresses', tr: 'Adreslerim', ar: 'عناويني' },
    { icon: Utensils, nl: 'Dieetwensen', en: 'Dietary preferences', tr: 'Diyet tercihleri', ar: 'التفضيلات الغذائية' },
    { icon: Globe, nl: 'Taalinstellingen', en: 'Language', tr: 'Dil', ar: 'اللغة' },
    { icon: Bell, nl: 'Notificaties', en: 'Notifications', tr: 'Bildirimler', ar: 'الإشعارات' },
    { icon: Building2, nl: 'Zakelijk account', en: 'Business account', tr: 'Kurumsal hesap', ar: 'حساب الأعمال' },
  ]

  return (
    <div className="page-fade pb-24" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header hero */}
      <div className="relative px-4 pt-8 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 dark:from-gray-900 to-transparent" />
        <svg className="absolute top-0 right-0 w-48 h-48 opacity-[0.05]" viewBox="0 0 200 200">
          <path d="M100 0 L118 68 L190 68 L130 110 L152 180 L100 140 L48 180 L70 110 L10 68 L82 68 Z" stroke="#D4943A" strokeWidth="1.5" fill="none" />
          <circle cx="100" cy="100" r="80" stroke="#C8102E" strokeWidth="0.5" fill="none" />
        </svg>
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 bg-ember/20 border border-ember/30 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="font-display font-bold text-cream text-2xl">{PROFILE.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-cream text-xl">{PROFILE.name}</h1>
            <span className="text-sand/60 text-sm">Member</span>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-12 space-y-3">
        {/* Stamp card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card-night p-4">
          <div className="mb-3">
            <div className="flex justify-between items-baseline">
              <h2 className="font-semibold text-cream text-sm">
                {language === 'nl' ? 'Stempelkaart' : language === 'en' ? 'Stamp card' : language === 'tr' ? 'Damga kartı' : 'بطاقة الطوابع'}
              </h2>
              <span className="text-sand/40 text-xs">{PROFILE.stamp_count}/10</span>
            </div>
            <p className="text-sand/50 text-[11px] mt-1">
              {language === 'nl'
                ? 'Ontvang 1 stempel bij elke besteedde €10,-. Volle stempelkaart? Ontvang €10,- korting op de eerstvolgende bestelling!'
                : language === 'en'
                ? 'Earn 1 stamp for every €10 spent. Full card? Get €10 off your next order!'
                : language === 'tr'
                ? 'Her €10 harcamada 1 damga kazan. Dolu kart? Sonraki siparişte €10 indirim!'
                : 'احصل على طابع لكل €10 تنفقه. بطاقة ممتلئة؟ احصل على خصم €10 على طلبك التالي!'}
            </p>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }}
                className={`aspect-square rounded-2xl flex items-center justify-center text-base border overflow-hidden ${
                  i < PROFILE.stamp_count
                    ? 'bg-ember/20 border-ember/40 shadow-ember'
                    : 'bg-night-2 border-gold/10'
                }`}>
                {i < PROFILE.stamp_count ? <img src="/logo.png" alt="" className="w-full h-full object-contain" /> : null}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Menu links */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="card-night overflow-hidden">
          {menuLinks.map((item, i) => (
            <button key={i} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors border-b border-gold/[0.07] last:border-0">
              <div className="w-8 h-8 bg-night-2 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon className="w-3.5 h-3.5 text-sand/50" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-100 flex-1 text-left">
                {item[language as keyof typeof item] as string}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-sand/20" />
            </button>
          ))}
        </motion.div>

        <button className="w-full flex items-center justify-center gap-2 py-4 text-ember/60 font-medium text-sm hover:text-ember transition-colors">
          <LogOut className="w-4 h-4" />
          {language === 'nl' ? 'Uitloggen' : language === 'en' ? 'Log out' : language === 'tr' ? 'Çıkış' : 'خروج'}
        </button>
      </div>
    </div>
  )
}
