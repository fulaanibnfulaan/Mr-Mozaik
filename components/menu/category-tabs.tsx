'use client'

import type { Language } from '@/lib/types'
import type { seedCategories } from '@/lib/seed-data'

type Category = (typeof seedCategories)[0]

interface CategoryTabsProps {
  categories: Category[]
  active: string
  onSelect: (id: string) => void
  language: Language
}

const allLabel: Record<Language, string> = { nl: 'Alles', en: 'All', tr: 'Hepsi', ar: 'الكل', de: 'Alle' }

export function CategoryTabs({ categories, active, onSelect, language }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto no-scrollbar">
      <Tab id="all" label={allLabel[language]} icon="✨" active={active === 'all'} onSelect={() => onSelect('all')} />
      {categories.map(cat => (
        <Tab
          key={cat.id}
          id={cat.id}
          label={cat[`name_${language}` as keyof Category] as string}
          icon={cat.icon || '🍽️'}
          active={active === cat.id}
          onSelect={() => onSelect(cat.id)}
        />
      ))}
    </div>
  )
}

function Tab({ id, label, icon, active, onSelect }: {
  id: string; label: string; icon: string; active: boolean; onSelect: () => void
}) {
  return (
    <button
      id={`cat-${id}`}
      onClick={onSelect}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
        active
          ? 'bg-ember text-white shadow-ember'
          : 'bg-night-3 border border-gold/10 text-sand/60 hover:text-sand hover:border-gold/25'
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
    </button>
  )
}
