'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, Loader2, RefreshCw, KeyRound } from 'lucide-react'
import { useAppStore } from '@/store/app'

const translations = {
  nl: {
    title: 'Wachtwoord vergeten',
    desc: 'Vul je e-mailadres in en we sturen je een link om je wachtwoord te resetten.',
    email: 'E-mailadres',
    submit: 'Verstuur resetlink',
    loading: 'Bezig...',
    back: 'Terug',
    check_email: 'Controleer je e-mail',
    check_desc: 'We hebben een resetlink gestuurd naar',
    check_sub: 'Klik op de link in de e-mail om een nieuw wachtwoord in te stellen.',
    resend: 'Opnieuw versturen',
    resend_wait: 'Opnieuw versturen (%s s)',
    back_login: 'Terug naar inloggen',
  },
  en: {
    title: 'Forgot password',
    desc: 'Enter your email address and we\'ll send you a link to reset your password.',
    email: 'Email address',
    submit: 'Send reset link',
    loading: 'Loading...',
    back: 'Back',
    check_email: 'Check your email',
    check_desc: 'We sent a reset link to',
    check_sub: 'Click the link in the email to set a new password.',
    resend: 'Resend email',
    resend_wait: 'Resend (%s s)',
    back_login: 'Back to login',
  },
  tr: {
    title: 'Şifremi unuttum',
    desc: 'E-posta adresini gir, sana şifre sıfırlama bağlantısı gönderelim.',
    email: 'E-posta adresi',
    submit: 'Sıfırlama bağlantısı gönder',
    loading: 'Yükleniyor...',
    back: 'Geri',
    check_email: 'E-postanı kontrol et',
    check_desc: 'Sıfırlama bağlantısı şu adrese gönderildi:',
    check_sub: 'Yeni şifre belirlemek için e-postadaki bağlantıya tıkla.',
    resend: 'Tekrar gönder',
    resend_wait: 'Tekrar gönder (%s s)',
    back_login: 'Girişe dön',
  },
  ar: {
    title: 'نسيت كلمة المرور',
    desc: 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.',
    email: 'البريد الإلكتروني',
    submit: 'إرسال رابط الاستعادة',
    loading: 'جارٍ التحميل...',
    back: 'رجوع',
    check_email: 'تحقق من بريدك الإلكتروني',
    check_desc: 'أرسلنا رابط الاستعادة إلى',
    check_sub: 'انقر على الرابط في البريد الإلكتروني لتعيين كلمة مرور جديدة.',
    resend: 'إعادة الإرسال',
    resend_wait: 'إعادة الإرسال (%s ث)',
    back_login: 'العودة لتسجيل الدخول',
  },
  de: {
    title: 'Passwort vergessen',
    desc: 'Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.',
    email: 'E-Mail-Adresse',
    submit: 'Reset-Link senden',
    loading: 'Laden...',
    back: 'Zurück',
    check_email: 'E-Mail überprüfen',
    check_desc: 'Wir haben einen Reset-Link gesendet an',
    check_sub: 'Klicke auf den Link in der E-Mail, um ein neues Passwort festzulegen.',
    resend: 'Erneut senden',
    resend_wait: 'Erneut senden (%s s)',
    back_login: 'Zurück zur Anmeldung',
  },
}

export default function WachtwoordVergetenPage() {
  const router = useRouter()
  const { language } = useAppStore()
  const tr = translations[language]

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)

  const startCountdown = () => {
    setResendCountdown(60)
    const id = setInterval(() => {
      setResendCountdown(v => {
        if (v <= 1) { clearInterval(id); return 0 }
        return v - 1
      })
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setSent(true)
    startCountdown()
  }

  const handleResend = () => {
    if (resendCountdown > 0) return
    startCountdown()
  }

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center px-4 py-12">
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-gray-400 hover:text-red-600 transition-colors mb-6 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{tr.back}</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center shadow-[0_4px_12px_rgba(209,0,0,0.35)]">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-100">{tr.title}</h1>
            </div>

            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 leading-relaxed">{tr.desc}</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={tr.email}
                required
                autoFocus
                className="w-full bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8 rounded-2xl px-4 py-3.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-red-300 transition-colors"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl shadow-[0_4px_20px_rgba(209,0,0,0.4)] hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>{tr.loading}</span></>
                ) : (
                  <span>{tr.submit}</span>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-red-600 flex items-center justify-center shadow-[0_8px_24px_rgba(209,0,0,0.4)] mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>

            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-100 mb-3">
              {tr.check_email}
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">{tr.check_desc}</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">{email}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">{tr.check_sub}</p>

            <button
              onClick={handleResend}
              disabled={resendCountdown > 0}
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-red-600 disabled:hover:text-gray-400 disabled:cursor-default transition-colors mb-3"
            >
              <RefreshCw className="w-4 h-4" />
              <span>
                {resendCountdown > 0
                  ? tr.resend_wait.replace('%s', String(resendCountdown))
                  : tr.resend}
              </span>
            </button>

            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-400 dark:text-gray-500 hover:text-red-600 transition-colors"
            >
              {tr.back_login}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
