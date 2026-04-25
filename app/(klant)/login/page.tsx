'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '@/store/app'

export default function LoginPage() {
  const { language, setUserMode } = useAppStore()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const t = {
    nl: {
      title: 'Inloggen',
      email: 'E-mailadres',
      password: 'Wachtwoord',
      login: 'Inloggen',
      forgot: 'Wachtwoord vergeten?',
      no_account: 'Nog geen account?',
      register: 'Registreer',
      loading: 'Bezig...',
    },
    en: {
      title: 'Log in',
      email: 'Email address',
      password: 'Password',
      login: 'Log in',
      forgot: 'Forgot password?',
      no_account: "Don't have an account?",
      register: 'Register',
      loading: 'Loading...',
    },
    de: {
      title: 'Anmelden',
      email: 'E-Mail-Adresse',
      password: 'Passwort',
      login: 'Anmelden',
      forgot: 'Passwort vergessen?',
      no_account: 'Noch kein Konto?',
      register: 'Registrieren',
      loading: 'Laden...',
    },
    tr: {
      title: 'Giriş yap',
      email: 'E-posta adresi',
      password: 'Şifre',
      login: 'Giriş yap',
      forgot: 'Şifremi unuttum?',
      no_account: 'Hesabın yok mu?',
      register: 'Kayıt ol',
      loading: 'Yükleniyor...',
    },
    ar: {
      title: 'تسجيل الدخول',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      login: 'تسجيل الدخول',
      forgot: 'نسيت كلمة المرور؟',
      no_account: 'ليس لديك حساب؟',
      register: 'سجّل',
      loading: 'جارٍ التحميل...',
    },
  }[language]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setUserMode('account')
    router.push('/account')
  }

  return (
    <div
      className="min-h-[calc(100vh-49px)] md:min-h-screen flex flex-col items-center justify-center px-6 py-12 -mt-[49px] md:mt-0"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#EAE5D6] dark:bg-gray-950" />
      </div>

      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          {language === 'nl' ? 'Terug' : language === 'de' ? 'Zurück' : language === 'tr' ? 'Geri' : language === 'ar' ? 'رجوع' : 'Back'}
        </Link>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Mr. Mozaik" width={64} height={64} className="h-14 w-auto mb-4 drop-shadow" />
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-100">{t.title}</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.email}
              required
              className="w-full bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8 rounded-2xl px-4 py-3.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-red-300 transition-colors"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t.password}
              required
              className="w-full bg-[#F5F0E8] dark:bg-gray-800 border border-black/8 dark:border-white/8 rounded-2xl px-4 py-3.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-red-300 transition-colors pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-600 transition-colors">
              {t.forgot}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl shadow-[0_4px_20px_rgba(209,0,0,0.4)] hover:bg-red-700 disabled:opacity-60 transition-colors mt-1"
          >
            {loading ? t.loading : t.login}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
          {t.no_account}{' '}
          <button className="text-red-600 font-semibold hover:underline">{t.register}</button>
        </p>
      </motion.div>
    </div>
  )
}
