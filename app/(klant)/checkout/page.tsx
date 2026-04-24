'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, CreditCard, Smartphone, Gift, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart'
import { useAppStore } from '@/store/app'
import { formatEuros } from '@/lib/utils'
import type { Language } from '@/lib/types'

const translations: Record<Language, Record<string, string>> = {
  nl: {
    title: 'Afrekenen', delivery: 'Bezorgen', pickup: 'Afhalen',
    contactless: 'Contactloos bezorgen', contactless_desc: 'Zet voor de deur',
    when: 'Wanneer?', asap: 'Zo snel mogelijk (~25 min)', schedule: 'Kies tijdstip',
    payment: 'Betaalmethode', ideal: 'iDEAL', card: 'Creditcard', giftcard: 'Cadeaukaart',
    note: 'Opmerkingen voor de keuken (optioneel)',
    place_order: 'Bestelling plaatsen', processing: 'Verwerken...',
    subtotal: 'Subtotaal', delivery_fee: 'Bezorgkosten', tip: 'Fooi', total: 'Totaal',
  },
  en: {
    title: 'Checkout', delivery: 'Delivery', pickup: 'Pickup',
    contactless: 'Contactless delivery', contactless_desc: 'Leave at the door',
    when: 'When?', asap: 'As soon as possible (~25 min)', schedule: 'Choose time',
    payment: 'Payment method', ideal: 'iDEAL', card: 'Credit card', giftcard: 'Gift card',
    note: 'Notes for the kitchen (optional)',
    place_order: 'Place order', processing: 'Processing...',
    subtotal: 'Subtotal', delivery_fee: 'Delivery fee', tip: 'Tip', total: 'Total',
  },
  tr: {
    title: 'Ödeme', delivery: 'Teslimat', pickup: 'Gel al',
    contactless: 'Temassız teslimat', contactless_desc: 'Kapıya bırak',
    when: 'Ne zaman?', asap: 'En kısa sürede (~25 dk)', schedule: 'Zaman seç',
    payment: 'Ödeme yöntemi', ideal: 'iDEAL', card: 'Kredi kartı', giftcard: 'Hediye kartı',
    note: 'Mutfak için notlar (isteğe bağlı)',
    place_order: 'Sipariş ver', processing: 'İşleniyor...',
    subtotal: 'Ara toplam', delivery_fee: 'Teslimat ücreti', tip: 'Bahşiş', total: 'Toplam',
  },
  ar: {
    title: 'الدفع', delivery: 'توصيل', pickup: 'استلام',
    contactless: 'توصيل بدون تلامس', contactless_desc: 'اترك أمام الباب',
    when: 'متى؟', asap: 'في أقرب وقت (~25 دقيقة)', schedule: 'اختر وقتاً',
    payment: 'طريقة الدفع', ideal: 'iDEAL', card: 'بطاقة ائتمان', giftcard: 'بطاقة هدية',
    note: 'ملاحظات للمطبخ (اختياري)',
    place_order: 'تأكيد الطلب', processing: 'جارٍ المعالجة...',
    subtotal: 'المجموع الفرعي', delivery_fee: 'رسوم التوصيل', tip: 'إكرامية', total: 'المجموع',
  },
}

const BANKS = ['ABN AMRO', 'ING', 'Rabobank', 'SNS Bank', 'ASN Bank', 'Bunq', 'Knab', 'Triodos Bank', 'Revolut', 'N26']

