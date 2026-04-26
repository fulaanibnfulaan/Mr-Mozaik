'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, UserPlus, Loader2, Check, X, Mail, RefreshCw } from 'lucide-react'
import { useAppStore } from '@/store/app'

const translations = {
  nl: {
    title: 'Account aanmaken',
    name: 'Volledige naam',
    email: 'E-mailadres',
    password: 'Wachtwoord',
    confirm: 'Wachtwoord bevestigen',
    submit: 'Account aanmaken',
    loading: 'Bezig...',
    already: 'Al een account?',
    login: 'Inloggen',
    no_match: 'Wachtwoorden komen niet overeen',
    req_length: 'Minimaal 8 tekens',
    req_upper: 'Minimaal 1 hoofdletter',
    req_number: 'Minimaal 1 cijfer',
    req_special: 'Minimaal 1 speciaal teken',
    check_email: 'Controleer je e-mail',
    check_desc: 'We hebben een bevestigingslink gestuurd naar',
    check_sub: 'Klik op de link in de e-mail om je account te activeren.',
    resend: 'Opnieuw versturen',
    resend_wait: 'Opnieuw versturen (%s s)',
    back_login: 'Terug naar inloggen',
    confirm_btn: 'E-mail bevestigd — doorgaan',
  },
  en: {
    title: 'Create account',
    name: 'Full name',
    email: 'Email address',
    password: 'Password',
    confirm: 'Confirm password',
    submit: 'Create account',
    loading: 'Loading...',
    already: 'Already have an account?',
    login: 'Log in',
    no_match: 'Passwords do not match',
    req_length: 'At least 8 characters',
    req_upper: 'At least 1 uppercase letter',
    req_number: 'At least 1 number',
    req_special: 'At least 1 special character',
    check_email: 'Check your email',
    check_desc: 'We sent a confirmation link to',
    check_sub: 'Click the link in the email to activate your account.',
    resend: 'Resend email',
    resend_wait: 'Resend (%s s)',
    back_login: 'Back to login',
    confirm_btn: 'Email confirmed — continue',
  },
  tr: {
    title: 'Hesap oluştur',
    name: 'Ad Soyad',
    email: 'E-posta adresi',
    password: 'Şifre',
    confirm: 'Şifreyi onayla',
    submit: 'Hesap oluştur',
    loading: 'Yükleniyor...',
    already: 'Zaten hesabın var mı?',
    login: 'Giriş yap',
    no_match: 'Şifreler eşleşmiyor',
    req_length: 'En az 8 karakter',
    req_upper: 'En az 1 büyük harf',
    req_number: 'En az 1 rakam',
    req_special: 'En az 1 özel karakter',
    check_email: 'E-postanı kontrol et',
    check_desc: 'Onay bağlantısı şu adrese gönderildi:',
    check_sub: 'Hesabını etkinleştirmek için e-postadaki bağlantıya tıkla.',
    resend: 'Tekrar gönder',
    resend_wait: 'Tekrar gönder (%s s)',
    back_login: 'Girişe dön',
    confirm_btn: 'E-posta onaylandı — devam et',
  },
  ar: {
    title: 'إنشاء حساب',
    name: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirm: 'تأكيد كلمة المرور',
    submit: 'إنشاء الحساب',
    loading: 'جارٍ التحميل...',
    already: 'لديك حساب بالفعل؟',
    login: 'تسجيل الدخول',
    no_match: 'كلمات المرور غير متطابقة',
    req_length: '8 أحرف على الأقل',
    req_upper: 'حرف كبير واحد على الأقل',
    req_number: 'رقم واحد على الأقل',
    req_special: 'رمز خاص واحد على الأقل',
    check_email: 'تحقق من بريدك الإلكتروني',
    check_desc: 'أرسلنا رابط التأكيد إلى',
    check_sub: 'انقر على الرابط في البريد الإلكتروني لتفعيل حسابك.',
    resend: 'إعادة الإرسال',
    resend_wait: 'إعادة الإرسال (%s ث)',
    back_login: 'العودة لتسجيل الدخول',
    confirm_btn: 'تم التأكيد — متابعة',
  },
  de: {
    title: 'Konto erstellen',
    name: 'Vollständiger Name',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    confirm: 'Passwort bestätigen',
    submit: 'Konto erstellen',
    loading: 'Laden...',
    already: 'Bereits ein Konto?',
    login: 'Anmelden',
    no_match: 'Passwörter stimmen nicht überein',
    req_length: 'Mindestens 8 Zeichen',
    req_upper: 'Mindestens 1 Großbuchstabe',
    req_number: 'Mindestens 1 Zahl',
    req_special: 'Mindestens 1 Sonderzeichen',
    check_email: 'E-Mail überprüfen',
    check_desc: 'Wir haben einen Bestätigungslink gesendet an',
    check_sub: 'Klicke auf den Link in der E-Mail, um dein Konto zu aktivieren.',
    resend: 'Erneut senden',
    resend_wait: 'Erneut senden (%s s)',
    back_login: 'Zurück zur Anmeldung',
    confirm_btn: 'E-Mail bestätigt — weiter',
  },
}

