'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { portfolioConfig } from '@/config/portfolio'
import styles from './TechStack.module.scss'

interface TechBall {
  mesh: THREE.Mesh
  velocity: THREE.Vector3
  position: THREE.Vector3
  radius: number
  mass: number
  initialOffset: THREE.Vector3
}

export function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTech, setActiveTech] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || 650

    // -------------------------------------------------------------------------
    // 1. THREE.JS SCENE & CAMERA SETUP
    // -------------------------------------------------------------------------
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 9.5)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambientLight)

    const topKey = new THREE.DirectionalLight(0xe9d5ff, 2.5)
    topKey.position.set(5, 8, 6)
    scene.add(topKey)

    const bottomFill = new THREE.DirectionalLight(0x7c3aed, 1.8)
    bottomFill.position.set(-5, -6, -4)
    scene.add(bottomFill)

    const centerGlow = new THREE.PointLight(0xa78bfa, 2.5, 10)
    centerGlow.position.set(0, 0, 2)
    scene.add(centerGlow)

    // -------------------------------------------------------------------------
    // 2. PROCEDURAL HIGH-DPI TECH TEXTURES
    // -------------------------------------------------------------------------
    const createBadgeTexture = (
      name: string,
      category: string,
      color: string,
      bg: string
    ): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext('2d')

      if (ctx) {
        // Base sphere surface
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, 512, 512)

        // Radial subtle backlight
        const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 250)
        grad.addColorStop(0, color + '55')
        grad.addColorStop(0.7, color + '15')
        grad.addColorStop(1, '#00000000')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, 512, 512)

        // Outer circular accent ring
        ctx.strokeStyle = color
        ctx.lineWidth = 14
        ctx.beginPath()
        ctx.arc(256, 256, 210, 0, Math.PI * 2)
        ctx.stroke()

        // Inner glowing border
        ctx.strokeStyle = '#ffffff25'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.arc(256, 256, 185, 0, Math.PI * 2)
        ctx.stroke()

        // Category Tag
        ctx.fillStyle = color
        ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        ctx.textAlign = 'center'
        ctx.letterSpacing = '3px'
        ctx.fillText(category.toUpperCase(), 256, 175)

        // Tech Name (Main Typography)
        ctx.fillStyle = '#ffffff'
        const fontSize = name.length > 9 ? 42 : 52
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
        ctx.fillText(name, 256, 265)

        // Tech Icon / Symbol dot
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(256, 335, 12, 0, Math.PI * 2)
        ctx.fill()
      }

      const tex = new THREE.CanvasTexture(canvas)
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      return tex
    }

    // -------------------------------------------------------------------------
    // 3. ZERO-GRAVITY 3D SPHERES
    // -------------------------------------------------------------------------
    const techItems = portfolioConfig.techStackItems
    const balls: TechBall[] = []
    const sphereGeometry = new THREE.SphereGeometry(0.55, 32, 32)

    techItems.forEach((item, idx) => {
      const texture = createBadgeTexture(item.name, item.category, item.color, item.bg)
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.35,
        roughness: 0.18,
        emissive: new THREE.Color(item.color),
        emissiveIntensity: 0.12,
      })

      const mesh = new THREE.Mesh(sphereGeometry, material)

      // Initial distributed cloud around center
      const phi = Math.acos(-1 + (2 * idx) / techItems.length)
      const theta = Math.sqrt(techItems.length * Math.PI) * phi
      const dist = 1.8 + (idx % 3) * 0.75

      const x = dist * Math.cos(theta) * Math.sin(phi)
      const y = dist * Math.sin(theta) * Math.sin(phi)
      const z = dist * Math.cos(phi) * 0.6

      mesh.position.set(x, y, z)
      mesh.userData = { name: item.name, category: item.category, color: item.color }
      scene.add(mesh)

      balls.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        position: mesh.position,
        radius: 0.58,
        mass: 1.0,
        initialOffset: new THREE.Vector3(x, y, z),
      })
    })

    // -------------------------------------------------------------------------
    // 4. KINEMATIC 3D CURSOR COLLIDER & RAYCASTING
    // -------------------------------------------------------------------------
    const mousePos = new THREE.Vector3(999, 999, 0)
    const raycaster = new THREE.Raycaster()
    const mouseNorm = new THREE.Vector2(-999, -999)
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseNorm.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseNorm.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouseNorm, camera)
      raycaster.ray.intersectPlane(planeZ, mousePos)

      // Hover detection
      const intersects = raycaster.intersectObjects(scene.children)
      if (intersects.length > 0) {
        const hit = intersects[0].object
        if (hit.userData?.name) {
          setActiveTech(`${hit.userData.name} (${hit.userData.category})`)
        }
      } else {
        setActiveTech(null)
      }
    }

    container.addEventListener('mousemove', onPointerMove)

    // -------------------------------------------------------------------------
    // 5. ZERO-GRAVITY PHYSICS LOOP (CENTRAL ATTRACTOR + SCATTER COLLISION)
    // -------------------------------------------------------------------------
    let frameId: number
    const targetCenter = new THREE.Vector3(0, 0, 0)
    const cursorRepelRadius = 1.75
    const cursorRepelForce = 0.085

    const animatePhysics = () => {
      frameId = requestAnimationFrame(animatePhysics)

      // 1. Central zero-gravity attractor force toward (0, 0, 0)
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i]
        const toCenter = targetCenter.clone().sub(b.position)
        const distToCenter = toCenter.length()

        // Gentle harmonic restoring spring
        if (distToCenter > 0.1) {
          toCenter.normalize()
          b.velocity.add(toCenter.multiplyScalar(0.0016 * distToCenter))
        }

        // Kinematic cursor collision & scattering
        const toCursor = b.position.clone().sub(mousePos)
        // Only interact in z-corridor
        toCursor.z *= 0.5
        const distCursor = toCursor.length()
        if (distCursor < cursorRepelRadius && distCursor > 0.01) {
          toCursor.normalize()
          const force = (1 - distCursor / cursorRepelRadius) * cursorRepelForce
          b.velocity.add(toCursor.multiplyScalar(force))
        }

        // Slow natural rotation of sphere to showcase glossy logos
        b.mesh.rotation.y += 0.004 + (i % 3) * 0.002
        b.mesh.rotation.x += 0.002
      }

      // 2. Ball-to-ball elastic collision & separation
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const b1 = balls[i]
          const b2 = balls[j]
          const diff = b2.position.clone().sub(b1.position)
          const dist = diff.length()
          const minDist = b1.radius + b2.radius

          if (dist < minDist && dist > 0.001) {
            const normal = diff.normalize()
            const overlap = (minDist - dist) * 0.5

            // Position relaxation
            b1.position.sub(normal.clone().multiplyScalar(overlap))
            b2.position.add(normal.clone().multiplyScalar(overlap))

            // Impulse exchange
            const relativeVelocity = b2.velocity.clone().sub(b1.velocity)
            const velAlongNormal = relativeVelocity.dot(normal)
            if (velAlongNormal < 0) {
              const restitution = 0.75
              const impulse = (-(1 + restitution) * velAlongNormal) / 2
              const impulseVector = normal.clone().multiplyScalar(impulse)
              b1.velocity.sub(impulseVector)
              b2.velocity.add(impulseVector)
            }
          }
        }
      }

      // 3. Integrate position & apply air damping
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i]
        b.position.add(b.velocity)
        b.velocity.multiplyScalar(0.975) // Zero-gravity fluid damping
        b.mesh.position.copy(b.position)
      }

      renderer.render(scene, camera)
    }

    animatePhysics()

    // -------------------------------------------------------------------------
    // 6. RESIZE HANDLER & DISPOSAL
    // -------------------------------------------------------------------------
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      container.removeEventListener('mousemove', onPointerMove)
      cancelAnimationFrame(frameId)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <section id="tech-stack" className={styles.section} aria-label="Interactive Tech Stack">
      <div className={styles.header}>
        <span className={styles.eyebrow}>05 / Core Capabilities</span>
        <h2 className={styles.title}>
          Zero-Gravity <span>Tech Stack</span>
        </h2>
        <p className={styles.subtitle}>
          Interactive 3D physics cluster. Hover to scatter and explore the frameworks, languages,
          and systems I engineer with daily.
        </p>
        {activeTech && (
          <div className={styles.activeBadge} aria-live="polite">
            Active: <span>{activeTech}</span>
          </div>
        )}
      </div>

      <div ref={containerRef} className={styles.canvasContainer} />
    </section>
  )
}
