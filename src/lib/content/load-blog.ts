import type { ComponentType } from 'react'

export type BlogMeta = {
  slug: string
  title: string
  description: string
  publishedAt: string
  tags: string[]
  draft: boolean
}

// Statically map known blog imports so Turbopack/webpack can bundle them deterministically
const blogPostMap: Record<
  string,
  () => Promise<{ default: ComponentType; metadata: BlogMeta }>
> = {
  'sample-article': () => import('@/content/blog/sample-article.mdx'),
  'another-article': () => import('@/content/blog/another-article.mdx'),
}

/** Get all blog post slugs */
export function getBlogSlugs(): string[] {
  return Object.keys(blogPostMap)
}

/** Load an MDX blog post by slug */
export async function loadBlogPost(slug: string) {
  const loader = blogPostMap[slug]
  if (!loader) {
    throw new Error(`Blog post not found: ${slug}`)
  }
  const { default: Content, metadata } = await loader()
  return { Content, metadata }
}
