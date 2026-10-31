'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import styles from './ParticlePortrait.module.scss'

interface ParticlePortraitProps {
  imageSrc?: string
  className?: string
}

export function ParticlePortrait({
  imageSrc = '/mobile_fit_image/KM.jpeg',
  className = '',
}: ParticlePortraitProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [hasWebGl, setHasWebGl] = useState(true)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let isDisposed = false
    let animationFrameId: number | null = null

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas')
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
      if (!gl) {
        setHasWebGl(false)
        return
      }
    } catch {
      setHasWebGl(false)
      return
    }

    // -------------------------------------------------------------------------
    // 1. Scene, Camera, Renderer Setup
    // -------------------------------------------------------------------------
    const width = mount.clientWidth || 320
    const height = mount.clientHeight || 400

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100)
    camera.position.set(0, 0, 3.8)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0) // 100% transparent background
    mount.appendChild(renderer.domElement)

    // Scroll tracking physics
    let targetProgress = 0.0
    let currentProgress = 0.0
    let targetVelocity = 0.0
    let currentVelocity = 0.0
    let lastScrollY = window.scrollY
    let lastScrollTime = performance.now()
    let isVisible = true
    const clock = new THREE.Clock()

    // -------------------------------------------------------------------------
    // 2. Custom Shader Material for Scroll-Driven 3D Particle Dispersion
    // -------------------------------------------------------------------------
    const vertexShader = `
      uniform float uScrollProgress;
      uniform float uScrollVelocity;
      uniform float uTime;
      uniform float uPixelRatio;

      attribute vec3 aOrigin;
      attribute vec3 aDirection;
      attribute float aRandomFactor;
      attribute vec3 aColor;
      attribute float aSize;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = aColor;

        vec3 pos = aOrigin;

        // Subtle organic breathing idle wave
        float wave = sin(uTime * 1.5 + aOrigin.y * 2.5 + aOrigin.x * 2.0) * 0.012;
        pos.z += wave;

        // Combined dispersion force driven by scroll progress + velocity
        float spread = uScrollProgress * 1.35 + uScrollVelocity * 0.35;

        if (spread > 0.001) {
          // Outward 3D explosion along directional vectors
          float scatterDist = spread * (0.85 + aRandomFactor * 1.1);

          // Disperse radially outward in XY
          pos.xy += aDirection.xy * scatterDist * 1.45;

          // Explode outward in 3D Z-depth
          pos.z += (aDirection.z * 1.9 + 0.45) * scatterDist * 1.25;
        }

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Perspective point size
        float pSize = aSize * (1.0 + wave * 1.5);
        gl_PointSize = pSize * (320.0 / -mvPosition.z) * (uPixelRatio / 2.0);
        gl_PointSize = clamp(gl_PointSize, 1.0, 14.0);

        // Soft fade out as particles disperse far
        float disperseFade = 1.0 - smoothstep(0.75, 1.8, spread) * 0.55;
        vAlpha = smoothstep(0.04, 0.22, length(aColor)) * disperseFade;
      }
    `

    const fragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // Soft circular particle disc
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float edge = smoothstep(0.5, 0.35, dist);
        gl_FragColor = vec4(vColor, vAlpha * edge * 0.95);
      }
    `

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uScrollProgress: { value: 0.0 },
        uScrollVelocity: { value: 0.0 },
        uTime: { value: 0.0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    let pointsObject: THREE.Points | null = null
    let geometry: THREE.BufferGeometry | null = null

    // -------------------------------------------------------------------------
    // 3. Load Image & Sample Points Cloud with Orange Rim Highlight
    // -------------------------------------------------------------------------
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageSrc

    img.onload = () => {
      if (isDisposed) return

      const sampleW = 125
      const aspect = img.naturalWidth / img.naturalHeight
      const sampleH = Math.round(sampleW / aspect)

      const offscreen = document.createElement('canvas')
      offscreen.width = sampleW
      offscreen.height = sampleH
      const ctx = offscreen.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0, sampleW, sampleH)
      const imgData = ctx.getImageData(0, 0, sampleW, sampleH).data

      const positions: number[] = []
      const directions: number[] = []
      const randomFactors: number[] = []
      const colors: number[] = []
      const sizes: number[] = []

      const worldW = 2.4
      const worldH = worldW / aspect

      // Rich warm orange rim light RGB values
      const rimR = 1.0
      const rimG = 0.52
      const rimB = 0.1

      for (let y = 0; y < sampleH; y++) {
        for (let x = 0; x < sampleW; x++) {
          const idx = (y * sampleW + x) * 4
          const r = imgData[idx]
          const g = imgData[idx + 1]
          const b = imgData[idx + 2]
          const a = imgData[idx + 3]

          // Compute perceived luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b

          // Filter out dark background so only the subject is rendered
          if (a < 20 || lum < 14) continue

          const u = x / (sampleW - 1)
          const v = 1.0 - y / (sampleH - 1)

          // 3D positioning with subtle facial surface relief
          const posX = (u - 0.5) * worldW
          const posY = (v - 0.5) * worldH
          const posZ = (lum / 255.0) * 0.22 - 0.08

          positions.push(posX, posY, posZ)

          // Contrast enhanced monochrome grayscale
          let mono = lum / 255.0
          mono = Math.pow(mono, 1.1) * 1.04

          // -----------------------------------------------------------------
          // Orange Rim Light Highlight on the right contour
          // -----------------------------------------------------------------
          let colR = mono
          let colG = mono
          let colB = mono

          if (u > 0.52) {
            const uNorm = Math.min(1.0, (u - 0.52) / 0.42)
            const rimFactor = Math.pow(uNorm, 1.35) * Math.min(1.0, mono * 1.25 + 0.25)

            colR = mono * (1.0 - rimFactor) + rimR * (mono * 0.45 + 0.65) * rimFactor
            colG = mono * (1.0 - rimFactor) + rimG * (mono * 0.45 + 0.65) * rimFactor
            colB = mono * (1.0 - rimFactor) + rimB * (mono * 0.45 + 0.65) * rimFactor
          }

          colors.push(
            Math.min(1.0, Math.max(0.0, colR)),
            Math.min(1.0, Math.max(0.0, colG)),
            Math.min(1.0, Math.max(0.0, colB))
          )

          // Unique random 3D explosion dispersion direction
          const dirX = (Math.random() - 0.5) * 1.2 + (posX / worldW) * 0.85
          const dirY = (Math.random() - 0.5) * 1.2 + (posY / worldH) * 0.85
          const dirZ = Math.random() * 1.6 + 0.5
          const len = Math.hypot(dirX, dirY, dirZ) || 1.0

          directions.push(dirX / len, dirY / len, dirZ / len)
          randomFactors.push(0.55 + Math.random() * 0.9)
          sizes.push(2.6 + Math.random() * 1.8)
        }
      }

      geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      geometry.setAttribute('aOrigin', new THREE.Float32BufferAttribute(positions, 3))
      geometry.setAttribute('aDirection', new THREE.Float32BufferAttribute(directions, 3))
      geometry.setAttribute('aRandomFactor', new THREE.Float32BufferAttribute(randomFactors, 1))
      geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colors, 3))
      geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1))

      pointsObject = new THREE.Points(geometry, material)
      scene.add(pointsObject)
    }

    // -------------------------------------------------------------------------
    // 4. Scroll Tracking (Particles spread as user scrolls, not when click)
    // -------------------------------------------------------------------------
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const now = performance.now()
      const dt = Math.max(1, now - lastScrollTime)

      // Calculate instantaneous scroll velocity
      const deltaY = Math.abs(currentScrollY - lastScrollY)
      const velocity = Math.min(1.5, (deltaY / dt) * 12)
      targetVelocity = velocity

      lastScrollY = currentScrollY
      lastScrollTime = now

      // Calculate scroll progress through the hero section (0 at top, spreads as scrolled)
      const windowHeight = window.innerHeight || 800
      const maxScrollDistance = Math.min(windowHeight * 0.55, 380)
      targetProgress = Math.max(0, Math.min(1.8, currentScrollY / maxScrollDistance))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial state check

    // -------------------------------------------------------------------------
    // 5. Visibility & Resize Observers
    // -------------------------------------------------------------------------
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    visibilityObserver.observe(mount)

    const handleResize = () => {
      if (!mount) return
      const w = mount.clientWidth || 320
      const h = mount.clientHeight || 400
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(mount)

    // -------------------------------------------------------------------------
    // 6. Smooth Render Loop (GPU-Accelerated)
    // -------------------------------------------------------------------------
    const tick = () => {
      if (isDisposed) return

      if (isVisible) {
        const elapsedTime = clock.getElapsedTime()
        material.uniforms.uTime.value = elapsedTime

        // Smoothly interpolate scroll progress and velocity
        currentProgress += (targetProgress - currentProgress) * 0.1
        currentVelocity += (targetVelocity - currentVelocity) * 0.08
        targetVelocity *= 0.92 // decay velocity when scroll slows

        material.uniforms.uScrollProgress.value = currentProgress
        material.uniforms.uScrollVelocity.value = currentVelocity

        renderer.render(scene, camera)
      }

      animationFrameId = requestAnimationFrame(tick)
    }

    tick()

    // -------------------------------------------------------------------------
    // Cleanup
    // -------------------------------------------------------------------------
    return () => {
      isDisposed = true
      if (animationFrameId) cancelAnimationFrame(animationFrameId)

      window.removeEventListener('scroll', handleScroll)
      visibilityObserver.disconnect()
      resizeObserver.disconnect()

      if (pointsObject) scene.remove(pointsObject)
      if (geometry) geometry.dispose()
      material.dispose()
      renderer.dispose()

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [imageSrc])

  if (!hasWebGl) {
    return (
      <div className={`${styles.portraitFallback} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt="Khairul Miya"
          className={styles.fallbackImg}
          loading="eager"
        />
      </div>
    )
  }

  return (
    <div
      className={`${styles.portraitContainer} ${className}`}
      aria-label="3D particle portrait (scroll to disperse)"
    >
      <div ref={mountRef} className={styles.canvasMount} />
    </div>
  )
}
