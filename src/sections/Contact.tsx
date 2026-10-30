'use client'

import { useState } from 'react'
import { portfolioConfig } from '@/config/portfolio'
import { SocialIcon } from '@/components/SocialIcon'
import styles from './Contact.module.scss'

export function Contact() {
  const { profile, socials } = portfolioConfig
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Failed to submit message.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <section id="contact" className={styles.contact} aria-label="Contact Section">
      <div className={styles.container}>
        <div className={styles.infoCol}>
          <span className={styles.eyebrow}>Get In Touch</span>
          <h2 className={styles.title}>
            Contact & <span>Connect</span>
          </h2>
          <p className={styles.subtitle}>
            Have an open role, project idea, or just want to say hi? Send me a message below.
          </p>

          <div className={styles.metaList}>
            <div className={styles.metaCard}>
              <span className={styles.metaLabel}>Email</span>
              <a href="mailto:contact@khairul.dev" className={styles.metaValue}>
                contact@khairul.dev
              </a>
            </div>
            <div className={styles.metaCard}>
              <span className={styles.metaLabel}>Status</span>
              <span className={styles.metaValue}>{profile.availability}</span>
            </div>
          </div>

          <div className={styles.socialsGroup}>
            <span className={styles.socialsHeading}>Social Profiles</span>
            <div className={styles.socialLinks}>
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialPill}
                >
                  <SocialIcon platform={s.platform} size={14} />
                  <span>{s.platform}</span> <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.formCol}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.formTitle}>Send a Message</h3>

            {status === 'success' && (
              <div className={styles.alertSuccess} role="alert">
                ✓ Message delivered successfully. I will get back to you promptly!
              </div>
            )}

            {status === 'error' && (
              <div className={styles.alertError} role="alert">
                ✕ {errorMessage}
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                type="text"
                required
                placeholder="e.g. Alex Chen"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Your Email</label>
              <input
                id="email"
                type="email"
                required
                placeholder="alex@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                required
                placeholder="Describe your inquiry or project scope..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className={styles.submitBtn}
            >
              {status === 'submitting' ? 'Transmitting...' : 'Send Message →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
