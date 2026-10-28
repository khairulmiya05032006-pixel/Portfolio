import { NextResponse } from 'next/server'

/**
 * AI Chat API Route — Placeholder
 * Replace with actual AI SDK integration when ready.
 * Install: pnpm add @ai-sdk/google ai
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message } = body as { message?: string }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
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
