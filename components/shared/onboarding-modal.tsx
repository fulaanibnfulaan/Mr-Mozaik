'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, MapPin } from 'lucide-react'
import { useAppStore } from '@/store/app'
import type { Language, DietaryPreferences } from '@/lib/types'

const LANGUAGES = [
  { code: 'nl' as Language, label: 'Nederlands', flag: '🇳🇱' },
  { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
  { code: 'tr' as Language, label: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar' as Language, label: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'de' as Language, label: 'Deutsch', flag: '🇩🇪' },
]

const DIETARY: Array<{ key: keyof DietaryPreferences; nl: string; en: string; tr: string; ar: string; de: string; icon: string }> = [
  { key: 'vegetarian',  nl: 'Vegetarisch',     en: 'Vegetarian',    tr: 'Vejetaryen',  ar: 'نباتي',            de: 'Vegetarisch',  icon: '🌿' },
  { key: 'no_onion',    nl: 'Geen ui',          en: 'No onion',      tr: 'Soğansız',    ar: 'بدون بصل',         de: 'Ohne Zwiebeln', icon: '🧅' },
  { key: 'no_coriander',nl: 'Geen koriander',   en: 'No coriander',  tr: 'Kişnişsiz',   ar: 'بدون كزبرة',       de: 'Ohne Koriander', icon: '🌱' },
  { key: 'no_nuts',     nl: 'Geen noten',       en: 'No nuts',       tr: 'Fındıksız',   ar: 'بدون مكسرات',      de: 'Ohne Nüsse',   icon: '🥜' },
  { key: 'gluten_free', nl: 'Glutenvrij',       en: 'Gluten-free',   tr: 'Glutensiz',   ar: 'خالي من الجلوتين', de: 'Glutenfrei',   icon: '🌾' },
  { key: 'lactose_free',nl: 'Lactosevrij',      en: 'Lactose-free',  tr: 'Laktozsuz',   ar: 'خالي من اللاكتوز', de: 'Laktosefrei',  icon: '🥛' },
]

export function OnboardingModal() {
  const { onboardingComplete, completeOnboarding, language, setLanguage, setDietaryPreferences } = useAppStore()
  const [step, setStep] = useState(0)
  const [dietary, setDietary] = useState<DietaryPreferences>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true))
    if (useAppStore.persist.hasHydrated()) setHydrated(true)
    return unsub
  }, [])

  if (!hydrated || onboardingComplete) return null

  const isRTL = language === 'ar'
  const toggle = (key: keyof DietaryPreferences) => setDietary(p => ({ ...p, [key]: !p[key] }))
  const finish = () => { setDietaryPreferences(dietary); completeOnboarding() }

  const nextLabels: Record<Language, string[]> = {
    nl: ['Volgende', 'Volgende', 'Begin met bestellen'],
    en: ['Next', 'Next', 'Start ordering'],
    tr: ['İleri', 'İleri', 'Sipariş ver'],
    ar: ['التالي', 'التالي', 'ابدأ الطلب'],
    de: ['Weiter', 'Weiter', 'Jetzt bestellen'],
  }
  const skipLabels: Record<Language, string> = { nl: 'Overslaan', en: 'Skip', tr: 'Atla', ar: 'تخطي', de: 'Überspringen' }

  return (
    <div className="fixed inset-0 z-[100] bg-night pattern-bg flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Geometric background ornament */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-0 right-0 w-80 h-80 opacity-[0.04]" viewBox="0 0 200 200">
          <path d="M100 0 L118 68 L190 68 L130 110 L152 180 L100 140 L48 180 L70 110 L10 68 L82 68 Z" stroke="#D4943A" strokeWidth="1" fill="none" />
          <circle cx="100" cy="100" r="90" stroke="#C8102E" strokeWidth="0.5" fill="none" />
          <circle cx="100" cy="100" r="70" stroke="#D4943A" strokeWidth="0.3" fill="none" />
          <circle cx="100" cy="100" r="50" stroke="#C8102E" strokeWidth="0.3" fill="none" />
        </svg>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-ember/5 rounded-full blur-3xl" />
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 pt-14 pb-8 relative">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{
              width: i === step ? 28 : 8,
              backgroundColor: i <= step ? '#C8102E' : 'rgba(212,148,58,0.2)',
            }}
            className="h-1.5 rounded-full"
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: isRTL ? -24 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 24 : -24 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          >
            {step === 0 && (
              <div className="flex flex-col">
                {/* Emblem */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-ember/20 rounded-3xl rotate-12 scale-90" />
                  <div className="absolute inset-0 bg-ember-gradient rounded-3xl flex items-center justify-center shadow-ember-lg">
                    <span className="font-display font-bold text-white text-4xl">M</span>
                  </div>
                </div>
                <h1 className="font-display font-bold text-cream text-3xl text-center mb-1">Mr. Mozaik</h1>
                <p className="text-sand/60 text-center text-sm mb-8">
                  {language === 'nl' ? 'Kies je taal om te beginnen' :
                   language === 'en' ? 'Choose your language to begin' :
                   language === 'tr' ? 'Başlamak için dilinizi seçin' : 'اختر لغتك للبدء'}
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        language === l.code
                          ? 'border-ember bg-ember/10 text-cream'
                          : 'border-gold/15 bg-night-3 text-sand/70 hover:border-gold/30'
                      }`}
                    >
                      <span className="text-2xl">{l.flag}</span>
                      <span className="font-semibold text-sm">{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col">
                <h2 className="font-display font-bold text-cream text-2xl mb-1">
                  {language === 'nl' ? 'Dieetwensen' : language === 'en' ? 'Dietary preferences' : language === 'tr' ? 'Diyet tercihleri' : 'التفضيلات الغذائية'}
                </h2>
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5 mb-5 text-xs text-green-400">
                  🌙 {language === 'nl' ? 'Ons hele menu is halal' : language === 'en' ? 'Our entire menu is halal' : language === 'tr' ? 'Tüm menümüz helal' : 'قائمتنا بأكملها حلال'}
                </div>
                <div className="space-y-2">
                  {DIETARY.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => toggle(opt.key)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left ${
                        dietary[opt.key]
                          ? 'border-ember bg-ember/10 text-cream'
                          : 'border-gold/15 bg-night-3 text-sand/70 hover:border-gold/25'
                      }`}
                    >
                      <span className="text-lg w-6 text-center">{opt.icon}</span>
                      <span className="font-medium text-sm flex-1">{opt[language]}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        dietary[opt.key] ? 'border-ember bg-ember' : 'border-gold/20'
                      }`}>
                        {dietary[opt.key] && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-night-3 border border-gold/20 rounded-2xl flex items-center justify-center mb-5">
                  <MapPin className="w-7 h-7 text-ember" />
                </div>
                <h2 className="font-display font-bold text-cream text-2xl mb-2">
                  {language === 'nl' ? 'Jouw adres' : language === 'en' ? 'Your address' : language === 'tr' ? 'Adresiniz' : language === 'de' ? 'Deine Adresse' : 'عنوانك'}
                </h2>
                <p className="text-sand/50 text-sm mb-6">
                  {language === 'nl' ? 'Sla je thuisadres op voor snelle bezorging' : language === 'en' ? 'Save your home address for fast delivery' : language === 'tr' ? 'Hızlı teslimat için ev adresinizi kaydedin' : language === 'de' ? 'Speichere deine Adresse für schnelle Lieferung' : 'احفظ عنوانك المنزلي'}
                </p>
                <div className="w-full relative mb-4">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ember/50" />
                  <input
                    type="text"
                    placeholder={language === 'nl' ? 'Typ je adres…' : language === 'en' ? 'Type your address…' : language === 'tr' ? 'Adresinizi yazın…' : language === 'de' ? 'Adresse eingeben…' : 'اكتب عنوانك…'}
                    className="w-full pl-9 pr-4 py-3 bg-night-3 border border-gold/15 focus:border-ember/50 rounded-xl text-sm text-cream placeholder:text-sand/30 outline-none transition-colors"
                  />
                </div>
                <div className="w-full h-36 bg-night-3 border border-gold/10 rounded-xl flex items-center justify-center mb-1">
                  <div className="text-center text-sand/30">
                    <MapPin className="w-7 h-7 mx-auto mb-1.5 opacity-40" />
                    <p className="text-xs">Kaart laden…</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="px-6 pb-10 pt-4 space-y-2.5 relative">
        <button
          onClick={() => step < 2 ? setStep(s => s + 1) : finish()}
          className="btn-ember w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base"
        >
          <span>{nextLabels[language][step]}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
        {step < 2 && (
          <button onClick={step === 1 ? () => setStep(2) : finish} className="w-full py-3 text-sand/40 text-sm font-medium">
            {skipLabels[language]}
          </button>
        )}
      </div>
    </div>
  )
}
