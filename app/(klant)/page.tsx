'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, User, UserPlus, Shield, X, Eye, EyeOff, Bike, Store } from 'lucide-react'
import { useAppStore } from '@/store/app'

export default function WelcomePage() {
  const { language, setUserMode, orderType, setOrderType } = useAppStore()
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const t = {
    nl: {
      welkom: 'Welkom bij Mr. Mozaik',
      sub: 'Al ruim 25 jaar dé plek in Harderwijk voor heerlijk Turks en mediterraans eten. Met liefde bereid en boordevol smaak. Laat het bij je thuis bezorgen of kom het gezellig afhalen.',
      gast: 'Bestel als gast',
      account: 'Inloggen',
      register: 'Registreren',
      eigenaar: 'Ik ben de eigenaar',
      login_title: 'Inloggen',
      email: 'Gebruikersnaam of e-mailadres',
      password: 'Wachtwoord',
      login_btn: 'Inloggen',
      loading: 'Bezig...',
      forgot: 'Wachtwoord vergeten?',
    },
    en: {
      welkom: 'Welcome to Mr. Mozaik',
      sub: 'Turkish & Mediterranean food in Harderwijk. Carefully prepared, 100% halal — delivered to your door or ready to pick up.',
      gast: 'Order as guest',
      account: 'Log in',
      register: 'Register',
      eigenaar: 'I am the owner',
      login_title: 'Log in',
      email: 'Username or email address',
      password: 'Password',
      login_btn: 'Log in',
      loading: 'Loading...',
      forgot: 'Forgot password?',
    },
    de: {
      welkom: 'Willkommen bei Mr. Mozaik',
      sub: 'Türkisches & mediterranes Essen in Harderwijk. Sorgfältig zubereitet, 100% halal — geliefert oder zur Abholung bereit.',
      gast: 'Als Gast bestellen',
      account: 'Anmelden',
      register: 'Registrieren',
      eigenaar: 'Ich bin der Inhaber',
      login_title: 'Anmelden',
      email: 'Benutzername oder E-Mail',
      password: 'Passwort',
      login_btn: 'Anmelden',
      loading: 'Laden...',
      forgot: 'Passwort vergessen?',
    },
    tr: {
      welkom: "Mr. Mozaik'e Hoş Geldiniz",
      sub: "Harderwijk'te Türk ve Akdeniz mutfağı. Özenle hazırlanmış, %100 helal — kapınıza teslim veya gel-al.",
      gast: 'Misafir olarak sipariş ver',
      account: 'Giriş yap',
      register: 'Kayıt ol',
      eigenaar: 'Ben sahibim',
      login_title: 'Giriş yap',
      email: 'Kullanıcı adı veya e-posta',
      password: 'Şifre',
      login_btn: 'Giriş yap',
      loading: 'Yükleniyor...',
      forgot: 'Şifremi unuttum?',
    },
    ar: {
      welkom: 'مرحباً بك في Mr. Mozaik',
      sub: 'مطبخ تركي ومتوسطي في هاردرويك. محضر بعناية واهتمام، حلال 100% — توصيل إلى بابك أو استلام من المطعم.',
      gast: 'اطلب كضيف',
      account: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      eigenaar: 'أنا المالك',
      login_title: 'تسجيل الدخول',
      email: 'اسم المستخدم أو البريد الإلكتروني',
      password: 'كلمة المرور',
      login_btn: 'تسجيل الدخول',
      loading: 'جارٍ التحميل...',
      forgot: 'نسيت كلمة المرور؟',
    },
  }[language]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
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
        <Image src="/hero.jpg" alt="" fill className="object-cover object-center scale-105 blur-sm opacity-20 dark:opacity-10" />
        <div className="absolute inset-0 bg-[#EAE5D6]/80 dark:bg-gray-950/90" />
      </div>

      <motion.div
        className="w-full max-w-sm flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-gray-100 leading-tight mb-3">
          {t.welkom}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 whitespace-pre-line">
          {t.sub}
        </p>

        {/* Bezorgen / Afhalen toggle */}
        <div className="flex bg-[#F5F0E8] dark:bg-gray-800 rounded-2xl p-1 gap-1 w-full mb-6 border border-black/8 dark:border-white/8">
          {(['bezorgen', 'afhalen'] as const).map(type => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                orderType === type
                  ? 'bg-red-600 text-white shadow-[0_2px_8px_rgba(209,0,0,0.35)]'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {type === 'bezorgen' ? <Bike className="w-4 h-4" /> : <Store className="w-4 h-4" />}
              {type === 'bezorgen'
                ? (language === 'nl' ? 'Bezorgen' : language === 'en' ? 'Delivery' : language === 'tr' ? 'Teslimat' : language === 'de' ? 'Liefern' : 'توصيل')
                : (language === 'nl' ? 'Afhalen'  : language === 'en' ? 'Pickup'   : language === 'tr' ? 'Gel al'   : language === 'de' ? 'Abholen' : 'استلام')}
            </button>
          ))}
        </div>

        <div className="w-full space-y-3">
          <Link
            href="/menu"
            onClick={() => setUserMode('guest')}
            className="flex items-center justify-between w-full bg-red-600 text-white font-bold px-5 py-4 rounded-2xl shadow-[0_4px_20px_rgba(209,0,0,0.4)] hover:bg-red-700 transition-colors"
          >
            <span>{t.gast}</span>
            <ChevronRight className="w-5 h-5 opacity-80" />
          </Link>

          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center justify-between w-full bg-[#F5F0E8] dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold px-5 py-4 rounded-2xl border border-black/8 dark:border-white/8 hover:bg-[#ede8da] dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-red-600" />
              <span>{t.account}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <Link
            href="/register"
            className="flex items-center justify-between w-full bg-[#F5F0E8] dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold px-5 py-4 rounded-2xl border border-black/8 dark:border-white/8 hover:bg-[#ede8da] dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <UserPlus className="w-4 h-4 text-red-600" />
              <span>{t.register}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-center gap-2 w-full py-3 text-gray-400 dark:text-gray-500 text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t.eigenaar}</span>
          </Link>
        </div>
      </motion.div>

      {/* Login modal */}
      <AnimatePresence>
        {showLogin && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowLogin(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-[#F5F0E8] dark:bg-gray-800 rounded-3xl shadow-2xl p-6"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-gray-900 dark:text-gray-100">{t.login_title}</h2>
                <button
                  onClick={() => setShowLogin(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t.email}
                  required
                  autoFocus
                  className="w-full bg-white dark:bg-gray-700 border border-black/8 dark:border-white/8 rounded-2xl px-4 py-3.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-red-300 transition-colors"
                />

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={t.password}
                    required
                    className="w-full bg-white dark:bg-gray-700 border border-black/8 dark:border-white/8 rounded-2xl px-4 py-3.5 pr-11 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-red-300 transition-colors"
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
                  <button type="button" className="text-xs text-gray-400 hover:text-red-600 transition-colors">
                    {t.forgot}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl shadow-[0_4px_20px_rgba(209,0,0,0.4)] hover:bg-red-700 disabled:opacity-60 transition-colors"
                >
                  {loading ? t.loading : t.login_btn}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
