'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, Users, ShoppingBag, Star } from 'lucide-react'
import Link from 'next/link'
import { formatEuros } from '@/lib/utils'

const HOURLY_DATA = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,8,12,18,22,19,14,7]
const DAYS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
const TOP_ITEMS = [
  { name: 'Kip Shoarma Wrap', count: 342, revenue: 3249 },
  { name: 'Mozaik Frietjes', count: 521, revenue: 2344.50 },
  { name: 'Mozaik Signature Pizza', count: 415, revenue: 6017.50 },
  { name: 'Cola/Fanta/Sprite', count: 445, revenue: 890 },
  { name: 'Dubbele Shoarma Box', count: 287, revenue: 5731.65 },
]

const HEATMAP = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    if (hour < 14) return 0
    const base = Math.random() * 10
    if (hour >= 17 && hour <= 20) return Math.floor(base * 2.5)
    return Math.floor(base)
  })
)

const maxHeat = Math.max(...HEATMAP.flat())

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-night pattern-bg">
      <header className="bg-night-2/95 backdrop-blur-xl border-b border-gold/10 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Link href="/admin" className="w-9 h-9 bg-night-3 border border-gold/15 rounded-xl flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-sand/70" />
          </Link>
          <h1 className="font-display font-bold text-xl text-cream">Analytics</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: TrendingUp, label: 'Omzet vandaag', value: '€ 287,40', sub: '+12% vs gisteren', color: 'text-green-400' },
            { icon: ShoppingBag, label: 'Orders vandaag', value: '23', sub: '18 bezorgd · 5 afhalen', color: 'text-blue-400' },
            { icon: Users, label: 'Klanten (30d)', value: '156', sub: '68% terugkerend', color: 'text-gold' },
            { icon: Star, label: 'Gem. waardering', value: '4.8 ⭐', sub: '230+ reviews', color: 'text-gold-light' },
          ].map(stat => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-night p-4"
            >
              <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
              <div className="font-bold text-xl text-cream">{stat.value}</div>
              <div className="text-xs text-sand/50 mt-0.5">{stat.label}</div>
              <div className="text-[10px] text-sand/35 mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Hourly chart */}
        <div className="card-night p-5">
          <h2 className="font-semibold text-cream text-sm mb-4">Bestellingen per uur (vandaag)</h2>
          <div className="flex items-end gap-1 h-24">
            {HOURLY_DATA.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full bg-ember rounded-t-sm"
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / 25) * 100}%` }}
                  transition={{ delay: i * 0.02 }}
                  style={{ minHeight: val > 0 ? 2 : 0, opacity: val > 0 ? 1 : 0.1, background: val > 0 ? undefined : 'rgba(212,148,58,0.15)' }}
                />
                {i % 4 === 0 && <span className="text-[9px] text-sand/30">{i}u</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="card-night p-5">
          <h2 className="font-semibold text-cream text-sm mb-4">Bestellingen heatmap (7×24)</h2>
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              <div className="flex flex-col gap-1 pt-5">
                {DAYS.map(d => (
                  <div key={d} className="h-5 w-6 text-[10px] text-sand/40 flex items-center">{d}</div>
                ))}
              </div>
              <div className="flex-1">
                <div className="flex gap-0.5 mb-1">
                  {Array.from({ length: 24 }, (_, h) => (
                    <div key={h} className="w-5 text-[9px] text-sand/30 text-center">
                      {h % 4 === 0 ? h : ''}
                    </div>
                  ))}
                </div>
                {HEATMAP.map((dayData, dayIdx) => (
                  <div key={dayIdx} className="flex gap-0.5 mb-0.5">
                    {dayData.map((val, hourIdx) => (
                      <div
                        key={hourIdx}
                        className="w-5 h-5 rounded-sm"
                        style={{
                          backgroundColor: val === 0
                            ? 'rgba(212,148,58,0.05)'
                            : `rgba(200, 16, 46, ${(val / maxHeat) * 0.9 + 0.1})`,
                        }}
                        title={`${DAYS[dayIdx]} ${hourIdx}u: ${val} orders`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top items */}
        <div className="card-night p-5">
          <h2 className="font-semibold text-cream text-sm mb-4">Top 5 items</h2>
          <div className="space-y-4">
            {TOP_ITEMS.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="w-6 h-6 bg-ember/20 rounded-full flex items-center justify-center text-xs font-bold text-ember flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-sm font-medium text-cream truncate">{item.name}</span>
                    <span className="text-xs text-sand/50 ml-2 flex-shrink-0">{item.count}×</span>
                  </div>
                  <div className="h-1.5 bg-night-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-ember rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / TOP_ITEMS[0].count) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-cream flex-shrink-0">
                  {formatEuros(item.revenue)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
