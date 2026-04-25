'use client'

import { motion } from 'framer-motion'
import { Star, Tag } from 'lucide-react'
import type { Language } from '@/lib/types'

export function HeroSection({ language }: { language: Language }) {
  const taglines: Record<Language, string> = {
    nl: 'Verse Turkse smaken, bezorgd aan jouw deur',
    en: 'Fresh Turkish flavours, delivered to your door',
    tr: 'Taze Türk lezzetleri, kapınıza teslim',
    ar: 'نكهات تركية طازجة، تُوصل إلى بابك',
    de: 'Frische türkische Aromen, direkt zu dir geliefert',
  }
  const promos: Record<Language, string> = {
    nl: '🎉 Gebruik MOZAIK10 voor 10% korting op je eerste bestelling!',
    en: '🎉 Use MOZAIK10 for 10% off your first order!',
    tr: '🎉 İlk siparişinizde %10 indirim için MOZAIK10 kullanın!',
    ar: '🎉 استخدم MOZAIK10 للحصول على خصم 10% على أول طلب!',
    de: '🎉 Nutze MOZAIK10 für 10% Rabatt auf deine erste Bestellung!',
  }

  return (
    <div className="relative mx-4 mb-4 mt-2 overflow-hidden rounded-2xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-mozaik-red via-mozaik-red to-mozaik-red-dark" />

      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white transform translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white transform -translate-x-12 translate-y-12" />
      </div>

      <div className="relative px-5 py-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-white/80 text-sm mb-1">{taglines[language]}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-white/90 text-xs ml-1">4.8 · 230+ reviews</span>
          </div>

          {/* Promo banner */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-lg px-3 py-2">
            <Tag className="w-3.5 h-3.5 text-white flex-shrink-0" />
            <p className="text-white text-xs font-medium">{promos[language]}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
