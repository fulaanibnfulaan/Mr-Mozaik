'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, CreditCard, Smartphone, Gift, CheckCircle2, Loader2, Banknote } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart'
import { useAppStore } from '@/store/app'
import { formatEuros } from '@/lib/utils'
import { seedOpeningHours } from '@/lib/seed-data'
import type { Language } from '@/lib/types'

function generateTimeSlots(openTime: string, closeTime: string): string[] {
  const [oh, om] = openTime.split(':').map(Number)
  const [ch, cm] = closeTime.split(':').map(Number)
  const start = oh * 60 + om + 15
  const end = ch * 60 + cm - 15
  const slots: string[] = []
  for (let m = start; m <= end; m += 15) {
    slots.push(`${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`)
  }
  return slots
}

const translations: Record<Language, Record<string, string>> = {
  nl: {
    title: 'Afrekenen', delivery: 'Bezorgen', pickup: 'Afhalen',
    contactless: 'Contactloos bezorgen', contactless_desc: 'Zet voor de deur',
    when: 'Wanneer?', asap: 'Zo snel mogelijk (~25 min)', schedule: 'Kies tijdstip',
    payment: 'Betaalmethode', ideal: 'iDEAL', card: 'Creditcard', giftcard: 'Cadeaukaart', cash: 'Contant',
    note: 'Opmerkingen voor de keuken (optioneel)',
    place_order: 'Bestelling plaatsen', processing: 'Verwerken...',
    subtotal: 'Subtotaal', delivery_fee: 'Bezorgkosten', tip: 'Fooi', total: 'Totaal',
  },
  en: {
    title: 'Checkout', delivery: 'Delivery', pickup: 'Pickup',
    contactless: 'Contactless delivery', contactless_desc: 'Leave at the door',
    when: 'When?', asap: 'As soon as possible (~25 min)', schedule: 'Choose time',
    payment: 'Payment method', ideal: 'iDEAL', card: 'Credit card', giftcard: 'Gift card', cash: 'Cash',
    note: 'Notes for the kitchen (optional)',
    place_order: 'Place order', processing: 'Processing...',
    subtotal: 'Subtotal', delivery_fee: 'Delivery fee', tip: 'Tip', total: 'Total',
  },
  tr: {
    title: 'Ödeme', delivery: 'Teslimat', pickup: 'Gel al',
    contactless: 'Temassız teslimat', contactless_desc: 'Kapıya bırak',
    when: 'Ne zaman?', asap: 'En kısa sürede (~25 dk)', schedule: 'Zaman seç',
    payment: 'Ödeme yöntemi', ideal: 'iDEAL', card: 'Kredi kartı', giftcard: 'Hediye kartı', cash: 'Nakit',
    note: 'Mutfak için notlar (isteğe bağlı)',
    place_order: 'Sipariş ver', processing: 'İşleniyor...',
    subtotal: 'Ara toplam', delivery_fee: 'Teslimat ücreti', tip: 'Bahşiş', total: 'Toplam',
  },
  ar: {
    title: 'الدفع', delivery: 'توصيل', pickup: 'استلام',
    contactless: 'توصيل بدون تلامس', contactless_desc: 'اترك أمام الباب',
    when: 'متى؟', asap: 'في أقرب وقت (~25 دقيقة)', schedule: 'اختر وقتاً',
    payment: 'طريقة الدفع', ideal: 'iDEAL', card: 'بطاقة ائتمان', giftcard: 'بطاقة هدية', cash: 'نقدًا',
    note: 'ملاحظات للمطبخ (اختياري)',
    place_order: 'تأكيد الطلب', processing: 'جارٍ المعالجة...',
    subtotal: 'المجموع الفرعي', delivery_fee: 'رسوم التوصيل', tip: 'إكرامية', total: 'المجموع',
  },
  de: {
    title: 'Kasse', delivery: 'Lieferung', pickup: 'Abholung',
    contactless: 'Kontaktlose Lieferung', contactless_desc: 'Vor die Tür stellen',
    when: 'Wann?', asap: 'So schnell wie möglich (~25 Min.)', schedule: 'Zeit wählen',
    payment: 'Zahlungsmethode', ideal: 'iDEAL', card: 'Kreditkarte', giftcard: 'Geschenkkarte', cash: 'Bargeld',
    note: 'Anmerkungen für die Küche (optional)',
    place_order: 'Bestellung aufgeben', processing: 'Wird verarbeitet...',
    subtotal: 'Zwischensumme', delivery_fee: 'Liefergebühr', tip: 'Trinkgeld', total: 'Gesamt',
  },
}


