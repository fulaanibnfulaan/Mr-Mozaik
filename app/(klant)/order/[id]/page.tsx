'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MessageCircle, Star, CheckCircle, Flame, Bike, Package } from 'lucide-react'
import { useAppStore } from '@/store/app'
import type { Language } from '@/lib/types'

const STATUS_STEPS = ['ontvangen', 'bereid', 'onderweg', 'afgeleverd'] as const
type OrderStatus = typeof STATUS_STEPS[number]

const statusLabels: Record<Language, Record<OrderStatus, string>> = {
  nl: { ontvangen: 'Ontvangen', bereid: 'Wordt bereid', onderweg: 'Onderweg', afgeleverd: 'Afgeleverd' },
  en: { ontvangen: 'Received', bereid: 'Preparing', onderweg: 'On the way', afgeleverd: 'Delivered' },
  tr: { ontvangen: 'Alındı', bereid: 'Hazırlanıyor', onderweg: 'Yolda', afgeleverd: 'Teslim edildi' },
  ar: { ontvangen: 'تم الاستلام', bereid: 'قيد التحضير', onderweg: 'في الطريق', afgeleverd: 'تم التوصيل' },
  de: { ontvangen: 'Erhalten', bereid: 'Wird zubereitet', onderweg: 'Unterwegs', afgeleverd: 'Geliefert' },
}

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  ontvangen: <CheckCircle className="w-5 h-5" />,
  bereid:    <Flame className="w-5 h-5" />,
  onderweg:  <Bike className="w-5 h-5" />,
  afgeleverd: <Package className="w-5 h-5" />,
}

