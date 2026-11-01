import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/security/rate-limit'

/**
 * AI Chat API Route — Placeholder
 * Replace with actual AI SDK integration when ready.
 * Install: pnpm add @ai-sdk/google ai
 */
export async function POST(request: Request) {
  try {
    // Guard against oversized payloads
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > 8192) {
      return NextResponse.json(
        { error: 'Payload too large' },
        { status: 413 }
      )
    }

    // Rate limiting
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const ip = rawIp.split(',')[0].trim()
    const { allowed } = checkRateLimit(`chat_${ip}`, 10, 60_000)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { message } = body as { message?: unknown }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a valid text string' },
        { status: 400 }
      )
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message must not exceed 500 characters' },
        { status: 400 }
      )
    }

    // TODO: Replace with actual AI integration
    return NextResponse.json({
      reply: 'AI chat is not yet configured. Please check back later.',
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
