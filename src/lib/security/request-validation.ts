import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
})

export type ContactFormData = z.infer<typeof ContactFormSchema>

export function validateContactForm(data: unknown) {
  return ContactFormSchema.safeParse(data)
}
