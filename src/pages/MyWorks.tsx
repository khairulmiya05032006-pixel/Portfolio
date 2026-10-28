'use client'

import { Work } from '@/sections/Work'
import { Navbar } from '@/components/Navbar'
import { CustomCursor } from '@/components/CustomCursor'

export default function MyWorks() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background, #0a0a0f)', paddingTop: '6rem' }}>
      <CustomCursor />
      <Navbar />
      <main>
        <Work />
      </main>
    </div>
  )
}
