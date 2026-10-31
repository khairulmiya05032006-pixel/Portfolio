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
  const [isLoaded, setIsLoaded] = useState(false)
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
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Interaction tracking vectors
    const targetMouse = new THREE.Vector3(-9999, -9999, 0)
    const currentMouse = new THREE.Vector3(-9999, -9999, 0)
    let targetForce = 0.0
    let currentForce = 0.0
    let isInteracting = false
    let isVisible = true
    const clock = new THREE.Clock()

    // -------------------------------------------------------------------------
    // 2. Custom Shader Material for 3D Particle Explosion & Reassembly
    // -------------------------------------------------------------------------
    const vertexShader = `
      uniform vec3 uMouse;
      uniform float uMouseRadius;
      uniform float uExplosionForce;
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

        // Subtle organic idle wave motion
        float wave = sin(uTime * 1.6 + aOrigin.y * 2.5 + aOrigin.x * 2.0) * 0.015;
        pos.z += wave;

        // Vector to mouse position
        vec2 toMouse = pos.xy - uMouse.xy;
        float dist = length(toMouse);

        // Explosion calculation
        if (dist < uMouseRadius && uExplosionForce > 0.001) {
          float influence = (1.0 - smoothstep(0.0, uMouseRadius, dist)) * uExplosionForce;
          
          // Radial repulsion with organic directional scatter
          vec2 repulseDir = normalize(toMouse + aDirection.xy * 0.4);
          float scatterDist = influence * (0.8 + aRandomFactor * 0.9);
          
          pos.xy += repulseDir * scatterDist;
          // Disperse outward in 3D depth (Z)
          pos.z += (aDirection.z * 1.8 + 0.6) * scatterDist;
        }

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Perspective-attenuated point size
        float pSize = aSize * (1.0 + wave * 1.5);
        gl_PointSize = pSize * (320.0 / -mvPosition.z) * (uPixelRatio / 2.0);
        gl_PointSize = clamp(gl_PointSize, 1.0, 14.0);

        vAlpha = smoothstep(0.04, 0.22, length(aColor));
      }
    `

    const fragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // Draw soft circular particle disc
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
        uMouse: { value: currentMouse },
        uMouseRadius: { value: 0.95 },
        uExplosionForce: { value: 0.0 },
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
          const dirX = (Math.random() - 0.5) * 1.2 + (posX / worldW) * 0.8
          const dirY = (Math.random() - 0.5) * 1.2 + (posY / worldH) * 0.8
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

      setIsLoaded(true)
    }

    // -------------------------------------------------------------------------
    // 4. Pointer & Touch Interactions
    // -------------------------------------------------------------------------
    const updatePointerPos = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect()
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1)

      // Unproject pointer to Z=0 plane in 3D world space
      const vector = new THREE.Vector3(normX, normY, 0.5)
      vector.unproject(camera)
      const dir = vector.sub(camera.position).normalize()
      const distance = -camera.position.z / dir.z
      const worldPos = camera.position.clone().add(dir.multiplyScalar(distance))

      targetMouse.copy(worldPos)
      targetForce = 1.0
      isInteracting = true
    }

    const handlePointerMove = (e: PointerEvent) => {
      updatePointerPos(e.clientX, e.clientY)
    }

    const handlePointerDown = (e: PointerEvent) => {
      updatePointerPos(e.clientX, e.clientY)
    }

    const handlePointerUp = () => {
      targetForce = 0.0
      isInteracting = false
    }

    const handlePointerLeave = () => {
      targetForce = 0.0
      isInteracting = false
    }

    const domElement = renderer.domElement
    domElement.addEventListener('pointermove', handlePointerMove)
    domElement.addEventListener('pointerdown', handlePointerDown)
    domElement.addEventListener('pointerup', handlePointerUp)
    domElement.addEventListener('pointerleave', handlePointerLeave)
    domElement.addEventListener('pointercancel', handlePointerUp)

    // -------------------------------------------------------------------------
    // 5. Visibility & Resize Observers
    // -------------------------------------------------------------------------
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
      },
      { threshold: 0.1 }
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
    // 6. Smooth Render Loop (60-120 FPS, GPU-Accelerated)
    // -------------------------------------------------------------------------
    const tick = () => {
      if (isDisposed) return

      if (isVisible) {
        const elapsedTime = clock.getElapsedTime()
        material.uniforms.uTime.value = elapsedTime

        // Smoothly interpolate mouse and explosion force
        if (isInteracting) {
          currentMouse.lerp(targetMouse, 0.15)
          currentForce += (targetForce - currentForce) * 0.12
        } else {
          currentForce += (0.0 - currentForce) * 0.06
        }

        material.uniforms.uMouse.value.copy(currentMouse)
        material.uniforms.uExplosionForce.value = currentForce

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

      visibilityObserver.disconnect()
      resizeObserver.disconnect()

      domElement.removeEventListener('pointermove', handlePointerMove)
      domElement.removeEventListener('pointerdown', handlePointerDown)
      domElement.removeEventListener('pointerup', handlePointerUp)
      domElement.removeEventListener('pointerleave', handlePointerLeave)
      domElement.removeEventListener('pointercancel', handlePointerUp)

      if (pointsObject) scene.remove(pointsObject)
      if (geometry) geometry.dispose()
      material.dispose()
      renderer.dispose()

      if (domElement && domElement.parentNode) {
        domElement.parentNode.removeChild(domElement)
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
      aria-label="Interactive 3D particle portrait"
    >
      <div ref={mountRef} className={styles.canvasMount} />
      
      {/* Subtle vignette mask to dissolve edges seamlessly into background */}
      <div className={styles.vignetteOverlay} aria-hidden="true" />

      {/* Loading state indicator */}
      {!isLoaded && (
        <div className={styles.loadingPulse} aria-hidden="true" />
      )}
    </div>
  )
}
