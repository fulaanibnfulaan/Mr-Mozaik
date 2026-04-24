import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const orderId = paymentIntent.metadata.order_id

      // In production:
      // 1. Update order status in Supabase
      // 2. Send SMS via Twilio
      // 3. Send email receipt via Resend
      // 4. Send push notification
      // 5. Print via Epson ePOS
      console.log(`Order ${orderId} paid: ${paymentIntent.id}`)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`Payment failed for order: ${paymentIntent.metadata.order_id}`)
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      // Update Mr. Mozaik Pass status in Supabase
      console.log(`Pass subscription: ${subscription.id}`)
      break
    }

    case 'customer.subscription.deleted': {
      // Deactivate pass
      break
    }
  }

  return NextResponse.json({ received: true })
}
