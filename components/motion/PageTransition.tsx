'use client'

import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import styles from './PageTransition.module.scss'

type PageTransitionContextType = {
  triggerTransition: (targetHref: string, onSwap?: () => void) => void
  isTransitioning: boolean
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  triggerTransition: () => {},
  isTransitioning: false,
})

export function usePageTransition() {
  return useContext(PageTransitionContext)
}

type PageTransitionProviderProps = {
  children: ReactNode
}

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const router = useRouter()
  const overlayRef = useRef<HTMLDivElement>(null)
  const barElementsRef = useRef<HTMLDivElement[]>([])
  const isAnimatingRef = useRef(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Initialize bars off-screen above the viewport once mounted
  useEffect(() => {
    if (barElementsRef.current.length > 0) {
      gsap.set(barElementsRef.current, { yPercent: -100 })
    }
  }, [])

  const triggerTransition = useCallback(
    (targetHref: string, onSwap?: () => void) => {
      // Prevent overlapping transitions while one is actively playing
      if (isAnimatingRef.current) return

      // Respect prefers-reduced-motion
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        if (onSwap) onSwap()
        if (targetHref.startsWith('#')) {
          const target = document.querySelector(targetHref)
          target?.scrollIntoView({ behavior: 'smooth' })
        } else if (targetHref) {
          router.push(targetHref)
        }
        return
      }

      const bars = barElementsRef.current
      const overlay = overlayRef.current
      if (!overlay || bars.length === 0) return

      isAnimatingRef.current = true
      setIsTransitioning(true)

      // Ensure overlay is visible and capturing pointer events during animation
      gsap.set(overlay, { visibility: 'visible', pointerEvents: 'auto' })

      // Reset bars cleanly above the viewport on Y axis
      gsap.set(bars, { yPercent: -100 })

      const tl = gsap.timeline({
        onComplete: () => {
          // Reset bars back above the screen AFTER all columns have completely exited off the bottom
          gsap.set(bars, { yPercent: -100 })
          gsap.set(overlay, { visibility: 'hidden', pointerEvents: 'none' })
          isAnimatingRef.current = false
          setIsTransitioning(false)
        },
      })

      // =========================================================================
      // PHASE 1: Columns Go Down to Cover
      // All 6 vertical columns drop down from top (yPercent: -100) to center (yPercent: 0)
      // in a cascading wave from left to right.
      // =========================================================================
      tl.to(bars, {
        yPercent: 0,
        duration: 0.5,
        ease: 'power3.inOut',
        stagger: 0.04,
      })

      // =========================================================================
      // PHASE 2: Content Swap Under Full Coverage
      // When screen is 100% covered, teleport scroll position to target section.
      // Smooth scroll is temporarily disabled to prevent laggy background sliding.
      // =========================================================================
      tl.call(() => {
        if (onSwap) onSwap()

        if (targetHref.startsWith('#')) {
          const html = document.documentElement
          const body = document.body
          const prevHtmlScroll = html.style.scrollBehavior
          const prevBodyScroll = body.style.scrollBehavior

          html.style.scrollBehavior = 'auto'
          body.style.scrollBehavior = 'auto'

          if (targetHref === '#home' || targetHref === '#top' || targetHref === '#') {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
          } else {
            const targetEl = document.querySelector(targetHref)
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'auto', block: 'start' })
            }
          }

          if (typeof window !== 'undefined' && window.history.replaceState) {
            window.history.replaceState(null, '', targetHref)
          }

          requestAnimationFrame(() => {
            html.style.scrollBehavior = prevHtmlScroll
            body.style.scrollBehavior = prevBodyScroll
          })
        } else if (targetHref) {
          router.push(targetHref)
        }
      })

      // Brief hold for the DOM paint to settle behind the cover
      tl.to({}, { duration: 0.06 })

      // =========================================================================
      // PHASE 3: All Columns Go Down to Reveal Information
      // Instead of vanishing, every single column continues sliding DOWNWARD
      // (from yPercent: 0 to yPercent: 100) off the bottom of the viewport,
      // unveiling the target section cleanly from top to bottom.
      // =========================================================================
      tl.to(bars, {
        yPercent: 100,
        duration: 0.5,
        ease: 'power3.inOut',
        stagger: 0.04,
      })
    },
    [router]
  )

  // Global delegation: automatically intercept clicks on in-page hash links
  // so all menu items, nav buttons, and internal links trigger the vertical wipe.
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('#') || href === '#') return

      const targetElement = document.querySelector(href)
      if (!targetElement) return

      e.preventDefault()
      triggerTransition(href)
    }

    document.addEventListener('click', handleDocumentClick, { capture: true })
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true })
    }
  }, [triggerTransition])

  return (
    <PageTransitionContext.Provider value={{ triggerTransition, isTransitioning }}>
      {children}

      {/* Full-screen 6-Column Vertical Wipe Down Overlay */}
      <div
        ref={overlayRef}
        className={`${styles.overlay} ${isTransitioning ? styles.overlayActive : ''}`}
        aria-hidden="true"
        data-page-transition-overlay
      >
        {[
          styles.bar1,
          styles.bar2,
          styles.bar3,
          styles.bar4,
          styles.bar5,
          styles.bar6,
        ].map((barColorClass, idx) => (
          <div
            key={barColorClass}
            ref={(el) => {
              if (el) barElementsRef.current[idx] = el
            }}
            className={`${styles.bar} ${barColorClass}`}
          />
        ))}
      </div>
    </PageTransitionContext.Provider>
  )
}
