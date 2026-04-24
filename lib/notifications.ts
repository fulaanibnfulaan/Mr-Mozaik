import twilio from 'twilio'
import { Resend } from 'resend'

// Twilio SMS
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendOrderConfirmationSMS(phone: string, orderNumber: string, eta: number) {
  return twilioClient.messages.create({
    body: `Bedankt voor je bestelling bij Mr. Mozaik! Je order #${orderNumber} is ontvangen. Geschatte tijd: ${eta} min. 🥙`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  })
}

export async function sendReadyForPickupSMS(phone: string, orderNumber: string) {
  return twilioClient.messages.create({
    body: `Je bestelling #${orderNumber} is klaar! Je kunt hem ophalen bij Mr. Mozaik. 🥙`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  })
}

// Resend email
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderReceiptEmail(params: {
  email: string
  name: string
  orderId: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
}) {
  const itemsHtml = params.items
    .map(item => `<tr><td>${item.quantity}× ${item.name}</td><td style="text-align:right">€${(item.price * item.quantity).toFixed(2)}</td></tr>`)
    .join('')

  return resend.emails.send({
    from: 'Mr. Mozaik <bestellingen@mrmozaik.nl>',
    to: params.email,
    subject: `Bestelling bevestigd — #${params.orderId.toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="background: #C8102E; width: 60px; height: 60px; border-radius: 16px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 28px; font-weight: bold;">M</span>
            </div>
            <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #1A1A1A; margin: 0;">Mr. Mozaik</h1>
            <p style="color: #6B7280; margin: 4px 0 0;">Bestelling bevestigd!</p>
          </div>

          <h2 style="color: #1A1A1A; font-size: 18px;">Hallo ${params.name},</h2>
          <p style="color: #6B7280;">Je bestelling is ontvangen. We zijn er mee aan de slag!</p>

          <div style="background: #F9F9F9; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
              <tr style="border-top: 1px solid #e0e0e0; margin-top: 8px;">
                <td style="padding-top: 12px; font-weight: bold; color: #1A1A1A;">Totaal</td>
                <td style="padding-top: 12px; text-align: right; font-weight: bold; color: #C8102E; font-size: 18px;">€${params.total.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <p style="color: #6B7280; font-size: 14px; text-align: center; margin-top: 24px;">
            Vragen? Bel ons op <a href="tel:+31341000000" style="color: #C8102E;">+31 341 000 000</a><br>
            Kerkstraat 1, 3841 AB Harderwijk
          </p>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendBirthdayEmail(email: string, name: string, couponCode: string) {
  return resend.emails.send({
    from: 'Mr. Mozaik <noreply@mrmozaik.nl>',
    to: email,
    subject: '🎂 Gefeliciteerd! Een cadeautje van Mr. Mozaik',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #C8102E;">Hartelijk gefeliciteerd, ${name}! 🎉</h1>
        <p>Ter ere van jouw verjaardag krijg je van ons een speciaal cadeau:</p>
        <div style="background: #FAEBEE; border: 2px solid #C8102E; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #6B7280;">Jouw verjaardagscode</p>
          <p style="margin: 8px 0; font-size: 32px; font-weight: bold; color: #C8102E; letter-spacing: 2px;">${couponCode}</p>
          <p style="margin: 0; font-size: 14px; color: #6B7280;">20% korting op je volgende bestelling</p>
        </div>
        <p style="color: #6B7280;">Geldig tot en met je verjaardag. Van harte!</p>
      </div>
    `,
  })
}