export default function CheckoutPage() {
  const router = useRouter()
  const { language } = useAppStore()
  const tr = translations[language]
  const { items, tip, getSubtotal, clearCart, couponDiscount } = useCartStore()

  const [orderType, setOrderType] = useState<'bezorgen' | 'afhalen'>('bezorgen')
  const [contactless, setContactless] = useState(false)
  const [timeOption, setTimeOption] = useState<'asap' | 'schedule'>('asap')
  const [paymentMethod, setPaymentMethod] = useState<'ideal' | 'card' | 'giftcard'>('ideal')
  const [selectedBank, setSelectedBank] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [showBankDropdown, setShowBankDropdown] = useState(false)

  const subtotal = getSubtotal()
  const deliveryFee = orderType === 'afhalen' ? 0 : (subtotal >= 25 ? 0 : 2)
  const discount = couponDiscount > 0 ? subtotal * (couponDiscount / 100) : 0
  const total = subtotal + deliveryFee + tip - discount

  const handlePlaceOrder = async () => {
    if (orderType === 'bezorgen' && !selectedBank && paymentMethod === 'ideal') {
      toast.error(language === 'nl' ? 'Kies je bank' : 'Select your bank')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    clearCart()
    router.push('/order/ord-demo-123')
  }

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 md:top-[65px] bg-[#F4F4EF]/95 backdrop-blur-xl border-b border-black/8 px-4 py-4 z-10 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-black/8 shadow-sm">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="font-display font-bold text-xl text-gray-900">{tr.title}</h1>
      </div>

      <div className="px-4 md:px-8 pt-4 pb-36 space-y-3 max-w-2xl mx-auto md:max-w-3xl">
        {/* Delivery method */}
        <Section title={language === 'nl' ? 'Bezorgmethode' : language === 'en' ? 'Delivery method' : language === 'tr' ? 'Teslimat yöntemi' : 'طريقة التوصيل'}>
          <div className="flex gap-2">
            {(['bezorgen', 'afhalen'] as const).map(type => (
              <button key={type} onClick={() => setOrderType(type)}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                  orderType === type
                    ? 'bg-red-600 text-white shadow-[0_4px_12px_rgba(209,0,0,0.35)]'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
                {type === 'bezorgen' ? tr.delivery : tr.pickup}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {orderType === 'bezorgen' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3 space-y-3">
                <button className="w-full flex items-center gap-3 p-3.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">Kerkstraat 12</p>
                    <p className="text-xs text-gray-400">3841 AB Harderwijk</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                </button>
                <button onClick={() => setContactless(!contactless)} className="flex items-center justify-between w-full px-1">
                  <div>
                    <p className="text-sm font-medium text-gray-900 text-left">{tr.contactless}</p>
                    <p className="text-xs text-gray-400">{tr.contactless_desc}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors ${contactless ? 'bg-red-600' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm mt-0.5 transition-transform ${contactless ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* When */}
        <Section title={tr.when}>
          <div className="space-y-2">
            {(['asap', 'schedule'] as const).map(option => (
              <button key={option} onClick={() => setTimeOption(option)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                  timeOption === option ? 'border-red-300 bg-red-50' : 'border-transparent bg-gray-100 hover:bg-gray-200'
                }`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${timeOption === option ? 'border-red-600' : 'border-gray-300'}`}>
                  {timeOption === option && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Clock className={`w-4 h-4 ${timeOption === option ? 'text-red-600' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${timeOption === option ? 'text-red-600' : 'text-gray-600'}`}>
                    {option === 'asap' ? tr.asap : tr.schedule}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* Payment */}
        <Section title={tr.payment}>
          <div className="space-y-2">
            {(['ideal', 'card', 'giftcard'] as const).map(method => (
              <div key={method}>
                <button onClick={() => setPaymentMethod(method)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                    paymentMethod === method ? 'border-red-300 bg-red-50' : 'border-transparent bg-gray-100 hover:bg-gray-200'
                  }`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === method ? 'border-red-600' : 'border-gray-300'}`}>
                    {paymentMethod === method && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {method === 'ideal' && <Smartphone className="w-5 h-5 text-blue-500" />}
                    {method === 'card' && <CreditCard className="w-5 h-5 text-gray-400" />}
                    {method === 'giftcard' && <Gift className="w-5 h-5 text-red-600" />}
                    <span className={`text-sm font-medium ${paymentMethod === method ? 'text-red-600' : 'text-gray-600'}`}>{tr[method]}</span>
                  </div>
                </button>
                <AnimatePresence>
                  {paymentMethod === 'ideal' && method === 'ideal' && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="mt-2 relative">
                        <button onClick={() => setShowBankDropdown(v => !v)}
                          className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-xl text-sm hover:bg-gray-200 transition-colors">
                          <span className={selectedBank ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                            {selectedBank || (language === 'nl' ? 'Kies je bank' : 'Select your bank')}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                        <AnimatePresence>
                          {showBankDropdown && (
                            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/8 rounded-xl shadow-lg overflow-hidden z-10">
                              {BANKS.map(bank => (
                                <button key={bank} onClick={() => { setSelectedBank(bank); setShowBankDropdown(false) }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                  {bank}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Section>

        {/* Note */}
        <Section title={tr.note}>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder={language === 'nl' ? 'Bijv. extra pittig graag...' : 'E.g. extra spicy please...'}
            rows={3}
            className="w-full bg-gray-100 border border-transparent focus:border-red-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-none transition-colors" />
        </Section>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-black/8 shadow-sm p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">{tr.subtotal}</span>
            <span className="text-gray-600">{formatEuros(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{tr.delivery_fee}</span>
            <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : 'text-gray-600'}>
              {deliveryFee === 0 ? (language === 'nl' ? 'Gratis' : 'Free') : formatEuros(deliveryFee)}
            </span>
          </div>
          {tip > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">{tr.tip}</span>
              <span className="text-gray-600">{formatEuros(tip)}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-green-600">Korting</span>
              <span className="text-green-600 font-medium">-{formatEuros(discount)}</span>
            </div>
          )}
          <div className="h-px bg-black/8 my-1" />
          <div className="flex justify-between font-bold text-base">
            <span className="text-gray-900">{tr.total}</span>
            <span className="text-gray-900">{formatEuros(total)}</span>
          </div>
        </div>
      </div>

      {/* Sticky order button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-[#F4F4EF]/95 backdrop-blur-xl border-t border-black/8">
        <div className="max-w-2xl mx-auto md:max-w-3xl">
          <motion.button onClick={handlePlaceOrder} whileTap={{ scale: 0.97 }} disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 disabled:opacity-60 shadow-[0_4px_20px_rgba(209,0,0,0.4)]">
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /><span>{tr.processing}</span></>
            ) : (
              <><CheckCircle2 className="w-5 h-5" /><span>{tr.place_order} — {formatEuros(total)}</span></>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-black/8 shadow-sm p-4">
      <h2 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-3">{title}</h2>
      {children}
    </div>
  )
}
