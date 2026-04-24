import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const CreateOrderSchema = z.object({
  type: z.enum(['afhalen', 'bezorgen']),
  items: z.array(z.object({
    menu_item_id: z.string(),
    quantity: z.number().min(1),
    addon_ids: z.array(z.string()),
  })),
  address_id: z.string().optional(),
  tip: z.number().min(0).default(0),
  no_cutlery: z.boolean().default(false),
  contactless: z.boolean().default(false),
  note: z.string().max(500).optional(),
  coupon_code: z.string().optional(),
  payment_method: z.enum(['ideal', 'card', 'cadeaukaart', 'factuur']),
  scheduled_at: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = CreateOrderSchema.parse(body)

    // In production: create order in Supabase + Stripe PaymentIntent
    const orderId = `ord-${Date.now()}`

    return NextResponse.json({
      success: true,
      order_id: orderId,
      payment_intent_client_secret: 'pi_demo_secret',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ongeldige invoer', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')

  // In production: fetch from Supabase
  return NextResponse.json({
    orders: [],
  })
}
