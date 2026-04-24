'use client'

import { motion } from 'framer-motion'
import { Star, Gift, Trophy, ShoppingBag, Heart, MapPin, Utensils, Globe, Bell, Building2, ChevronRight, LogOut, Flame } from 'lucide-react'
import { useAppStore } from '@/store/app'
import { getLoyaltyLevel, getNextLoyaltyThreshold, LOYALTY_THRESHOLDS } from '@/lib/utils'
import type { Language } from '@/lib/types'

const PROFILE = { name: 'Yilmaz Demir', loyalty_points: 245, stamp_count: 7, streak_weeks: 4 }
export default function AccountPage() {
  const { language } = useAppStore()

  const pts = PROFILE.loyalty_points
  const level = getLoyaltyLevel(pts)
  const next = getNextLoyaltyThreshold(pts)
  const progress = ((pts - LOYALTY_THRESHOLDS[level]) / (next - LOYALTY_THRESHOLDS[level])) * 100
  const levelBadge = { brons: '🥉', zilver: '🥈', goud: '🥇' }
  const levelName: Record<Language, Record<string, string>> = {
    nl: { brons: 'Brons', zilver: 'Zilver', goud: 'Goud' },
    en: { brons: 'Bronze', zilver: 'Silver', goud: 'Gold' },
    tr: { brons: 'Bronz', zilver: 'Gümüş', goud: 'Altın' },
    ar: { brons: 'برونزي', zilver: 'فضي', goud: 'ذهبي' },
  }

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
        <div className="absolute inset-0 bg-gradient-to-b from-night-3 to-transparent" />
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
            <div className="flex items-center gap-1.5 mt-0.5">
              <span>{levelBadge[level]}</span>
              <span className="text-sand/60 text-sm">{levelName[language][level]} Member</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-12 space-y-3">
        {/* Points card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-night p-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-ember/5 rounded-full -translate-y-8 translate-x-8 blur-xl" />
          <div className="flex items-start justify-between mb-4 relative">
            <div>
              <p className="text-sand/40 text-xs uppercase tracking-widest mb-1">
                {language === 'nl' ? 'Loyaliteitspunten' : language === 'en' ? 'Loyalty points' : language === 'tr' ? 'Sadakat puanları' : 'نقاط الولاء'}
              </p>
              <div className="flex items-end gap-1.5">
                <span className="font-display font-bold text-cream text-5xl">{pts}</span>
                <span className="text-sand/40 text-sm mb-1">pts</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-ember/15 border border-ember/25 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6 text-ember fill-ember/50" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-sand/40">
              <span>{levelName[language][level]}</span>
              <span>{next} pts → {levelName[language][level === 'brons' ? 'zilver' : 'goud']}</span>
            </div>
            <div className="h-1.5 bg-night-2 rounded-full overflow-hidden">
              <motion.div className="h-full bg-ember-gradient rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: 0.3 }} />
            </div>
          </div>
          <button className="btn-ember w-full mt-4 py-2.5 rounded-xl text-sm">
            {language === 'nl' ? 'Punten inwisselen' : language === 'en' ? 'Redeem points' : language === 'tr' ? 'Puanları kullan' : 'استبدال النقاط'}
          </button>
        </motion.div>

        {/* Stamp card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card-night p-4">
          <div className="flex justify-between items-baseline mb-3">
            <h2 className="font-semibold text-cream text-sm">
              {language === 'nl' ? 'Stempelkaart' : language === 'en' ? 'Stamp card' : language === 'tr' ? 'Damga kartı' : 'بطاقة الطوابع'}
            </h2>
            <span className="text-sand/40 text-xs">{PROFILE.stamp_count}/10</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }}
                className={`aspect-square rounded-xl flex items-center justify-center text-base border ${
                  i < PROFILE.stamp_count
                    ? 'bg-ember/20 border-ember/40 shadow-ember'
                    : 'bg-night-2 border-gold/10'
                }`}>
                {i < PROFILE.stamp_count ? '🥙' : ''}
              </motion.div>
            ))}
          </div>
          <p className="text-sand/30 text-[11px] text-center mt-3">
            {10 - PROFILE.stamp_count} {language === 'nl' ? 'stempels voor gratis maaltijd' : 'stamps for a free meal'}
          </p>
        </motion.div>

        {/* Streak + badges */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="card-night p-4">
            <Flame className="w-5 h-5 text-orange-400 mb-2" />
            <span className="font-display font-bold text-cream text-3xl">{PROFILE.streak_weeks}</span>
            <p className="text-sand/40 text-[11px] mt-0.5">{language === 'nl' ? 'weken op rij 🔥' : 'week streak 🔥'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-night p-4">
            <Trophy className="w-5 h-5 text-gold mb-2" />
            <span className="font-display font-bold text-cream text-3xl">3</span>
            <p className="text-sand/40 text-[11px] mt-0.5">{language === 'nl' ? 'badges verdiend' : 'badges earned'}</p>
          </motion.div>
        </div>

        {/* Active challenge */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          className="rounded-2xl p-4 bg-gradient-to-r from-gold/20 to-amber-900/20 border border-gold/20">
          <div className="flex justify-between mb-2">
            <span className="text-gold text-[10px] font-bold uppercase tracking-wider">
              {language === 'nl' ? 'Actieve uitdaging' : 'Active challenge'}
            </span>
            <span className="text-[10px] font-bold bg-gold/20 text-gold border border-gold/30 rounded-full px-2 py-0.5">+50 pts</span>
          </div>
          <p className="text-cream text-sm font-medium mb-3">
            {language === 'nl' ? 'Bestel 3× dit weekend — 1/3' : 'Order 3× this weekend — 1/3'}
          </p>
          <div className="h-1.5 bg-night-2 rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full" style={{ width: '33%' }} />
          </div>
        </motion.div>

        {/* Menu links */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="card-night overflow-hidden">
          {menuLinks.map((item, i) => (
            <button key={i} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors border-b border-gold/[0.07] last:border-0">
              <div className="w-8 h-8 bg-night-2 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon className="w-3.5 h-3.5 text-sand/50" />
              </div>
              <span className="text-sm font-medium text-cream/80 flex-1 text-left">
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
