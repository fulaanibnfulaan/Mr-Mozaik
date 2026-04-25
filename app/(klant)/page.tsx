'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bike, Store, ArrowRight, Shield } from 'lucide-react'
import { useAppStore } from '@/store/app'

export default function WelcomePage() {
  const { language, setUserMode, setOrderType } = useAppStore()
  const router = useRouter()
  const [selected, setSelected] = useState<'afhalen' | 'bezorgen' | null>(null)

  const t = {
    nl: {
      welkom: 'Welkom bij Mr. Mozaik',
      sub: 'Turks & mediterraans eten in Harderwijk',
      afhalen: 'Afhalen',
      afhalen_sub: 'Bestel online, haal op in de zaak',
      bezorgen: 'Bezorgen',
      bezorgen_sub: 'Wij bezorgen bij jou thuis',
      verder: 'Volgende stap',
      kies: 'Kies een optie om verder te gaan',
      eigenaar: 'Ik ben de eigenaar',
    },
    en: {
      welkom: 'Welcome to Mr. Mozaik',
      sub: 'Turkish & Mediterranean food in Harderwijk',
      afhalen: 'Pickup',
      afhalen_sub: 'Order online, pick up in store',
      bezorgen: 'Delivery',
      bezorgen_sub: 'We deliver to your door',
      verder: 'Next step',
      kies: 'Choose an option to continue',
      eigenaar: 'I am the owner',
    },
    de: {
      welkom: 'Willkommen bei Mr. Mozaik',
      sub: 'Türkisches & mediterranes Essen in Harderwijk',
      afhalen: 'Abholung',
      afhalen_sub: 'Online bestellen, im Laden abholen',
      bezorgen: 'Lieferung',
      bezorgen_sub: 'Wir liefern zu dir nach Hause',
      verder: 'Nächster Schritt',
      kies: 'Wähle eine Option um fortzufahren',
      eigenaar: 'Ich bin der Inhaber',
    },
    tr: {
      welkom: "Mr. Mozaik'e Hoş Geldiniz",
      sub: "Harderwijk'te Türk ve Akdeniz mutfağı",
      afhalen: 'Gel-Al',
      afhalen_sub: 'Online sipariş ver, gel al',
      bezorgen: 'Teslimat',
      bezorgen_sub: 'Kapına teslim ediyoruz',
      verder: 'Sonraki adım',
      kies: 'Devam etmek için bir seçenek seç',
      eigenaar: 'Ben sahibim',
    },
    ar: {
      welkom: 'مرحباً بك في Mr. Mozaik',
      sub: 'مطبخ تركي ومتوسطي في هاردرويك',
      afhalen: 'استلام',
      afhalen_sub: 'اطلب عبر الإنترنت واستلم من المطعم',
      bezorgen: 'توصيل',
      bezorgen_sub: 'نوصل إلى بابك',
      verder: 'الخطوة التالية',
      kies: 'اختر خياراً للمتابعة',
      eigenaar: 'أنا المالك',
    },
  }[language]

  const handleVolgende = () => {
    if (!selected) return
    setOrderType(selected)
    setUserMode('guest')
    router.push('/menu')
  }

  return (
    <div
      className="min-h-[calc(100vh-49px)] md:min-h-screen flex flex-col -mt-[49px] md:mt-0"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Hero */}
      <div className="relative w-full h-[40vh] md:h-[45vh] flex-shrink-0">
        <Image
          src="/hero.jpg"
          alt="Mr. Mozaik"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.0) 50%, rgba(234,229,214,0.85) 90%, #EAE5D6 100%)' }} />
        <div className="absolute inset-0 opacity-0 dark:opacity-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.0) 50%, rgba(3,7,18,0.85) 90%, #030712 100%)' }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-5 pt-6 pb-10 max-w-md mx-auto w-full">
        {/* Logo + naam */}
        <motion.div
          className="flex flex-col items-center mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Image src="/logo.png" alt="Mr. Mozaik" width={72} height={72} className="h-16 w-auto mb-3 drop-shadow" />
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-100 text-center">{t.welkom}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">{t.sub}</p>
        </motion.div>

        {/* Keuzekaarten */}
        <motion.div
          className="w-full grid grid-cols-2 gap-3 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >
          {([
            { key: 'afhalen', icon: Store, label: t.afhalen, sub: t.afhalen_sub },
            { key: 'bezorgen', icon: Bike, label: t.bezorgen, sub: t.bezorgen_sub },
          ] as const).map(({ key, icon: Icon, label, sub }) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`flex flex-col items-center text-center gap-3 p-5 rounded-2xl border-2 transition-all ${
                selected === key
                  ? 'border-red-600 bg-red-50 dark:bg-red-900/20 shadow-[0_4px_20px_rgba(209,0,0,0.2)]'
                  : 'border-black/8 dark:border-white/8 bg-[#F5F0E8] dark:bg-gray-800 hover:border-red-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selected === key ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                <Icon className={`w-6 h-6 ${selected === key ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              </div>
              <div>
                <p className={`font-bold text-sm ${selected === key ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>{label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">{sub}</p>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Volgende stap knop */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <button
            onClick={handleVolgende}
            disabled={!selected}
            className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all ${
              selected
                ? 'bg-red-600 text-white shadow-[0_4px_20px_rgba(209,0,0,0.4)] hover:bg-red-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            {t.verder}
            <ArrowRight className="w-4 h-4" />
          </button>
          {!selected && (
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">{t.kies}</p>
          )}
        </motion.div>

        {/* Eigenaar link */}
        <Link
          href="/admin"
          className="flex items-center justify-center gap-1.5 mt-6 text-gray-400 dark:text-gray-500 text-xs font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <Shield className="w-3 h-3" />
          {t.eigenaar}
        </Link>
      </div>
    </div>
  )
}
