import type { Metadata } from 'next'
import { PageTransitionProvider } from '@/components/motion/PageTransition'
import './globals.scss'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: 'Khairul Miya | Full-stack developer in progress',
  description: 'Khairul Miya is a third-year BCA student learning to build useful web products with JavaScript, React, Next.js, Node.js, Express, and MySQL.',
  openGraph: {
    title: 'Khairul Miya | Full-stack developer in progress',
    description: 'A BCA student learning through responsive interfaces, JavaScript projects, and a documented full-stack loan-management system.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  )
}
