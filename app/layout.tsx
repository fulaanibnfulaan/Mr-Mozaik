import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mr. Mozaik — Turks & Mediterraans Restaurant Harderwijk',
  description: 'Bestel online bij Mr. Mozaik in Harderwijk. Vers bereid Turks en mediterraans eten, halal, snel bezorgd of afhalen.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Mr. Mozaik' },
}

export const viewport: Viewport = {
  themeColor: '#0D0A07',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-night antialiased">
        {children}
      </body>
    </html>
  )
}
