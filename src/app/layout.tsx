import type { Metadata } from 'next'
import { PageTransitionProvider } from '@/components/motion/PageTransition'
import './globals.scss'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khairulmiya.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Khairul Miya | Full-Stack Developer & AI Enthusiast',
    template: '%s | Khairul Miya',
  },
  description:
    'Khairul Miya is a Full-Stack Developer and AI Enthusiast building user-focused web applications with clean interfaces, reliable APIs, and maintainable backend systems.',
  keywords: [
    'Khairul Miya',
    'Full-Stack Developer',
    'AI Enthusiast',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Express',
    'MySQL',
    'Portfolio',
  ],
  authors: [{ name: 'Khairul Miya' }],
  creator: 'Khairul Miya',
  openGraph: {
    title: 'Khairul Miya | Full-Stack Developer & AI Enthusiast',
    description:
      'Personal portfolio, projects, and engineering journey of Khairul Miya — Full-Stack Developer & AI Enthusiast.',
    url: siteUrl,
    siteName: 'Khairul Miya Portfolio',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khairul Miya | Full-Stack Developer & AI Enthusiast',
    description:
      'Personal portfolio, projects, and engineering journey of Khairul Miya — Full-Stack Developer & AI Enthusiast.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Preload starting animation frames so mobile and desktop heroes appear instantly */}
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/mobile_fit_image/processed-ezgif-frame-037.webp"
          media="(max-width: 900px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          type="image/jpeg"
          href="/images/projects/ezgif-frame-001.jpg"
          media="(min-width: 901px)"
          fetchPriority="high"
        />
      </head>
      <body>
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  )
}
