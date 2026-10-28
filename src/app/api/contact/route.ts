import { NextResponse } from 'next/server'
import { validateContactForm } from '@/lib/security/request-validation'
import { sendContactEmail } from '@/lib/email/send-contact-email'
import { checkRateLimit } from '@/lib/security/rate-limit'

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const { allowed } = checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Validate
    const body = await request.json()
    const result = validateContactForm(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: result.error.issues },
        { status: 400 }
      )
    }

    // Send email
    const emailResult = await sendContactEmail(result.data)
    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error ?? 'Failed to send message' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
