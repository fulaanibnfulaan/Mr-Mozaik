'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, Gift, X, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart'
import { useAppStore } from '@/store/app'
import { hapticFeedback, formatEuros } from '@/lib/utils'
import { seedMenuItems } from '@/lib/seed-data'

const DELIVERY_THRESHOLD = 25
const DELIVERY_FEE = 2

export default function WinkelwagenPage() {
  const router = useRouter()
  const { language } = useAppStore()
  const { items, tip, couponCode, couponDiscount, updateQuantity, removeItem, setTip, setCoupon, removeCoupon, getSubtotal } = useCartStore()
  const [couponInput, setCouponInput] = useState('')
  const [showCoupon, setShowCoupon] = useState(false)

  const subtotal = getSubtotal()
  const deliveryFee = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const discount = couponDiscount > 0 ? subtotal * (couponDiscount / 100) : 0
  const total = subtotal + deliveryFee + tip - discount
  const toFree = DELIVERY_THRESHOLD - subtotal

  const applyCoupon = () => {
    if (couponInput.toUpperCase() === 'MOZAIK10') {
      setCoupon('MOZAIK10', 10)
      toast.success('10% korting toegepast!')
    } else {
      toast.error('Ongeldige code')
    }
  }

  const drinkSuggestion = seedMenuItems.find(i => i.category_id === 'cat-5')

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 bg-[#F5F0E8] border border-black/8 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <ShoppingBag className="w-9 h-9 text-gray-300" />
          </div>
          <h2 className="font-display font-bold text-gray-900 text-2xl mb-2">
            {language === 'nl' ? 'Winkelwagen leeg' : language === 'en' ? 'Cart empty' : language === 'tr' ? 'Sepet boş' : 'السلة فارغة'}
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            {language === 'nl' ? 'Voeg iets lekkers toe aan je bestelling' : 'Add something delicious to your order'}
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-[0_4px_16px_rgba(209,0,0,0.35)]">
            {language === 'nl' ? 'Bekijk menu' : language === 'en' ? 'View menu' : language === 'tr' ? 'Menüye bak' : 'عرض القائمة'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pb-36" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="px-4 md:px-8 pt-6 pb-4 max-w-2xl mx-auto md:max-w-3xl">
        <h1 className="font-display font-bold text-gray-900 text-2xl">
          {language === 'nl' ? 'Jouw bestelling' : language === 'en' ? 'Your order' : language === 'tr' ? 'Siparişiniz' : 'طلبك'}
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">{items.length} {language === 'nl' ? 'items' : 'items'}</p>
      </div>

      <div className="px-4 md:px-8 space-y-3 max-w-2xl mx-auto md:max-w-3xl">
        {/* Free delivery bar */}
        {toFree > 0 && (
          <div className="bg-[#F5F0E8] rounded-2xl border border-black/8 shadow-sm p-3">
            <p className="text-gray-500 text-xs mb-2">
              {language === 'nl' ? `Nog` : 'Only'} <span className="text-red-600 font-bold">{formatEuros(toFree)}</span>{' '}
              {language === 'nl' ? 'voor gratis bezorging' : 'for free delivery'}
            </p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full bg-red-600 rounded-full" animate={{ width: `${Math.min((subtotal / DELIVERY_THRESHOLD) * 100, 100)}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
        )}

        {/* Items */}
        <AnimatePresence>
          {items.map(ci => (
            <motion.div key={ci.id} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }}
              className="bg-[#F5F0E8] rounded-2xl border border-black/8 shadow-sm p-3 flex gap-3">
              <div className="relative w-16 h-14 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={ci.menu_item.image_url} alt="" fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <h3 className="text-gray-900 font-semibold text-sm leading-tight truncate">
                    {ci.menu_item[`name_${language}` as keyof typeof ci.menu_item] as string}
                  </h3>
                  <button onClick={() => { hapticFeedback(20); removeItem(ci.id) }} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {ci.selected_addons.length > 0 && (
                  <p className="text-gray-400 text-[10px] mt-0.5 truncate">
                    + {ci.selected_addons.map(a => a[`name_${language}` as keyof typeof a]).join(', ')}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-gray-900 text-sm">
                    {formatEuros((ci.menu_item.price + ci.selected_addons.reduce((s, a) => s + a.price, 0)) * ci.quantity)}
                  </span>
                  <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-0.5">
                    <button onClick={() => { hapticFeedback(15); updateQuantity(ci.id, ci.quantity - 1) }} className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white transition-colors">
                      <Minus className="w-3 h-3 text-gray-500" />
                    </button>
                    <span className="w-4 text-center text-xs font-bold text-gray-900">{ci.quantity}</span>
                    <button onClick={() => { hapticFeedback(15); updateQuantity(ci.id, ci.quantity + 1) }} className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white transition-colors">
                      <Plus className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Drink upsell */}
        {drinkSuggestion && (
          <div className="bg-[#F5F0E8] rounded-2xl border border-black/8 shadow-sm p-3 flex items-center gap-3">
            <p className="text-gray-500 text-xs flex-1">
              {language === 'nl' ? `Voeg een drankje toe voor` : 'Add a drink for'} <span className="text-red-600 font-bold">{formatEuros(drinkSuggestion.price)}</span>?
            </p>
            <button
              onClick={() => { hapticFeedback(); useCartStore.getState().addItem(drinkSuggestion as any, []); toast.success('Drankje toegevoegd!') }}
              className="text-red-600 text-xs font-bold px-2.5 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              + Toevoegen
            </button>
          </div>
        )}

        {/* Tip */}
        <div className="bg-[#F5F0E8] rounded-2xl border border-black/8 shadow-sm p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
            {language === 'nl' ? 'Fooi toevoegen' : language === 'en' ? 'Add tip' : language === 'tr' ? 'Bahşiş' : 'إكرامية'}
          </p>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map(amt => (
              <button key={amt} onClick={() => { hapticFeedback(15); setTip(amt) }}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                  tip === amt
                    ? 'bg-red-600 text-white shadow-[0_4px_12px_rgba(209,0,0,0.35)]'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
                €{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Coupon */}
        <div className="bg-[#F5F0E8] rounded-2xl border border-black/8 shadow-sm p-4">
          <button onClick={() => setShowCoupon(v => !v)} className="flex items-center gap-2 w-full text-sm font-medium text-gray-500">
            <Gift className="w-4 h-4 text-red-600" />
            <span>{language === 'nl' ? 'Couponcode' : language === 'en' ? 'Coupon code' : language === 'tr' ? 'Kupon kodu' : 'رمز الكوبون'}</span>
            {couponCode && <span className="ml-auto text-green-600 text-xs font-bold">{couponCode} ✓</span>}
          </button>
          <AnimatePresence>
            {showCoupon && !couponCode && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex gap-2 mt-3">
                  <input value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} placeholder="MOZAIK10"
                    className="flex-1 bg-gray-100 border border-transparent focus:border-red-300 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors" />
                  <button onClick={applyCoupon} className="bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm">
                    {language === 'nl' ? 'Toepassen' : 'Apply'}
                  </button>
                </div>
              </motion.div>
            )}
            {couponCode && (
              <div className="flex items-center justify-between mt-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <span className="text-green-700 text-sm font-bold">{couponCode} — -{couponDiscount}%</span>
                <button onClick={removeCoupon}><X className="w-4 h-4 text-gray-400" /></button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="bg-[#F5F0E8] rounded-2xl border border-black/8 shadow-sm p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">{language === 'nl' ? 'Subtotaal' : 'Subtotal'}</span>
            <span className="text-gray-600">{formatEuros(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{language === 'nl' ? 'Bezorgkosten' : 'Delivery'}</span>
            <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : 'text-gray-600'}>
              {deliveryFee === 0 ? (language === 'nl' ? 'Gratis' : 'Free') : formatEuros(deliveryFee)}
            </span>
          </div>
          {tip > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">{language === 'nl' ? 'Fooi' : 'Tip'}</span>
              <span className="text-gray-600">{formatEuros(tip)}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-green-600">{couponCode}</span>
              <span className="text-green-600 font-medium">-{formatEuros(discount)}</span>
            </div>
          )}
          <div className="h-px bg-black/8 my-1" />
          <div className="flex justify-between font-bold text-base">
            <span className="text-gray-900">{language === 'nl' ? 'Totaal' : 'Total'}</span>
            <span className="text-gray-900">{formatEuros(total)}</span>
          </div>
        </div>
      </div>

      {/* Sticky checkout */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 px-4 py-3 bg-[#EAE5D6]/95 backdrop-blur-xl border-t border-black/8">
        <div className="max-w-2xl mx-auto md:max-w-3xl">
          <motion.button onClick={() => router.push('/checkout')} whileTap={{ scale: 0.97 }}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl flex items-center justify-between px-5 text-base shadow-[0_4px_20px_rgba(209,0,0,0.4)]">
            <span className="text-sm bg-white/15 rounded-lg px-2 py-0.5">{items.length} items</span>
            <span>{language === 'nl' ? 'Doorgaan naar afrekenen' : 'Proceed to checkout'}</span>
            <span>{formatEuros(total)}</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
