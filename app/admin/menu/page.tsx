'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit2, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { seedMenuItems, seedCategories } from '@/lib/seed-data'
import { formatEuros } from '@/lib/utils'

export default function AdminMenuPage() {
  const [items, setItems] = useState(seedMenuItems)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const toggleSoldOut = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, sold_out: !i.sold_out } : i))
  }

  const filtered = items.filter(i => {
    const matchCat = activeCategory === 'all' || i.category_id === activeCategory
    const matchSearch = !searchQuery || i.name_nl.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-night pattern-bg">
      <header className="bg-night-2/95 backdrop-blur-xl border-b border-gold/10 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="w-9 h-9 bg-night-3 border border-gold/15 rounded-xl flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-sand/70" />
            </Link>
            <h1 className="font-display font-bold text-xl text-cream">Menu beheer</h1>
          </div>
          <button className="flex items-center gap-1.5 btn-ember px-3 py-2 rounded-xl text-sm font-bold">
            <Plus className="w-4 h-4" />
            Toevoegen
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-5">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand/30" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Zoek menu item..."
            className="w-full pl-9 pr-4 py-2.5 bg-night-3 border border-gold/15 focus:border-ember/40 rounded-xl text-sm text-cream placeholder:text-sand/25 outline-none transition-colors"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 border transition-all ${
              activeCategory === 'all' ? 'bg-ember border-ember text-white' : 'border-gold/15 bg-night-3 text-sand/60'
            }`}
          >
            Alles ({items.length})
          </button>
          {seedCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 border transition-all ${
                activeCategory === cat.id ? 'bg-ember border-ember text-white' : 'border-gold/15 bg-night-3 text-sand/60'
              }`}
            >
              {cat.icon} {cat.name_nl} ({items.filter(i => i.category_id === cat.id).length})
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="space-y-2">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`card-night p-3 flex items-center gap-3 ${item.sold_out ? 'opacity-60' : ''}`}
            >
              <div className="relative w-14 h-11 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={item.image_url} alt={item.name_nl} fill className="object-cover" />
                {item.sold_out && (
                  <div className="absolute inset-0 bg-night/70 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-ember">UITVERKOCHT</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm text-cream truncate">{item.name_nl}</h3>
                  {item.vegetarian && <span className="text-xs">🌿</span>}
                  {item.seasonal && <span className="text-xs">⏳</span>}
                </div>
                <p className="text-[11px] text-sand/50">{formatEuros(item.price)} · {item.preparation_time} min</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => toggleSoldOut(item.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    item.sold_out
                      ? 'bg-ember/20 border-ember/30 text-ember'
                      : 'bg-green-500/20 border-green-500/30 text-green-400'
                  }`}
                >
                  {item.sold_out ? 'Uit' : 'In'}
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-sand/40 hover:text-gold transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
