/**
 * Send a contact form email.
 * Placeholder — implement with Resend, Nodemailer, or similar when ready.
 */
export async function sendContactEmail(data: {
  name: string
  email: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  // TODO: Integrate with email service (e.g., Resend)
  // Safely avoid logging raw PII in production logs
  if (process.env.NODE_ENV === 'development') {
    // Only log length/metadata in dev mode
    console.debug(`Contact message received from ${data.email.replace(/(?<=.{2}).(?=[^@]*?@)/g, '*')}`)
  }
  return { success: true }
}
