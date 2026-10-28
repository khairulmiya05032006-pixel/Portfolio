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
  console.log('Contact form submission:', data)
  return { success: true }
}
