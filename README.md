# Mr. Mozaik — Food Ordering App

Productie-klare food ordering web app voor Mr. Mozaik — een Turks/mediterraan afhaal- en bezorgrestaurant in Harderwijk, Nederland.

## Tech Stack

- **Framework**: Next.js 14 + App Router + TypeScript
- **Database & Auth**: Supabase
- **Betalingen**: Stripe (iDEAL + creditcard)
- **Hosting**: Vercel
- **Styling**: Tailwind CSS + Framer Motion
- **State**: Zustand (winkelwagen + app state)
- **SMS**: Twilio
- **Mail**: Resend
- **PWA**: Web manifest + service worker

## Installatie

```bash
cd mr-mozaik
npm install
cp .env.local.example .env.local
# Vul alle API keys in in .env.local
npm run dev
```

## Omgevingsvariabelen

Vul `.env.local` in met:

| Key | Waar vind je dit? |
|-----|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | mapbox.com → Account → Tokens |
| `TWILIO_ACCOUNT_SID` | console.twilio.com |
| `TWILIO_AUTH_TOKEN` | console.twilio.com |
| `TWILIO_PHONE_NUMBER` | console.twilio.com |
| `RESEND_API_KEY` | resend.com → API Keys |
| `VAPID_PUBLIC_KEY` | Genereer met `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | Genereer met `npx web-push generate-vapid-keys` |
| `GOOGLE_PLACES_API_KEY` | Google Cloud Console |

## Database Setup

```bash
# Installeer Supabase CLI
npm install -g supabase

# Login en koppel project
supabase login
supabase link --project-ref <jouw-project-ref>

# Voer migrations uit
supabase db push
```

Of plak de inhoud van `supabase/migrations/001_initial_schema.sql` handmatig in de Supabase SQL Editor.

## Routes

| Route | Beschrijving |
|-------|-------------|
| `/` | Menu / homepagina (klanten) |
| `/item/[id]` | Item detail met add-ons |
| `/winkelwagen` | Winkelwagen |
| `/checkout` | Afrekenen (adres, tijd, betaling) |
| `/order/[id]` | Live order tracking |
| `/account` | Account, loyaliteit, spin the wheel |
| `/bezorger` | Bezorger app |
| `/admin` | Admin dashboard (bestellingen) |
| `/admin/menu` | Menu beheer |
| `/admin/analytics` | Analytics + heatmap |

## Features

### Klant
- 🍽️ Menu met zoeken, categoriefilters en dieetwensen
- 🛒 Winkelwagen met add-ons, fooi, coupon, eco-optie
- 💳 Checkout met iDEAL/creditcard via Stripe
- 📍 Bezorgzone check via Mapbox
- 📡 Live order tracking met realtime status
- ⭐ Loyaliteitspunten (Brons/Zilver/Goud)
- 🎰 Spin the wheel (wekelijkse prijs)
- 💬 In-app chat met restaurant
- 🌍 Meertalig: NL, EN, TR, AR (met RTL support)
- 📱 PWA — installeerbaar als app

### Bezorger
- 📋 Lijst actieve bestellingen
- 🗺️ Mapbox routekaart
- ✅ Markeer als afgeleverd

### Admin
- 📊 Live bestellingen dashboard
- ⏸️ Orders pauzeren / piekuur modus
- 🖨️ Epson thermische printer integratie
- 📈 Analytics met heatmap en top items
- 🍕 Menu beheer (sold out toggle)

## Deployment (Vercel)

```bash
# Installeer Vercel CLI
npm i -g vercel

# Deploy
vercel

# Of koppel aan GitHub voor automatische deploys
```

## Stripe Webhooks

Configureer het webhook endpoint in Stripe Dashboard:
- **URL**: `https://jouwdomein.nl/api/stripe/webhook`
- **Events**: `payment_intent.succeeded`, `payment_intent.payment_failed`, `customer.subscription.*`

## Supabase Realtime

Voor live order tracking zijn realtime subscriptions ingesteld op de `orders` tabel. In de klant-app luistert de tracking pagina naar status updates.

## SMS Setup (Twilio)

Koop een Nederlands telefoonnummer (+31) in de Twilio console. Zet de credentials in `.env.local`.

## Mail Setup (Resend)

1. Maak account op resend.com
2. Voeg je domein toe en verifieer DNS
3. Kopieer de API key naar `.env.local`