function getRequirements(pw: string) {
  return {
    length:  pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    number:  /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  }
}

export default function RegisterPage() {
  const router = useRouter()
  const { language, setUserMode } = useAppStore()
  const tr = translations[language]

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [sent, setSent] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)

  const req = getRequirements(password)
  const passwordValid = req.length && req.upper && req.number && req.special

  const startResendCountdown = () => {
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
    if (!passwordValid) return
    if (password !== confirm) { setError(tr.no_match); return }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
    startResendCountdown()
  }

  const handleResend = () => {
    if (resendCountdown > 0) return
    startResendCountdown()
  }

  const handleConfirmed = () => {
    setUserMode('account')
    router.push('/menu')
  }

  const requirements: { key: keyof typeof req; label: string }[] = [
    { key: 'length',  label: tr.req_length  },
    { key: 'upper',   label: tr.req_upper   },
    { key: 'number',  label: tr.req_number  },
    { key: 'special', label: tr.req_special },
  ]

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
              <span>Terug</span>
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center shadow-[0_4px_12px_rgba(209,0,0,0.35)]">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-100">{tr.title}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={tr.name}
                required
                autoFocus
                className="w-full bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8 rounded-2xl px-4 py-3.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-red-300 transition-colors"
              />

              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={tr.email}
                required
                className="w-full bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8 rounded-2xl px-4 py-3.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-red-300 transition-colors"
              />

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder={tr.password}
                    required
                    className="w-full bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8 rounded-2xl px-4 py-3.5 pr-11 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-red-300 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <AnimatePresence>
                  {(passwordFocused || (password.length > 0 && !passwordValid)) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 bg-[#F5F0E8] dark:bg-gray-800 rounded-xl px-3 py-2.5 space-y-1.5 border border-black/8 dark:border-white/8">
                        {requirements.map(r => (
                          <div key={r.key} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${req[r.key] ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                              {req[r.key]
                                ? <Check className="w-2.5 h-2.5 text-white" />
                                : <X className="w-2.5 h-2.5 text-gray-400" />
                              }
                            </div>
                            <span className={`text-xs transition-colors ${req[r.key] ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                              {r.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError('') }}
                  placeholder={tr.confirm}
                  required
                  className="w-full bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8 rounded-2xl px-4 py-3.5 pr-11 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-red-300 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-600 font-medium px-1">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !passwordValid}
                className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl shadow-[0_4px_20px_rgba(209,0,0,0.4)] hover:bg-red-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>{tr.loading}</span></>
                ) : (
                  <span>{tr.submit}</span>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
              {tr.already}{' '}
              <button
                onClick={() => router.back()}
                className="text-red-600 font-semibold hover:underline"
              >
                {tr.login}
              </button>
            </p>
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
              onClick={handleConfirmed}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl shadow-[0_4px_20px_rgba(209,0,0,0.4)] hover:bg-red-700 transition-colors mb-3"
            >
              {tr.confirm_btn}
            </button>

            <button
              onClick={handleResend}
              disabled={resendCountdown > 0}
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-red-600 disabled:hover:text-gray-400 disabled:cursor-default transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>
                {resendCountdown > 0
                  ? tr.resend_wait.replace('%s', String(resendCountdown))
                  : tr.resend}
              </span>
            </button>

            <button
              onClick={() => router.back()}
              className="mt-2 text-sm text-gray-400 dark:text-gray-500 hover:text-red-600 transition-colors"
            >
              {tr.back_login}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
