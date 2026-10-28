'use client'

import { TechStack } from '@/sections/TechStack'
import { Navbar } from '@/components/Navbar'
import { CustomCursor } from '@/components/CustomCursor'

export default function Play() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background, #0a0a0f)', paddingTop: '6rem' }}>
      <CustomCursor />
      <Navbar />
      <main>
        <TechStack />
      </main>
    </div>
  )
}