export default function OrderTrackingPage() {
  const { id } = useParams()
  const router = useRouter()
  const { language } = useAppStore()

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('ontvangen')
  const [eta, setEta] = useState(22)
  const [showReviewPopup, setShowReviewPopup] = useState(false)
  const [rating, setRating] = useState(0)

  useEffect(() => {
    const statuses: OrderStatus[] = ['ontvangen', 'bereid', 'onderweg', 'afgeleverd']
    let idx = 0
    const interval = setInterval(() => {
      idx++
      if (idx < statuses.length) {
        setCurrentStatus(statuses[idx])
        if (statuses[idx] === 'afgeleverd') setTimeout(() => setShowReviewPopup(true), 2000)
      } else {
        clearInterval(interval)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (eta <= 0 || currentStatus === 'afgeleverd') return
    const t = setTimeout(() => setEta(e => Math.max(0, e - 1)), 60000)
    return () => clearTimeout(t)
  }, [eta, currentStatus])

  const currentIdx = STATUS_STEPS.indexOf(currentStatus)
  const labels = statusLabels[language]

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 md:top-[97px] bg-[#EAE5D6]/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-black/8 dark:border-white/5 px-4 py-4 z-10 flex items-center gap-3">
        <button onClick={() => router.push('/')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8">
          <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="font-display font-bold text-xl text-gray-900 dark:text-gray-100">
            {language === 'nl' ? 'Jouw bestelling' : language === 'en' ? 'Your order' : language === 'tr' ? 'Siparişiniz' : language === 'de' ? 'Deine Bestellung' : 'طلبك'}
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">#{id?.toString().toUpperCase()}</p>
        </div>
      </div>

      <div className="px-4 md:px-8 pt-5 pb-8 space-y-4 max-w-2xl mx-auto md:max-w-3xl">
        {/* ETA card */}
        {currentStatus !== 'afgeleverd' && (
          <motion.div
            className="relative overflow-hidden rounded-2xl p-6 text-center"
            style={{ background: 'linear-gradient(135deg, #C8102E 0%, #8B0B1F 100%)', boxShadow: '0 8px 40px rgba(200,16,46,0.5)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="absolute inset-0 opacity-10">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <path d="M100 10 L120 80 L190 80 L135 125 L155 195 L100 150 L45 195 L65 125 L10 80 L80 80 Z" stroke="white" strokeWidth="1" fill="none" />
              </svg>
            </div>
            <p className="text-white/70 text-sm mb-1">
              {language === 'nl' ? 'Geschatte tijd' : language === 'en' ? 'Estimated time' : language === 'tr' ? 'Tahmini süre' : language === 'de' ? 'Geschätzte Zeit' : 'الوقت المتوقع'}
            </p>
            <motion.div key={eta} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="font-display font-bold text-6xl text-white mb-1">
              {eta}
            </motion.div>
            <p className="text-white/70 text-sm">
              {language === 'nl' ? 'minuten' : language === 'en' ? 'minutes' : language === 'tr' ? 'dakika' : language === 'de' ? 'Minuten' : 'دقيقة'}
            </p>
          </motion.div>
        )}

        {/* Status tracker */}
        <div className="bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/5 rounded-2xl shadow-sm p-5">
          <div className="relative">
            <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700" />
            <motion.div
              className="absolute left-5 top-6 w-0.5 bg-red-600 origin-top"
              animate={{ height: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <div className="space-y-6">
              {STATUS_STEPS.map((step, i) => {
                const isDone = i <= currentIdx
                const isCurrent = i === currentIdx
                return (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 relative"
                  >
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isDone
                        ? 'bg-red-600 text-white shadow-[0_4px_12px_rgba(209,0,0,0.4)]'
                        : 'bg-gray-200 dark:bg-gray-700 border border-black/8 dark:border-white/5 text-gray-300 dark:text-gray-600'
                    } ${isCurrent ? 'ring-4 ring-red-600/20' : ''}`}>
                      {isCurrent && isDone && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-red-600/30"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      {statusIcons[step]}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${isDone ? 'text-gray-900 dark:text-gray-100' : 'text-gray-300 dark:text-gray-600'}`}>
                        {labels[step]}
                      </p>
                      {isCurrent && currentStatus !== 'afgeleverd' && (
                        <motion.div className="flex gap-1 mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {[0, 1, 2].map(d => (
                            <motion.div
                              key={d}
                              className="w-1.5 h-1.5 bg-red-600 rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ delay: d * 0.15, duration: 0.6, repeat: Infinity }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Live map placeholder (onderweg) */}
        {currentStatus === 'onderweg' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="h-44 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-gray-400" />
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gray-400" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gray-400" />
              </div>
              <div className="text-center relative z-10">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  <Bike className="w-10 h-10 text-red-600 mx-auto mb-2" />
                </motion.div>
                <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
                  {language === 'nl' ? 'Live kaart laden...' : language === 'de' ? 'Live-Karte laden...' : 'Loading live map...'}
                </p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600/10 dark:bg-red-600/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🛵</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">Ahmed K.</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{language === 'nl' ? 'Jouw bezorger' : language === 'de' ? 'Dein Fahrer' : 'Your delivery driver'}</p>
              </div>
              <button className="ml-auto flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-[0_4px_12px_rgba(209,0,0,0.35)]">
                <MessageCircle className="w-3.5 h-3.5" />
                Chat
              </button>
            </div>
          </motion.div>
        )}

        {/* Order summary */}
        <div className="bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/5 rounded-2xl shadow-sm p-4">
          <h3 className="font-semibold text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            {language === 'nl' ? 'Bestelling' : language === 'en' ? 'Order' : language === 'tr' ? 'Sipariş' : language === 'de' ? 'Bestellung' : 'الطلب'}
          </h3>
          <div className="space-y-2">
            {[
              { name: 'Kip Shoarma Wrap', qty: 2, price: 19.00 },
              { name: 'Mozaik Frietjes', qty: 1, price: 4.50 },
              { name: 'Ayran', qty: 2, price: 5.00 },
            ].map(item => (
              <div key={item.name} className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{item.qty}× {item.name}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">€{item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="h-px bg-black/8 dark:bg-white/8 my-1" />
            <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100">
              <span>Totaal</span><span>€28.50</span>
            </div>
          </div>
        </div>

        {/* Chat */}
        <button className="w-full flex items-center justify-center gap-2 py-3.5 border border-black/8 dark:border-white/8 bg-[#F5F0E8] dark:bg-gray-800 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-red-300 hover:text-red-600 transition-colors">
          <MessageCircle className="w-4 h-4" />
          {language === 'nl' ? 'Chat met restaurant' : language === 'en' ? 'Chat with restaurant' : language === 'tr' ? 'Restoran ile sohbet' : language === 'de' ? 'Mit Restaurant chatten' : 'الدردشة مع المطعم'}
        </button>
      </div>

      {/* Review popup */}
      <AnimatePresence>
        {showReviewPopup && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="w-full max-w-2xl bg-[#EAE5D6] dark:bg-gray-900 border-t border-black/8 dark:border-white/8 rounded-t-3xl p-6 pb-10"
            >
              <div className="w-12 h-1 bg-black/10 dark:bg-white/10 rounded-full mx-auto mb-5" />
              <div className="text-center">
                <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-100 mb-2">
                  {language === 'nl' ? 'Bestelling bezorgd!' : language === 'en' ? 'Order delivered!' : language === 'tr' ? 'Sipariş teslim edildi!' : language === 'de' ? 'Bestellung geliefert!' : 'تم توصيل طلبك!'}
                </h2>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-5">
                  {language === 'nl' ? 'Hoe was je eten?' : language === 'en' ? 'How was your food?' : language === 'tr' ? 'Yemeğiniz nasıldı?' : language === 'de' ? 'Wie war dein Essen?' : 'كيف كان طعامك؟'}
                </p>
                <div className="flex justify-center gap-3 mb-6">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      onClick={() => setRating(s)}
                      className={`text-3xl transition-transform hover:scale-110 ${s <= rating ? 'opacity-100' : 'opacity-30'}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <a
                  href="https://www.google.com/maps/search/MR+Mozaik+Harderwijk/@52.3559,5.6243,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 mb-3 shadow-[0_4px_16px_rgba(209,0,0,0.35)]"
                >
                  <Star className="w-4 h-4" />
                  {language === 'nl' ? 'Laat een review achter op Google' : language === 'de' ? 'Google-Bewertung hinterlassen' : 'Leave a Google review'}
                </a>
                <button onClick={() => setShowReviewPopup(false)} className="text-gray-400 dark:text-gray-500 text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {language === 'nl' ? 'Later' : language === 'en' ? 'Later' : language === 'tr' ? 'Daha sonra' : language === 'de' ? 'Später' : 'لاحقاً'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
