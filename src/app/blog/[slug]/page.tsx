import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogSlugs, loadBlogPost } from '@/lib/content/load-blog'

export const dynamicParams = false

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let postData
  try {
    postData = await loadBlogPost(slug)
  } catch {
    notFound()
  }

  const { Content, metadata } = postData

  return (
    <article
      style={{
        maxWidth: '780px',
        margin: '0 auto',
        padding: '6rem 1.5rem',
      }}
    >
      <Link
        href="/#blog"
        style={{
          display: 'inline-block',
          marginBottom: '2rem',
          color: 'var(--color-accent, #a78bfa)',
          textDecoration: 'none',
        }}
      >
        ← Back to Portfolio
      </Link>
      <header style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            lineHeight: 1.1,
            marginBottom: '0.5rem',
          }}
        >
          {metadata.title}
        </h1>
        <p
          style={{
            color: 'var(--color-muted, #9e97a8)',
            fontSize: '0.9rem',
          }}
        >
          {metadata.publishedAt}
        </p>
      </header>
      <div style={{ lineHeight: 1.7, fontSize: '1.05rem' }}>
        <Content />
      </div>
    </article>
  )
}
