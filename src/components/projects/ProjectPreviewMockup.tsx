'use client'

import React from 'react'
import Image from 'next/image'
import styles from './HorizontalProjectCard.module.scss'

interface ProjectPreviewMockupProps {
  projectId: string
  title: string
  image?: string
}

export function ProjectPreviewMockup({ projectId, title, image }: ProjectPreviewMockupProps) {
  if (projectId === 'amana-capital') {
    return (
      <div className={styles.mockupContainer} aria-label={`${title} interface preview`}>
        {/* Browser window header */}
        <div className={styles.browserHeader}>
          <div className={styles.trafficLights}>
            <span className={styles.dotRed} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen} />
          </div>
          <div className={styles.addressBar}>amana-capital.official/loans</div>
          <div className={styles.statusLive}>
            <span className={styles.pulse} /> LIVE
          </div>
        </div>

        {/* Real Screenshot Preview Body */}
        <div className={styles.browserImageBody}>
          <Image
            src={image || '/images/projects/amana-capital.webp'}
            alt="Amanah Capital Financial Solutions Platform"
            fill
            sizes="(max-width: 960px) 100vw, 50vw"
            className={styles.mockupImage}
            priority
          />
        </div>
      </div>
    )
  }

  if (projectId === 'spotify-clone') {
    return (
      <div className={styles.mockupContainer} aria-label={`${title} interface preview`}>
        {/* Browser window header */}
        <div className={styles.browserHeader}>
          <div className={styles.trafficLights}>
            <span className={styles.dotRed} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen} />
          </div>
          <div className={styles.addressBar}>spotify-clone.khairul.dev/web-player</div>
          <div className={styles.statusLive}>
            <span className={styles.pulse} /> LIVE
          </div>
        </div>

        {/* Real Spotify Banner Preview Body */}
        <div className={styles.browserImageBody}>
          <Image
            src={image || '/images/projects/spotify-clone.webp'}
            alt="Spotify Web Player Clone"
            fill
            sizes="(max-width: 960px) 100vw, 50vw"
            className={styles.mockupImage}
            priority
          />
        </div>
      </div>
    )
  }

  if (projectId === 'javascript-mini-projects') {
    return (
      <div className={styles.mockupContainer} aria-label={`${title} interface preview`}>
        <div className={styles.browserHeader}>
          <div className={styles.trafficLights}>
            <span className={styles.dotRed} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen} />
          </div>
          <div className={styles.addressBar}>interactive-tools.dev/suite</div>
          <div className={styles.statusLive}>
            <span className={styles.pulse} /> 4 TOOLS
          </div>
        </div>

        <div className={styles.browserBody}>
          <div className={styles.toolsGrid}>
            <div className={styles.toolCard}>
              <div className={styles.toolIcon}>⏱</div>
              <div className={styles.toolName}>Digital Clock HUD</div>
              <div className={styles.toolPreview}>
                <span className={styles.clockDigits}>16 : 42 : 08</span>
                <span className={styles.clockSub}>IST · UTC+5:30</span>
              </div>
            </div>

            <div className={styles.toolCard}>
              <div className={styles.toolIcon}>🎨</div>
              <div className={styles.toolName}>Palette Generator</div>
              <div className={styles.toolPalette}>
                <span style={{ background: '#7c3aed' }} />
                <span style={{ background: '#a855f7' }} />
                <span style={{ background: '#c084fc' }} />
                <span style={{ background: '#f43f5e' }} />
              </div>
            </div>

            <div className={styles.toolCard}>
              <div className={styles.toolIcon}>📊</div>
              <div className={styles.toolName}>Tax Calculation Pipeline</div>
              <div className={styles.taxBar}>
                <div className={styles.taxFill} style={{ width: '68%' }} />
              </div>
            </div>

            <div className={styles.toolCard}>
              <div className={styles.toolIcon}>💬</div>
              <div className={styles.toolName}>Quote API Engine</div>
              <div className={styles.quoteSnippet}>“Simplicity is prerequisite for reliability.”</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Visual Studies
  return (
    <div className={styles.mockupContainer} aria-label={`${title} interface preview`}>
      <div className={styles.browserHeader}>
        <div className={styles.trafficLights}>
          <span className={styles.dotRed} />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen} />
        </div>
        <div className={styles.addressBar}>design-systems.lab/composition</div>
        <div className={styles.statusLive}>
          <span className={styles.pulse} /> SCSS GRID
        </div>
      </div>

      <div className={styles.browserBody}>
        <div className={styles.designLab}>
          <div className={styles.designHeader}>
            <span className={styles.tokenPill}>Design Tokens: 42</span>
            <span className={styles.tokenPill}>Fluid Clamp: Active</span>
            <span className={styles.tokenPill}>Grid: 12-Col</span>
          </div>

          <div className={styles.musicPlayerPreview}>
            <div className={styles.albumArt}>
              <div className={styles.vinylGroove} />
            </div>
            <div className={styles.playerDetails}>
              <div className={styles.trackTitle}>Apna Studio · Acoustic Session</div>
              <div className={styles.trackArtist}>Responsive Soundstage UI</div>
              <div className={styles.scrubber}>
                <div className={styles.scrubberFill} style={{ width: '45%' }} />
              </div>
              <div className={styles.playerMeta}>
                <span>02:18</span>
                <span>04:45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
