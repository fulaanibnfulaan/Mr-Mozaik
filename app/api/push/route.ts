import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const SubscribeSchema = z.object({
  user_id: z.string(),
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = SubscribeSchema.parse(body)

    // In production: store push subscription in Supabase
    console.log('Push subscription registered for user:', data.user_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Ongeldige invoer' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')

  // In production: remove push subscription from Supabase
  return NextResponse.json({ success: true })
}
