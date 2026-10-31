'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Mobile-Only Scroll Reveals Hook
 * Creates smooth, subtle, scroll-triggered entrance animations for mobile viewports (<= 900px).
 * Leaves content visible and accessible without creating zero-opacity blank screens.
 * Leaves desktop ( > 900px ) 100% untouched.
 */
export function useMobileScrollReveals() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth > 900) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // 1. About section reveal: subtle upward settle without blanking out content
      const aboutSection = document.getElementById('about')
      if (aboutSection) {
        const aboutCard = aboutSection.querySelector('[class*="corridorRight"]')
        if (aboutCard) {
          gsap.fromTo(
            aboutCard,
            { y: 20, opacity: 0.88 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: aboutSection,
                start: 'top 95%',
                once: true,
              },
            }
          )
        }
      }

      // 2. What I Do & Build section reveal
      const whatSection = document.getElementById('what-i-do')
      if (whatSection) {
        const header = whatSection.querySelector('[class*="header"]')
        const slider = whatSection.querySelector('[class*="mobileSliderWrapper"]')
        if (header) {
          gsap.fromTo(
            header,
            { y: 20, opacity: 0.88 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: whatSection,
                start: 'top 92%',
                once: true,
              },
            }
          )
        }
        if (slider) {
          gsap.fromTo(
            slider,
            { y: 20, opacity: 0.88 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              delay: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: whatSection,
                start: 'top 88%',
                once: true,
              },
            }
          )
        }
      }

      // 3. Career & Education section reveal
      const careerSection = document.getElementById('career')
      if (careerSection) {
        const header = careerSection.querySelector('[class*="header"]')
        const slider = careerSection.querySelector('[class*="mobileSliderWrapper"]')
        if (header) {
          gsap.fromTo(
            header,
            { y: 20, opacity: 0.88 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: careerSection,
                start: 'top 92%',
                once: true,
              },
            }
          )
        }
        if (slider) {
          gsap.fromTo(
            slider,
            { y: 20, opacity: 0.88 },
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              delay: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: careerSection,
                start: 'top 88%',
                once: true,
              },
            }
          )
        }
      }

      // 4. Selected Projects (Work) mobile cards reveal
      const workSection = document.getElementById('work')
      if (workSection) {
        const header = workSection.querySelector('[class*="mobileWrapper"] [class*="headerContainer"]')
        const cards = workSection.querySelectorAll('[class*="mobileGallery"] article')
        if (header) {
          gsap.fromTo(
            header,
            { y: 20, opacity: 0.88 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: workSection,
                start: 'top 92%',
                once: true,
              },
            }
          )
        }
        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards,
            { y: 25, opacity: 0.85, scale: 0.98 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: workSection.querySelector('[class*="mobileGallery"]') || workSection,
                start: 'top 88%',
                once: true,
              },
            }
          )
        }
      }

      // 5. TechStack (Skills) section reveal
      const skillsSection = document.getElementById('skills')?.closest('section') || document.querySelector('section[aria-label*="Skills"]')
      if (skillsSection) {
        const header = skillsSection.querySelector('[class*="header"]')
        const rows = skillsSection.querySelectorAll('[data-row]')
        if (header) {
          gsap.fromTo(
            header,
            { y: 20, opacity: 0.88 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: skillsSection,
                start: 'top 92%',
                once: true,
              },
            }
          )
        }
        if (rows && rows.length > 0) {
          gsap.fromTo(
            rows,
            { y: 20, opacity: 0.88 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.06,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: skillsSection,
                start: 'top 88%',
                once: true,
              },
            }
          )
        }
      }

      // 6. Contact section reveal
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        const infoCol = contactSection.querySelector('[class*="infoCol"]')
        const formCol = contactSection.querySelector('[class*="formCol"]')
        if (infoCol) {
          gsap.fromTo(
            infoCol,
            { y: 20, opacity: 0.88 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: contactSection,
                start: 'top 92%',
                once: true,
              },
            }
          )
        }
        if (formCol) {
          gsap.fromTo(
            formCol,
            { y: 20, opacity: 0.88 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: contactSection,
                start: 'top 88%',
                once: true,
              },
            }
          )
        }
      }
    })

    return () => {
      ctx.revert()
    }
  }, [])
}
