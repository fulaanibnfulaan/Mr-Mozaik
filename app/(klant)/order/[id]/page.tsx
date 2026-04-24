'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MessageCircle, Star, MapPin, CheckCircle, Flame, Bike, Package } from 'lucide-react'
import { useAppStore } from '@/store/app'
import type { Language } from '@/lib/types'

const STATUS_STEPS = ['ontvangen', 'bereid', 'onderweg', 'afgeleverd'] as const
type OrderStatus = typeof STATUS_STEPS[number]

const statusLabels: Record<Language, Record<OrderStatus, string>> = {
  nl: { ontvangen: 'Ontvangen', bereid: 'Wordt bereid', onderweg: 'Onderweg', afgeleverd: 'Afgeleverd' },
  en: { ontvangen: 'Received', bereid: 'Preparing', onderweg: 'On the way', afgeleverd: 'Delivered' },
  tr: { ontvangen: 'Alındı', bereid: 'Hazırlanıyor', onderweg: 'Yolda', afgeleverd: 'Teslim edildi' },
  ar: { ontvangen: 'تم الاستلام', bereid: 'قيد التحضير', onderweg: 'في الطريق', afgeleverd: 'تم التوصيل' },
}

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  ontvangen: <CheckCircle className="w-5 h-5" />,
  bereid: <Flame className="w-5 h-5" />,
  onderweg: <Bike className="w-5 h-5" />,
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
      <div className="sticky top-0 bg-night-2/95 backdrop-blur-xl border-b border-gold/10 px-4 py-4 z-10 flex items-center gap-3">
        <button onClick={() => router.push('/')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-night-3 border border-gold/15">
          <ArrowLeft className="w-5 h-5 text-sand/70" />
        </button>
        <div>
          <h1 className="font-display font-bold text-xl text-cream">
            {language === 'nl' ? 'Jouw bestelling' : language === 'en' ? 'Your order' : language === 'tr' ? 'Siparişiniz' : 'طلبك'}
          </h1>
          <p className="text-xs text-sand/40">#{id?.toString().toUpperCase()}</p>
        </div>
      </div>

      <div className="px-4 pt-5 pb-8 space-y-4">
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
              {language === 'nl' ? 'Geschatte tijd' : language === 'en' ? 'Estimated time' : language === 'tr' ? 'Tahmini süre' : 'الوقت المتوقع'}
            </p>
            <motion.div key={eta} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="font-display font-bold text-6xl text-white mb-1">
              {eta}
            </motion.div>
            <p className="text-white/70 text-sm">
              {language === 'nl' ? 'minuten' : language === 'en' ? 'minutes' : language === 'tr' ? 'dakika' : 'دقيقة'}
            </p>
          </motion.div>
        )}

        {/* Status tracker */}
        <div className="card-night p-5">
          <div className="relative">
            <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-night-2" />
            <motion.div
              className="absolute left-5 top-6 w-0.5 bg-ember origin-top"
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
                      isDone ? 'bg-ember text-white shadow-ember' : 'bg-night-2 border border-gold/10 text-sand/30'
                    } ${isCurrent ? 'ring-4 ring-ember/20' : ''}`}>
                      {isCurrent && isDone && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-ember/30"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      {statusIcons[step]}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${isDone ? 'text-cream' : 'text-sand/30'}`}>
                        {labels[step]}
                      </p>
                      {isCurrent && currentStatus !== 'afgeleverd' && (
                        <motion.div className="flex gap-1 mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {[0, 1, 2].map(d => (
                            <motion.div
                              key={d}
                              className="w-1.5 h-1.5 bg-ember rounded-full"
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
            className="card-night overflow-hidden rounded-2xl"
          >
            <div className="h-44 bg-night-3 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gold" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-gold" />
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gold" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gold" />
              </div>
              <div className="text-center relative z-10">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  <Bike className="w-10 h-10 text-ember mx-auto mb-2" />
                </motion.div>
                <p className="text-sm font-medium text-sand/50">
                  {language === 'nl' ? 'Live kaart laden...' : 'Loading live map...'}
                </p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-ember/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🛵</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-cream">Ahmed K.</p>
                <p className="text-xs text-sand/50">{language === 'nl' ? 'Jouw bezorger' : 'Your delivery driver'}</p>
              </div>
              <button className="ml-auto flex items-center gap-1.5 btn-ember text-xs font-bold px-3 py-2 rounded-lg">
                <MessageCircle className="w-3.5 h-3.5" />
                Chat
              </button>
            </div>
          </motion.div>
        )}

        {/* Order summary */}
        <div className="card-night p-4">
          <h3 className="font-semibold text-xs text-sand/50 uppercase tracking-wider mb-3">
            {language === 'nl' ? 'Bestelling' : language === 'en' ? 'Order' : language === 'tr' ? 'Sipariş' : 'الطلب'}
          </h3>
          <div className="space-y-2">
            {[
              { name: 'Kip Shoarma Wrap', qty: 2, price: 19.00 },
              { name: 'Mozaik Frietjes', qty: 1, price: 4.50 },
              { name: 'Ayran', qty: 2, price: 5.00 },
            ].map(item => (
              <div key={item.name} className="flex justify-between text-sm">
                <span className="text-sand/60">{item.qty}× {item.name}</span>
                <span className="font-medium text-cream">€{item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="divider-gold my-1" />
            <div className="flex justify-between font-bold text-cream">
              <span>Totaal</span><span>€28.50</span>
            </div>
          </div>
        </div>

        {/* Chat */}
        <button className="w-full flex items-center justify-center gap-2 py-3.5 border border-gold/15 bg-night-3 rounded-xl text-sm font-semibold text-sand/60 hover:border-ember/30 hover:text-ember transition-colors">
          <MessageCircle className="w-4 h-4" />
          {language === 'nl' ? 'Chat met restaurant' : language === 'en' ? 'Chat with restaurant' : language === 'tr' ? 'Restoran ile sohbet' : 'الدردشة مع المطعم'}
        </button>
      </div>

      {/* Review popup */}
      <AnimatePresence>
        {showReviewPopup && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="w-full max-w-2xl bg-night-2 border border-gold/20 rounded-t-3xl p-6 pb-10"
            >
              <div className="w-12 h-1 bg-gold/20 rounded-full mx-auto mb-5" />
              <div className="text-center">

                <h2 className="font-display font-bold text-2xl text-cream mb-2">
                  {language === 'nl' ? 'Bestelling bezorgd!' : language === 'en' ? 'Order delivered!' : language === 'tr' ? 'Sipariş teslim edildi!' : 'تم توصيل طلبك!'}
                </h2>
                <p className="text-sand/50 text-sm mb-5">
                  {language === 'nl' ? 'Hoe was je eten?' : language === 'en' ? 'How was your food?' : language === 'tr' ? 'Yemeğiniz nasıldı?' : 'كيف كان طعامك؟'}
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
                <button className="w-full btn-ember py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold mb-3">
                  <Star className="w-4 h-4" />
                  {language === 'nl' ? 'Laat een review achter op Google' : 'Leave a Google review'}
                </button>
                <button onClick={() => setShowReviewPopup(false)} className="text-sand/40 text-sm hover:text-sand/60 transition-colors">
                  {language === 'nl' ? 'Later' : language === 'en' ? 'Later' : language === 'tr' ? 'Daha sonra' : 'لاحقاً'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
