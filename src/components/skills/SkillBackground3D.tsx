'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface SkillBackground3DProps {
  className?: string
}

export function SkillBackground3D({ className = '' }: SkillBackground3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // Detect touch device
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0

    let width = container.clientWidth || window.innerWidth
    let height = container.clientHeight || window.innerHeight

    // -------------------------------------------------------------------------
    // 1. SCENE, CAMERA, RENDERER
    // -------------------------------------------------------------------------
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
    } catch {
      // Graceful fallback if WebGL is unavailable
      return
    }

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 6.5, 17)
    camera.lookAt(0, -0.5, 0)

    // -------------------------------------------------------------------------
    // 2. LUMINOUS WIREFRAME TERRAIN (GPU SHADER)
    // -------------------------------------------------------------------------
    const planeWidth = 54
    const planeHeight = 38
    const segmentsX = 64
    const segmentsY = 46

    const terrainGeometry = new THREE.PlaneGeometry(
      planeWidth,
      planeHeight,
      segmentsX,
      segmentsY
    )

    const terrainUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorBase: { value: new THREE.Color('#32104F') },
      uColorMid: { value: new THREE.Color('#6E35A8') },
      uColorPeak: { value: new THREE.Color('#A67AE8') },
      uColorGlow: { value: new THREE.Color('#C9A5FF') },
      uOpacity: { value: 0.42 },
    }

    const terrainMaterial = new THREE.ShaderMaterial({
      wireframe: true,
      transparent: true,
      depthWrite: false,
      uniforms: terrainUniforms,
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Multi-frequency harmonic wave displacement
          float wave1 = sin(pos.x * 0.22 + uTime * 0.65) * cos(pos.y * 0.18 + uTime * 0.45) * 1.7;
          float wave2 = sin((pos.x + pos.y) * 0.32 - uTime * 0.75) * 0.85;
          float ripple = cos(pos.x * 0.55 - pos.y * 0.48 + uTime * 1.05) * 0.38;

          // Interactive subtle pointer wave
          float dist = length(pos.xy * 0.05 - uMouse);
          float pointerShift = sin(dist * 2.2 - uTime * 1.2) * 0.35 * exp(-dist * 0.7);

          pos.z += wave1 + wave2 + ripple + pointerShift;
          vElevation = pos.z;

          vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          gl_Position = projectionMatrix * viewPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorBase;
        uniform vec3 uColorMid;
        uniform vec3 uColorPeak;
        uniform vec3 uColorGlow;
        uniform float uOpacity;

        varying vec2 vUv;
        varying float vElevation;

        void main() {
          // Normalized elevation interpolation
          float norm = smoothstep(-2.2, 2.5, vElevation);
          vec3 color = mix(uColorBase, uColorMid, smoothstep(0.0, 0.45, norm));
          color = mix(color, uColorPeak, smoothstep(0.45, 0.85, norm));
          color = mix(color, uColorGlow, pow(norm, 3.2));

          // Soft horizontal & vertical edge fade
          float fadeX = smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.86, vUv.x);
          float fadeY = smoothstep(0.0, 0.16, vUv.y) * smoothstep(1.0, 0.78, vUv.y);
          float edgeFade = fadeX * fadeY;

          float alpha = uOpacity * edgeFade * (0.35 + 0.65 * norm);

          gl_FragColor = vec4(color, alpha);
        }
      `,
    })

    const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial)
    terrainMesh.rotation.x = -Math.PI * 0.38 // Angled toward viewer
    terrainMesh.position.set(0, -3.2, 0)
    scene.add(terrainMesh)

    // -------------------------------------------------------------------------
    // 3. SPARSE AMBIENT DEPTH PARTICLES
    // -------------------------------------------------------------------------
    const particleCount = 68
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSpeeds = new Float32Array(particleCount)
    const particleBaseY = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3
      particlePositions[idx] = (Math.random() - 0.5) * 36
      const py = (Math.random() - 0.5) * 16
      particlePositions[idx + 1] = py
      particleBaseY[i] = py
      particlePositions[idx + 2] = (Math.random() - 0.5) * 22
      particleSpeeds[i] = 0.2 + Math.random() * 0.4
    }

    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    )

    // Create a circular particle texture
    const particleCanvas = document.createElement('canvas')
    particleCanvas.width = 32
    particleCanvas.height = 32
    const pctx = particleCanvas.getContext('2d')
    if (pctx) {
      const pgrad = pctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      pgrad.addColorStop(0, 'rgba(201, 165, 255, 0.9)')
      pgrad.addColorStop(0.35, 'rgba(166, 122, 232, 0.5)')
      pgrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
      pctx.fillStyle = pgrad
      pctx.fillRect(0, 0, 32, 32)
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas)

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.65,
      map: particleTexture,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // -------------------------------------------------------------------------
    // 4. MOUSE PARALLAX TRACKING
    // -------------------------------------------------------------------------
    let targetMouseX = 0
    let targetMouseY = 0
    let currentMouseX = 0
    let currentMouseY = 0

    const handlePointerMove = (e: MouseEvent) => {
      if (isTouchDevice) return
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetMouseX = Math.max(-1, Math.min(1, x))
      targetMouseY = Math.max(-1, Math.min(1, y))
    }

    if (!isTouchDevice) {
      window.addEventListener('mousemove', handlePointerMove, { passive: true })
    }

    // -------------------------------------------------------------------------
    // 5. INTERSECTION OBSERVER & ANIMATION LOOP (GPU SLEEP)
    // -------------------------------------------------------------------------
    let isVisible = true
    let animationFrameId: number | null = null
    const clock = new THREE.Clock()

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        isVisible = entry.isIntersecting

        if (isVisible && animationFrameId === null) {
          clock.start()
          tick()
        } else if (!isVisible && animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
          clock.stop()
        }
      },
      { threshold: 0.05 }
    )

    observer.observe(container)

    const tick = () => {
      if (!isVisible) return

      const delta = clock.getDelta()
      const elapsedTime = clock.getElapsedTime()

      // Wave time advancement (paused if reduced-motion)
      if (!prefersReducedMotion) {
        terrainUniforms.uTime.value = elapsedTime
      }

      // Smooth mouse lerping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05
      currentMouseY += (targetMouseY - currentMouseY) * 0.05

      terrainUniforms.uMouse.value.set(
        currentMouseX * 0.7,
        currentMouseY * 0.7
      )

      // Camera parallax
      camera.position.x = currentMouseX * 0.9
      camera.position.y = 6.5 + currentMouseY * 0.5
      camera.lookAt(0, -0.5, 0)

      // Ambient particles slow drift
      if (!prefersReducedMotion) {
        const positions = particlesGeometry.attributes.position
          .array as Float32Array
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3
          positions[idx + 1] =
            particleBaseY[i] + Math.sin(elapsedTime * particleSpeeds[i] + i) * 1.5
          positions[idx] += Math.cos(elapsedTime * 0.2 + i) * 0.005
        }
        particlesGeometry.attributes.position.needsUpdate = true
      }

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(tick)
    }

    // Start initial loop
    tick()

    // -------------------------------------------------------------------------
    // 6. RESIZE OBSERVER
    // -------------------------------------------------------------------------
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth || window.innerWidth
      height = container.clientHeight || window.innerHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    }

    window.addEventListener('resize', handleResize)

    // -------------------------------------------------------------------------
    // 7. CLEANUP
    // -------------------------------------------------------------------------
    return () => {
      observer.disconnect()
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener('resize', handleResize)
      if (!isTouchDevice) {
        window.removeEventListener('mousemove', handlePointerMove)
      }

      terrainGeometry.dispose()
      terrainMaterial.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      particleTexture.dispose()

      renderer.dispose()
      renderer.forceContextLoss()

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    />
  )
}
