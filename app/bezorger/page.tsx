'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, CheckCircle2, Navigation, Package } from 'lucide-react'
import { formatEuros } from '@/lib/utils'

const DEMO_DELIVERIES = [
  { id: 'ORD-001', name: 'Ayşe Kılıç', address: 'Kerkstraat 42, Harderwijk', items: 'Kip Shoarma Wrap × 2', total: 23.50, note: '', status: 'pickup' as const },
  { id: 'ORD-003', name: 'Fatima Al-Hassan', address: 'Spoorstraat 7, Harderwijk', items: 'Lams Shoarma Schotel, Baklava', total: 19.00, note: 'Contactloos bezorgen', status: 'pickup' as const },
  { id: 'ORD-005', name: 'Peter Smits', address: 'Lijsterbesstraat 18, Harderwijk', items: 'Dubbele Shoarma Box', total: 19.95, note: '', status: 'pickup' as const },
]

export default function BezorgerPage() {
  const [deliveries, setDeliveries] = useState(DEMO_DELIVERIES)
  const [completedCount, setCompletedCount] = useState(6)

  const markDelivered = (id: string) => {
    setDeliveries(prev => prev.filter(d => d.id !== id))
    setCompletedCount(c => c + 1)
  }

  return (
    <div className="min-h-screen bg-night pattern-bg">
      {/* Header */}
      <header className="bg-night-2/95 backdrop-blur-xl border-b border-gold/10 px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-ember-gradient rounded-xl flex items-center justify-center shadow-ember">
              <span className="font-display font-bold text-white text-sm">M</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-cream leading-none">Bezorger App</h1>
              <p className="text-sand/40 text-xs">Ahmed K. · Shift actief</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-2xl text-cream">{completedCount}</div>
            <div className="text-[10px] text-sand/40">bezorgd vandaag</div>
          </div>
        </div>
      </header>

      <div className="px-4 py-5 space-y-4">
        {/* Route map */}
        <div className="card-night overflow-hidden rounded-2xl">
          <div className="h-44 bg-night-3 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/3 left-0 right-0 h-px bg-gold" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-gold" />
              <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gold" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold" />
              <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gold" />
            </div>
            <div className="text-center relative z-10">
              <Navigation className="w-10 h-10 text-ember mx-auto mb-2" />
              <p className="text-sm font-medium text-sand/60">Routekaart</p>
              <p className="text-xs text-sand/35">{deliveries.length} stops · ~{deliveries.length * 8} min</p>
            </div>
            {deliveries.map((_, i) => (
              <div
                key={i}
                className="absolute w-7 h-7 bg-ember rounded-full flex items-center justify-center text-white text-xs font-bold shadow-ember"
                style={{ top: `${22 + i * 24}%`, left: `${18 + i * 26}%` }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <h2 className="font-display font-bold text-lg text-cream flex items-center gap-2">
          <Package className="w-5 h-5 text-ember" />
          Te bezorgen ({deliveries.length})
        </h2>

        <AnimatePresence>
          {deliveries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-cream mb-2">Alles bezorgd! 🎉</h3>
              <p className="text-sand/50 text-sm">Wacht op nieuwe orders.</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {deliveries.map((delivery, i) => (
                <motion.div
                  key={delivery.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 200 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-night p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-ember rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-ember">
                        {i + 1}
                      </div>
                      <div>
                        <span className="font-bold text-cream text-sm">{delivery.name}</span>
                        <p className="text-[10px] text-sand/40">{delivery.id}</p>
                      </div>
                    </div>
                    <span className="font-bold text-cream text-sm">{formatEuros(delivery.total)}</span>
                  </div>

                  <div className="flex items-start gap-2 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-ember flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-sand/70">{delivery.address}</p>
                  </div>

                  <p className="text-xs text-sand/50 mb-3 pl-5">{delivery.items}</p>

                  {delivery.note && (
                    <div className="bg-gold/10 border border-gold/20 rounded-xl px-3 py-2 mb-3">
                      <p className="text-xs text-gold font-medium">📋 {delivery.note}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(delivery.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold py-2.5 rounded-xl text-sm hover:bg-blue-500/30 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      Navigeren
                    </a>
                    <button
                      onClick={() => markDelivered(delivery.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 font-bold py-2.5 rounded-xl text-sm hover:bg-green-500/30 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Afgeleverd
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
