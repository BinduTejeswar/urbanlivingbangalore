import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getCachedSiteSettings } from '@/sanity/lib/fetchers'

export async function POST(req: Request) {
  try {
    const { name, phone, message, propertyName } = await req.json()

    if (!name || !phone || !message || !propertyName) {
      return NextResponse.json({ error: 'Please fill all required fields' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey.includes('...')) {
      return NextResponse.json(
        { error: 'Email service is not configured. Please set a valid RESEND_API_KEY.' },
        { status: 503 }
      )
    }

    const resend = new Resend(apiKey)
    
    const settings = await getCachedSiteSettings()
    const adminEmail = settings?.contactEmail || 'admin@example.com'

    const { data, error } = await resend.emails.send({
      from: 'UrbanLivingBangalore <onboarding@resend.dev>',
      to: adminEmail,
      subject: `New Enquiry: ${propertyName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1C1008;">
          <h2 style="color: #F97316;">New Property Enquiry</h2>
          <p><strong>Property:</strong> ${propertyName}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #FFFAF5; padding: 15px; border-radius: 10px; border: 1px solid #F97316;">
            ${message}
          </div>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Unable to send enquiry email' },
        { status: error.statusCode || 400 }
      )
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
