import { NextResponse } from 'next/server'
import { validateContactForm } from '@/lib/security/request-validation'
import { sendContactEmail } from '@/lib/email/send-contact-email'
import { checkRateLimit } from '@/lib/security/rate-limit'

export async function POST(request: Request) {
  try {
    // Guard against oversized payloads (max 16KB)
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > 16384) {
      return NextResponse.json(
        { error: 'Payload too large' },
        { status: 413 }
      )
    }

    // Rate limiting with safe IP extraction
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const ip = rawIp.split(',')[0].trim()
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