export default function CheckoutPage() {
  const router = useRouter()
  const { language, orderType } = useAppStore()
  const tr = translations[language]
  const { items, tip, getSubtotal, clearCart, couponDiscount } = useCartStore()

  const todayHours = seedOpeningHours[new Date().getDay()]
  const allSlots = todayHours && !todayHours.closed
    ? generateTimeSlots(todayHours.open_time, todayHours.close_time)
    : []
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes()
  const availableSlots = allSlots.filter(s => {
    const [h, m] = s.split(':').map(Number)
    return h * 60 + m > nowMin
  })

  const [contactless, setContactless] = useState(false)
  const [timeOption, setTimeOption] = useState<'asap' | 'schedule'>(orderType === 'afhalen' ? 'schedule' : 'asap')
  const [selectedTime, setSelectedTime] = useState<string>(availableSlots[0] ?? '')
  const [paymentMethod, setPaymentMethod] = useState<'ideal' | 'card' | 'giftcard' | 'cash'>('ideal')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [adresQuery, setAdresQuery] = useState('')
  const [straat, setStraat] = useState('')
  const [huisnummer, setHuisnummer] = useState('')
  const [postcode, setPostcode] = useState('')
  const [stad, setStad] = useState('')
  const [suggestions, setSuggestions] = useState<{ id: string; label: string }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestBoxRef.current && !suggestBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleAdresInput = (value: string) => {
    setAdresQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.length < 2) { setSuggestions([]); setShowSuggestions(false); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?q=${encodeURIComponent(value)}&fq=type:adres&rows=6`
        )
        const data = await res.json()
        const docs: { id: string; weergavenaam: string }[] = data.response?.docs ?? []
        setSuggestions(docs.map(d => ({ id: d.id, label: d.weergavenaam })))
        setShowSuggestions(docs.length > 0)
      } catch {}
    }, 300)
  }

  const selectSuggestion = async (id: string, label: string) => {
    setAdresQuery(label)
    setShowSuggestions(false)
    try {
      const res = await fetch(
        `https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup?id=${encodeURIComponent(id)}`
      )
      const data = await res.json()
      const doc = data.response?.docs?.[0]
      if (doc) {
        setStraat(doc.straatnaam ?? '')
        setHuisnummer(String(doc.huisnummer ?? ''))
        setPostcode(doc.postcode ?? '')
        setStad(doc.woonplaatsnaam ?? '')
      }
    } catch {}
  }

  const subtotal = getSubtotal()
  const deliveryFee = orderType === 'afhalen' ? 0 : (subtotal >= 25 ? 0 : 2)
  const discount = couponDiscount > 0 ? subtotal * (couponDiscount / 100) : 0
  const total = subtotal + deliveryFee + tip - discount

  const handlePlaceOrder = async () => {
    if (orderType === 'bezorgen' && (!straat || !huisnummer || !postcode)) {
      toast.error(language === 'nl' ? 'Vul je bezorgadres in' : language === 'de' ? 'Bitte Lieferadresse eingeben' : 'Please enter your delivery address')
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
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#EAE5D6]/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-black/8 dark:border-white/5 px-4 py-4 flex items-center justify-center relative">
        <button onClick={() => router.back()} className="absolute left-4 w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8 shadow-sm">
          <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        <h1 className="font-display font-bold text-xl text-gray-900 dark:text-gray-100">{tr.title}</h1>
      </div>

      <div className="px-4 md:px-8 pt-[68px] pb-36 space-y-3 max-w-2xl mx-auto md:max-w-3xl">
        {/* Delivery method */}
        <Section title={language === 'nl' ? 'Bezorgmethode' : language === 'en' ? 'Delivery method' : language === 'tr' ? 'Teslimat yöntemi' : language === 'de' ? 'Liefermethode' : 'طريقة التوصيل'}>
          <div className="flex items-center gap-2 bg-red-600 text-white py-3 px-4 rounded-xl font-semibold text-sm">
            {orderType === 'bezorgen' ? tr.delivery : tr.pickup}
          </div>
          <AnimatePresence>
            {orderType === 'bezorgen' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3 space-y-3">
                <div className="space-y-2">
                  {/* Address autocomplete */}
                  <div className="relative" ref={suggestBoxRef}>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        value={adresQuery}
                        onChange={e => handleAdresInput(e.target.value)}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        placeholder={language === 'nl' ? 'Zoek je adres...' : language === 'de' ? 'Adresse suchen...' : language === 'tr' ? 'Adres ara...' : language === 'ar' ? 'ابحث عن عنوانك...' : 'Search your address...'}
                        className="w-full bg-gray-200 dark:bg-gray-700 border border-transparent focus:border-red-300 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-colors"
                      />
                    </div>
                    <AnimatePresence>
                      {showSuggestions && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.12 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8 rounded-xl shadow-lg overflow-hidden z-20"
                        >
                          {suggestions.map(s => (
                            <button
                              key={s.id}
                              onMouseDown={() => selectSuggestion(s.id, s.label)}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border-b border-black/5 dark:border-white/5 last:border-0 transition-colors"
                            >
                              {s.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Manual fields — filled automatically after selecting, still editable */}
                  {(straat || huisnummer || postcode || stad) && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 overflow-hidden">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            value={straat}
                            onChange={e => setStraat(e.target.value)}
                            placeholder={language === 'nl' ? 'Straatnaam' : language === 'de' ? 'Straßenname' : 'Street name'}
                            className="w-full bg-gray-200 dark:bg-gray-700 border border-transparent focus:border-red-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none transition-colors"
                          />
                        </div>
                        <div className="w-20">
                          <input
                            value={huisnummer}
                            onChange={e => setHuisnummer(e.target.value)}
                            placeholder="Nr."
                            className="w-full bg-gray-200 dark:bg-gray-700 border border-transparent focus:border-red-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-28">
                          <input
                            value={postcode}
                            onChange={e => setPostcode(e.target.value.toUpperCase())}
                            placeholder="Postcode"
                            className="w-full bg-gray-200 dark:bg-gray-700 border border-transparent focus:border-red-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none transition-colors"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            value={stad}
                            onChange={e => setStad(e.target.value)}
                            placeholder={language === 'nl' ? 'Stad' : language === 'de' ? 'Stadt' : 'City'}
                            className="w-full bg-gray-200 dark:bg-gray-700 border border-transparent focus:border-red-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <button onClick={() => setContactless(!contactless)} className="flex items-center justify-between w-full px-1">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 text-left">{tr.contactless}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{tr.contactless_desc}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors ${contactless ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`w-4 h-4 bg-white dark:bg-gray-200 rounded-full shadow-sm mt-0.5 transition-transform ${contactless ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* When */}
        <Section title={tr.when}>
          <div className="space-y-2">
            {(['asap', 'schedule'] as const).filter(o => !(o === 'asap' && orderType === 'afhalen')).map(option => (
              <button key={option} onClick={() => setTimeOption(option)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                  timeOption === option ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-transparent bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${timeOption === option ? 'border-red-600' : 'border-gray-300'}`}>
                  {timeOption === option && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Clock className={`w-4 h-4 ${timeOption === option ? 'text-red-600' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${timeOption === option ? 'text-red-600' : 'text-gray-600 dark:text-gray-300'}`}>
                    {option === 'asap' ? tr.asap : tr.schedule}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <AnimatePresence>
            {timeOption === 'schedule' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-3">
                  {availableSlots.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">
                      {language === 'nl' ? 'Geen tijdslots beschikbaar' : language === 'de' ? 'Keine Zeitfenster verfügbar' : language === 'tr' ? 'Müsait zaman yok' : language === 'ar' ? 'لا توجد أوقات متاحة' : 'No time slots available'}
                    </p>
                  ) : (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
                      {availableSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            selectedTime === slot
                              ? 'bg-red-600 text-white shadow-[0_4px_12px_rgba(209,0,0,0.35)]'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* Payment */}
        <Section title={tr.payment}>
          <div className="space-y-2">
            {(['ideal', 'card', 'cash', 'giftcard'] as const).map(method => (
              <div key={method}>
                <button onClick={() => setPaymentMethod(method)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                    paymentMethod === method ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-transparent bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === method ? 'border-red-600' : 'border-gray-300'}`}>
                    {paymentMethod === method && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {method === 'ideal' && <Smartphone className="w-5 h-5 text-blue-500" />}
                    {method === 'card' && <CreditCard className="w-5 h-5 text-gray-400" />}
                    {method === 'cash' && <Banknote className="w-5 h-5 text-green-600" />}
                    {method === 'giftcard' && <Gift className="w-5 h-5 text-red-600" />}
                    <span className={`text-sm font-medium ${paymentMethod === method ? 'text-red-600' : 'text-gray-600 dark:text-gray-300'}`}>{tr[method]}</span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* Note */}
        <Section title={tr.note}>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder={language === 'nl' ? 'Bijv. extra pittig graag...' : language === 'de' ? 'Z.B. extra scharf bitte...' : 'E.g. extra spicy please...'}
            rows={3}
            className="w-full bg-gray-200 dark:bg-gray-700 border border-transparent focus:border-red-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none resize-none transition-colors" />
        </Section>

        {/* Summary */}
        <div className="bg-[#F5F0E8] dark:bg-gray-800 rounded-2xl border border-black/8 dark:border-white/5 shadow-sm p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">{tr.subtotal}</span>
            <span className="text-gray-600 dark:text-gray-300">{formatEuros(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{tr.delivery_fee}</span>
            <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : 'text-gray-600 dark:text-gray-300'}>
              {deliveryFee === 0 ? (language === 'nl' ? 'Gratis' : language === 'de' ? 'Gratis' : 'Free') : formatEuros(deliveryFee)}
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
              <span className="text-green-600">{language === 'nl' ? 'Korting' : language === 'de' ? 'Rabatt' : 'Discount'}</span>
              <span className="text-green-600 font-medium">-{formatEuros(discount)}</span>
            </div>
          )}
          <div className="h-px bg-black/8 my-1" />
          <div className="flex justify-between font-bold text-base">
            <span className="text-gray-900 dark:text-gray-100">{tr.total}</span>
            <span className="text-gray-900 dark:text-gray-100">{formatEuros(total)}</span>
          </div>
        </div>
      </div>

      {/* Sticky order button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-4 bg-[#EAE5D6]/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-black/8 dark:border-white/5">
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
    <div className="bg-[#F5F0E8] dark:bg-gray-800 rounded-2xl border border-black/8 dark:border-white/5 shadow-sm p-4">
      <h2 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-3">{title}</h2>
      {children}
    </div>
  )
}
