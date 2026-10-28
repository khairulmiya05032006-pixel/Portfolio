'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createProceduralAvatarRig } from '@/utils/avatarRigGenerator'

gsap.registerPlugin(ScrollTrigger)

export function CharacterScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isSleepingRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // -------------------------------------------------------------------------
    // 1. THREE.JS SCENE SETUP
    // -------------------------------------------------------------------------
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.12)

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      50
    )
    camera.position.set(1.8, 1.3, 2.8)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x181829, 2.2)
    scene.add(ambientLight)

    const mainKeyLight = new THREE.DirectionalLight(0xdcd6f7, 2.5)
    mainKeyLight.position.set(4, 5, 4)
    mainKeyLight.castShadow = true
    scene.add(mainKeyLight)

    const rimLight = new THREE.DirectionalLight(0xa78bfa, 3.0)
    rimLight.position.set(-4, 3, -3)
    scene.add(rimLight)

    const floorGlow = new THREE.PointLight(0x581c87, 1.2, 6)
    floorGlow.position.set(0, 0.1, 0.5)
    scene.add(floorGlow)

    // Subtle Grid Floor
    const grid = new THREE.GridHelper(20, 40, 0x3b0764, 0x18182b)
    grid.position.y = 0
    if (grid.material instanceof THREE.Material) {
      grid.material.opacity = 0.35
      grid.material.transparent = true
    }
    scene.add(grid)

    // -------------------------------------------------------------------------
    // 2. MODEL GENERATION / LOADING (GLB + FALLBACK)
    // -------------------------------------------------------------------------
    let avatarModel: THREE.Group | null = null
    let mixer: THREE.AnimationMixer | null = null
    let headBone: THREE.Object3D | null = null
    let spineBone: THREE.Object3D | null = null
    let screenLight: THREE.PointLight | null = null

    // Setup function for common rig hooks
    const setupRigHooks = (
      model: THREE.Group,
      animMixer: THREE.AnimationMixer,
      hBone?: THREE.Object3D,
      sBone?: THREE.Object3D,
      sLight?: THREE.PointLight
    ) => {
      avatarModel = model
      mixer = animMixer
      headBone = hBone || model.getObjectByName('Head') || null
      spineBone = sBone || model.getObjectByName('Spine2') || model.getObjectByName('Spine') || null
      screenLight = sLight || (model.getObjectByName('ScreenLight') as THREE.PointLight) || null
      scene.add(model)
    }

    // Try loading /models/character.glb first
    const gltfLoader = new GLTFLoader()
    gltfLoader.load(
      '/models/character.glb',
      (gltf) => {
        const model = gltf.scene
        model.name = 'LoadedCharacter'
        const animMixer = new THREE.AnimationMixer(model)
        if (gltf.animations && gltf.animations.length > 0) {
          gltf.animations.forEach((clip) => {
            animMixer.clipAction(clip).play()
          })
        }
        const sLight = new THREE.PointLight(0xa78bfa, 2.0, 2.5)
        sLight.position.set(0, 1.15, 0.78)
        model.add(sLight)

        setupRigHooks(model, animMixer, undefined, undefined, sLight)
      },
      undefined,
      () => {
        // Fallback to procedural rig seamlessly
        const procedural = createProceduralAvatarRig()
        setupRigHooks(
          procedural.scene,
          procedural.mixer,
          procedural.bones.head,
          procedural.bones.spine2,
          procedural.screenLight
        )
      }
    )

    // -------------------------------------------------------------------------
    // 3. PROXY TARGET STATE FOR SCROLL CHOREOGRAPHY
    // -------------------------------------------------------------------------
    const proxy = {
      camX: 1.8,
      camY: 1.3,
      camZ: 2.8,
      lookX: 0,
      lookY: 0.9,
      lookZ: 0.2,
      avatarPosX: 0.35,
      avatarPosY: 0,
      avatarPosZ: 0,
      avatarRotY: -0.35,
      screenLightIntensity: 1.8,
    }

    const currentLookAt = new THREE.Vector3(0, 0.9, 0.2)

    // GSAP ScrollTrigger timeline modulating proxy target state
    const setupScrollTriggers = () => {
      // 1. Landing -> About (Camera swoops around to Left 3/4 perspective, avatar turns towards viewer)
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top bottom',
        end: 'center center',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress
          proxy.camX = THREE.MathUtils.lerp(1.8, -1.9, p)
          proxy.camY = THREE.MathUtils.lerp(1.3, 1.45, p)
          proxy.camZ = THREE.MathUtils.lerp(2.8, 2.4, p)
          proxy.lookX = THREE.MathUtils.lerp(0, -0.2, p)
          proxy.avatarPosX = THREE.MathUtils.lerp(0.35, -0.4, p)
          proxy.avatarRotY = THREE.MathUtils.lerp(-0.35, 0.45, p)
        },
      })

      // 2. About -> What I Do (Zoom in on monitor & code workspace, camera centers desk)
      ScrollTrigger.create({
        trigger: '#what-i-do',
        start: 'top bottom',
        end: 'center center',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress
          proxy.camX = THREE.MathUtils.lerp(-1.9, 0.1, p)
          proxy.camY = THREE.MathUtils.lerp(1.45, 1.2, p)
          proxy.camZ = THREE.MathUtils.lerp(2.4, 1.9, p)
          proxy.lookX = THREE.MathUtils.lerp(-0.2, 0, p)
          proxy.lookY = THREE.MathUtils.lerp(0.9, 1.05, p)
          proxy.avatarPosX = THREE.MathUtils.lerp(-0.4, 0.05, p)
          proxy.avatarRotY = THREE.MathUtils.lerp(0.45, -0.05, p)
          proxy.screenLightIntensity = THREE.MathUtils.lerp(1.8, 2.8, p)
        },
      })

      // 3. GPU Sleep trigger past #what-i-do to save 100% compute cycles
      ScrollTrigger.create({
        trigger: '#career',
        start: 'top center',
        onEnter: () => {
          isSleepingRef.current = true
        },
        onLeaveBack: () => {
          isSleepingRef.current = false
        },
      })
    }

    setupScrollTriggers()

    // -------------------------------------------------------------------------
    // 4. MOUSE CURSOR TRACKING (Additive Head/Spine LookAt)
    // -------------------------------------------------------------------------
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // -------------------------------------------------------------------------
    // 5. ANIMATION LOOP & THREE.MathUtils.damp INTERPOLATION
    // -------------------------------------------------------------------------
    const clock = new THREE.Clock()
    let animationFrameId: number

    const render = () => {
      animationFrameId = requestAnimationFrame(render)

      // Skip render if scrolled past active sections (GPU sleep)
      if (isSleepingRef.current) return

      const delta = Math.min(clock.getDelta(), 0.1)

      // Update animation mixer
      if (mixer) {
        mixer.update(delta)
      }

      // Smooth dampening towards proxy camera coordinates (framerate independent)
      camera.position.x = THREE.MathUtils.damp(camera.position.x, proxy.camX, 4.5, delta)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, proxy.camY, 4.5, delta)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, proxy.camZ, 4.5, delta)

      currentLookAt.x = THREE.MathUtils.damp(currentLookAt.x, proxy.lookX, 4.5, delta)
      currentLookAt.y = THREE.MathUtils.damp(currentLookAt.y, proxy.lookY, 4.5, delta)
      currentLookAt.z = THREE.MathUtils.damp(currentLookAt.z, proxy.lookZ, 4.5, delta)
      camera.lookAt(currentLookAt)

      // Avatar position & rotation dampening
      if (avatarModel) {
        avatarModel.position.x = THREE.MathUtils.damp(avatarModel.position.x, proxy.avatarPosX, 4.0, delta)
        avatarModel.position.y = THREE.MathUtils.damp(avatarModel.position.y, proxy.avatarPosY, 4.0, delta)
        avatarModel.position.z = THREE.MathUtils.damp(avatarModel.position.z, proxy.avatarPosZ, 4.0, delta)
        avatarModel.rotation.y = THREE.MathUtils.damp(avatarModel.rotation.y, proxy.avatarRotY, 4.0, delta)
      }

      // Smooth mouse tracking interpolation
      mouse.x = THREE.MathUtils.damp(mouse.x, mouse.targetX, 5.0, delta)
      mouse.y = THREE.MathUtils.damp(mouse.y, mouse.targetY, 5.0, delta)

      // Additive subtle head/spine tracking with biological constraints
      if (headBone) {
        headBone.rotation.y = THREE.MathUtils.damp(headBone.rotation.y, mouse.x * 0.45, 5.0, delta)
        headBone.rotation.x = THREE.MathUtils.damp(headBone.rotation.x, -mouse.y * 0.35, 5.0, delta)
      }
      if (spineBone) {
        spineBone.rotation.y = THREE.MathUtils.damp(spineBone.rotation.y, mouse.x * 0.2, 4.0, delta)
      }

      // Dynamic monitor screenlight pulsing
      if (screenLight) {
        const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.25 + proxy.screenLightIntensity
        screenLight.intensity = pulse
      }

      renderer.render(scene, camera)
    }

    render()

    // -------------------------------------------------------------------------
    // 6. RESIZE HANDLER & CLEANUP
    // -------------------------------------------------------------------------
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationFrameId)
      ScrollTrigger.getAll().forEach((st) => st.kill())
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        width: '100vw',
        height: '100dvh',
      }}
      aria-hidden="true"
    />
  )
}
