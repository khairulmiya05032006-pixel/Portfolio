'use client'

import React from 'react'
import styles from './HorizontalProjectCard.module.scss'

interface ProjectPreviewMockupProps {
  projectId: string
  title: string
}

export function ProjectPreviewMockup({ projectId, title }: ProjectPreviewMockupProps) {
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
          <div className={styles.addressBar}>amana-capital.internal/loans/dashboard</div>
          <div className={styles.statusLive}>
            <span className={styles.pulse} /> LIVE
          </div>
        </div>

        {/* Dashboard Preview Body */}
        <div className={styles.browserBody}>
          <div className={styles.dashSidebar}>
            <div className={styles.sidebarBrand}>Amana</div>
            <div className={styles.sidebarLinkActive}>Loans</div>
            <div className={styles.sidebarLink}>Customers</div>
            <div className={styles.sidebarLink}>Disbursements</div>
            <div className={styles.sidebarLink}>Reports</div>
          </div>

          <div className={styles.dashMain}>
            <div className={styles.metricGrid}>
              <div className={styles.metricBox}>
                <span className={styles.mLabel}>Active Loans</span>
                <span className={styles.mValue}>1,420</span>
                <span className={styles.mTrend}>+12.4% this mo</span>
              </div>
              <div className={styles.metricBox}>
                <span className={styles.mLabel}>Disbursed Total</span>
                <span className={styles.mValue}>₹48.6L</span>
                <span className={styles.mTrend}>99.2% repayment</span>
              </div>
              <div className={styles.metricBox}>
                <span className={styles.mLabel}>System Health</span>
                <span className={styles.mValue}>99.98%</span>
                <span className={styles.mTrend}>JWT Auth Valid</span>
              </div>
            </div>

            {/* Architecture loan lifecycle pipeline */}
            <div className={styles.pipeline}>
              <div className={styles.pipeStep}>
                <span className={styles.stepNum}>01</span>
                <span>Customer Records</span>
              </div>
              <span className={styles.pipeArrow}>→</span>
              <div className={styles.pipeStep}>
                <span className={styles.stepNum}>02</span>
                <span>Loan Application</span>
              </div>
              <span className={styles.pipeArrow}>→</span>
              <div className={styles.pipeStep}>
                <span className={styles.stepNum}>03</span>
                <span>EMI Payment</span>
              </div>
              <span className={styles.pipeArrow}>→</span>
              <div className={styles.pipeStep}>
                <span className={styles.stepNum}>04</span>
                <span>Audit Reports</span>
              </div>
            </div>
          </div>
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
