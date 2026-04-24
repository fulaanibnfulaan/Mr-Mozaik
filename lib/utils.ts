import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Language, MenuItem, Addon, Category, Challenge } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

export function formatEuros(euros: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(euros)
}

export function getLocalizedName(
  item: MenuItem | Addon | Category | Challenge | { name_nl: string; name_en: string; name_tr: string; name_ar: string },
  lang: Language,
  field: 'name' | 'title' = 'name'
): string {
  const key = `${field}_${lang}` as keyof typeof item
  return (item[key] as string) || (item[`${field}_nl` as keyof typeof item] as string) || ''
}

export function getLocalizedDescription(
  item: MenuItem,
  lang: Language
): string {
  const key = `description_${lang}` as keyof MenuItem
  return (item[key] as string) || item.description_nl || ''
}

export function isRestaurantOpen(hours: { open_time: string; close_time: string; closed: boolean } | null): boolean {
  if (!hours || hours.closed) return false
  const now = new Date()
  const [openH, openM] = hours.open_time.split(':').map(Number)
  const [closeH, closeM] = hours.close_time.split(':').map(Number)
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes
}

export function getDayOfWeek(): number {
  const day = new Date().getDay()
  return day === 0 ? 6 : day - 1
}

export function hapticFeedback(duration = 50) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(duration)
  }
}

export function generateOrderPoints(total: number): number {
  return Math.floor(total)
}

export const LOYALTY_THRESHOLDS = {
  brons: 0,
  zilver: 200,
  goud: 500,
}

export function getLoyaltyLevel(points: number): 'brons' | 'zilver' | 'goud' {
  if (points >= LOYALTY_THRESHOLDS.goud) return 'goud'
  if (points >= LOYALTY_THRESHOLDS.zilver) return 'zilver'
  return 'brons'
}

export function getNextLoyaltyThreshold(points: number): number {
  if (points < LOYALTY_THRESHOLDS.zilver) return LOYALTY_THRESHOLDS.zilver
  if (points < LOYALTY_THRESHOLDS.goud) return LOYALTY_THRESHOLDS.goud
  return LOYALTY_THRESHOLDS.goud
}
