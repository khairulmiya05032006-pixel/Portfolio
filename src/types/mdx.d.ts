declare module '*.mdx' {
  import type { ComponentType } from 'react'

  export const metadata: {
    title: string
    description: string
    publishedAt: string
    updatedAt?: string
    slug: string
    tags: string[]
    coverImage?: string
    draft: boolean
    relatedProjectIds?: string[]
    [key: string]: unknown
  }

  const component: ComponentType
  export default component
}
