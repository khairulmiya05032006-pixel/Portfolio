'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { BlogCard } from '@/components/blog/BlogCard'
import { ArticleModal } from '@/components/blog/ArticleModal'
import { blogArticles, type BlogArticle } from '@/data/portfolio'
import styles from './Blog.module.scss'

gsap.registerPlugin(ScrollTrigger)

export function Blog() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !gridRef.current) return
    const cards = gridRef.current.querySelectorAll('[data-blog-card]')
    const context = gsap.context(() => {
      gsap.from(cards, {
        autoAlpha: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        y: 30,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 82%',
          once: true,
        },
      })
    }, gridRef)
    return () => context.revert()
  }, [])

  return (
    <>
      <section id="blog" className={styles.section} aria-labelledby="blog-heading">
        <div className={styles.inner}>
          <SectionHeading
            eyebrow="05 / Articles"
            decorativeWord="Blog"
            id="blog-heading"
            title={<>Thoughts & <span>insights.</span></>}
          />
          <p className={styles.intro}>Notes and reflections on the technologies, patterns, and ideas I encounter while building.</p>
          <div className={styles.grid} ref={gridRef}>
            {blogArticles.map((article) => (
              <div key={article.slug} data-blog-card>
                <BlogCard article={article} onRead={setSelectedArticle} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </>
  )
}
