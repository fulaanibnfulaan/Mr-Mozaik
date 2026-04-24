import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export const STRIPE_PASS_PRICE_ID = process.env.STRIPE_PASS_PRICE_ID || 'price_demo'

export async function createPaymentIntent(params: {
  amount: number
  orderId: string
  userId: string
  method: 'ideal' | 'card'
}) {
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(params.amount * 100),
    currency: 'eur',
    payment_method_types: params.method === 'ideal' ? ['ideal'] : ['card'],
    metadata: {
      order_id: params.orderId,
      user_id: params.userId,
    },
  })
  return intent
}

export async function createPassSubscription(customerId: string) {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: STRIPE_PASS_PRICE_ID }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  })
}
