'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, TrendingUp, Clock, CheckCircle2, Bike,
  Pause, Play, BarChart3, Users, Settings, Menu as MenuIcon, Printer
} from 'lucide-react'
import Link from 'next/link'
import { formatEuros } from '@/lib/utils'

const DEMO_ORDERS = [
  { id: 'ORD-001', name: 'Ayşe Kılıç', items: 'Kip Shoarma Wrap × 2, Frietjes', total: 23.50, type: 'bezorgen', status: 'ontvangen', time: '2 min', address: 'Kerkstraat 42' },
  { id: 'ORD-002', name: 'Mehmet Yıldız', items: 'Mozaik Pizza, Ayran × 2', total: 19.00, type: 'afhalen', status: 'bereid', time: '8 min', address: '' },
  { id: 'ORD-003', name: 'Fatima Al-Hassan', items: 'Lams Shoarma Schotel, Baklava', total: 19.00, type: 'bezorgen', status: 'onderweg', time: '15 min', address: 'Spoorstraat 7' },
  { id: 'ORD-004', name: 'Jan de Boer', items: 'Dubbele Shoarma Box', total: 19.95, type: 'afhalen', status: 'klaar', time: '18 min', address: '' },
]

type OrderStatus = 'ontvangen' | 'bereid' | 'klaar' | 'onderweg' | 'afgeleverd'

const STATUS_STYLES: Record<OrderStatus, string> = {
  ontvangen: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  bereid: 'bg-ember/20 text-ember border-ember/30',
  klaar: 'bg-green-500/20 text-green-400 border-green-500/30',
  onderweg: 'bg-gold/20 text-gold border-gold/30',
  afgeleverd: 'bg-night-3 text-sand/40 border-gold/10',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  ontvangen: 'Ontvangen', bereid: 'In bereiding', klaar: 'Klaar',
  onderweg: 'Onderweg', afgeleverd: 'Afgeleverd',
}

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  ontvangen: 'bereid', bereid: 'klaar', klaar: 'onderweg', onderweg: 'afgeleverd', afgeleverd: null,
}

const NEXT_LABELS: Record<OrderStatus, string> = {
  ontvangen: 'Accepteren', bereid: 'Klaar melden', klaar: 'Onderweg', onderweg: 'Afgeleverd', afgeleverd: '',
}

const PEAK_OPTIONS = ['Normaal', '+15 min', '+30 min']

export default function AdminPage() {
  const [orders, setOrders] = useState(DEMO_ORDERS)
  const [paused, setPaused] = useState(false)
  const [peakMode, setPeakMode] = useState(0)
  const [newOrderAlert, setNewOrderAlert] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setNewOrderAlert(true), 8000)
    return () => clearTimeout(t)
  }, [])

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
  }

  const todayRevenue = orders.reduce((s, o) => s + o.total, 0) + 128.40
  const activeOrders = orders.filter(o => o.status !== 'afgeleverd').length

  return (
    <div className="min-h-screen bg-night pattern-bg">
      {/* Header */}
      <header className="bg-night-2/95 backdrop-blur-xl border-b border-gold/10 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-ember-gradient rounded-xl flex items-center justify-center shadow-ember">
              <span className="font-display font-bold text-white text-sm">M</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-cream leading-none">Mr. Mozaik</h1>
              <p className="text-sand/40 text-xs">Admin dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {newOrderAlert && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="bg-gold text-night text-xs font-bold px-2.5 py-1 rounded-full animate-pulse"
                >
                  ! Nieuwe order
                </motion.div>
              )}
            </AnimatePresence>
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
              paused ? 'bg-ember/20 border-ember/30 text-ember' : 'bg-green-500/20 border-green-500/30 text-green-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${paused ? 'bg-ember' : 'bg-green-400 animate-pulse'}`} />
              {paused ? 'Gepauzeerd' : 'Actief'}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: TrendingUp, label: 'Vandaag', value: formatEuros(todayRevenue), color: 'text-green-400' },
            { icon: ShoppingBag, label: 'Orders', value: String(orders.length + 3), color: 'text-blue-400' },
            { icon: Clock, label: 'Actief', value: String(activeOrders), color: 'text-ember' },
          ].map(s => (
            <div key={s.label} className="card-night p-3 text-center">
              <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1.5`} />
              <div className="font-bold text-lg text-cream">{s.value}</div>
              <div className="text-[10px] text-sand/50">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="card-night p-4 flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setPaused(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              paused ? 'bg-green-500 text-white' : 'bg-ember/20 border border-ember/30 text-ember hover:bg-ember/30'
            }`}
          >
            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {paused ? 'Hervatten' : 'Pauzeren'}
          </button>

          <div className="flex items-center gap-1 bg-night-2 border border-gold/15 rounded-xl p-1">
            {PEAK_OPTIONS.map((opt, i) => (
              <button
                key={opt}
                onClick={() => setPeakMode(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  peakMode === i ? 'bg-night-3 border border-gold/20 text-cream' : 'text-sand/50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-night-2 border border-gold/15 rounded-xl font-bold text-sm text-sand/60 hover:border-gold/30 transition-colors">
            <Printer className="w-4 h-4" />
            Printer test
          </button>
        </div>

        {/* Live orders */}
        <div>
          <h2 className="font-display font-bold text-lg text-cream mb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-ember" />
            Live bestellingen
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-night p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-cream text-sm">{order.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          order.type === 'bezorgen' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'
                        }`}>
                          {order.type === 'bezorgen' ? '🛵 Bezorgen' : '🏪 Afhalen'}
                        </span>
                      </div>
                      <p className="text-[11px] text-sand/40 mt-0.5">{order.id} · {order.time} geleden{order.address ? ` · ${order.address}` : ''}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-cream text-sm">{formatEuros(order.total)}</span>
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${STATUS_STYLES[order.status as OrderStatus]}`}>
                        {STATUS_LABELS[order.status as OrderStatus]}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-sand/60 mb-3">{order.items}</p>

                  <div className="flex gap-2">
                    {NEXT_STATUS[order.status as OrderStatus] && (
                      <button
                        onClick={() => updateStatus(order.id, NEXT_STATUS[order.status as OrderStatus]!)}
                        className="flex-1 btn-ember py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {NEXT_LABELS[order.status as OrderStatus]}
                      </button>
                    )}
                    <button className="px-3 py-2.5 bg-night-2 border border-gold/15 rounded-xl hover:border-gold/30 transition-colors">
                      <Printer className="w-4 h-4 text-sand/50" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: '/admin/menu', icon: MenuIcon, label: 'Menu beheer', sub: '25 items' },
            { href: '/admin/analytics', icon: BarChart3, label: 'Analytics', sub: 'Vandaag €287' },
            { href: '/admin/team', icon: Users, label: 'Team', sub: '3 actief' },
            { href: '/admin/instellingen', icon: Settings, label: 'Instellingen', sub: 'Openingstijden' },
          ].map(item => (
            <Link key={item.href} href={item.href}>
              <div className="card-night p-4 flex items-center gap-3 hover:border-gold/25 transition-colors">
                <div className="w-10 h-10 bg-ember/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-ember" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-cream">{item.label}</p>
                  <p className="text-[10px] text-sand/40">{item.sub}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
