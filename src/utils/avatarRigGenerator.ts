import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

export interface AvatarRigResult {
  scene: THREE.Group
  bones: {
    root: THREE.Bone
    spine: THREE.Bone
    spine2: THREE.Bone
    neck: THREE.Bone
    head: THREE.Bone
    leftArm: THREE.Bone
    leftForeArm: THREE.Bone
    leftHand: THREE.Bone
    rightArm: THREE.Bone
    rightForeArm: THREE.Bone
    rightHand: THREE.Bone
  }
  animations: THREE.AnimationClip[]
  mixer: THREE.AnimationMixer
  screenLight: THREE.PointLight
  screenMesh: THREE.Mesh
}

/**
 * Creates a procedural dark IDE code texture for the ultrawide monitor
 */
function createCodeScreenTexture(): THREE.Texture {
  if (typeof document === 'undefined') {
    return new THREE.Texture()
  }
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Background - Deep midnight IDE
  ctx.fillStyle = '#0a0a14'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Top window header bar
  ctx.fillStyle = '#141424'
  ctx.fillRect(0, 0, canvas.width, 36)
  // Window controls
  ctx.fillStyle = '#ff5f56'
  ctx.beginPath()
  ctx.arc(24, 18, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffbd2e'
  ctx.beginPath()
  ctx.arc(44, 18, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#27c93f'
  ctx.beginPath()
  ctx.arc(64, 18, 6, 0, Math.PI * 2)
  ctx.fill()

  // File tab
  ctx.fillStyle = '#1e1b4b'
  ctx.fillRect(90, 6, 160, 30)
  ctx.fillStyle = '#c084fc'
  ctx.font = 'bold 14px Consolas, monospace'
  ctx.fillText('App.tsx', 110, 26)

  // Sidebar code / structure
  ctx.fillStyle = '#121226'
  ctx.fillRect(0, 36, 160, canvas.height - 36)

  // Code lines simulation with vibrant syntax highlighting
  const colors = ['#c084fc', '#818cf8', '#38bdf8', '#34d399', '#f472b6', '#fcd34d', '#94a3b8']
  let y = 60
  for (let i = 0; i < 24; i++) {
    const indent = 180 + (i % 5 === 0 ? 0 : (i % 4) * 24)
    let x = indent
    const lineParts = 2 + Math.floor(Math.random() * 4)
    for (let p = 0; p < lineParts; p++) {
      const partLen = 20 + Math.floor(Math.random() * 80)
      ctx.fillStyle = colors[(i + p) % colors.length]
      ctx.fillRect(x, y, partLen, 10)
      x += partLen + 10
    }
    y += 18
  }

  // Glowing status bar
  ctx.fillStyle = '#3b0764'
  ctx.fillRect(0, canvas.height - 24, canvas.width, 24)
  ctx.fillStyle = '#e9d5ff'
  ctx.font = '12px Consolas, monospace'
  ctx.fillText('● TypeScript 5.8 | Next.js 16 | Three.js WebGL Engine | UTF-8', 20, canvas.height - 8)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

/**
 * Builds the procedural 3D Rigged Developer Avatar seated at a modern workstation
 */
export function createProceduralAvatarRig(): AvatarRigResult {
  const rootGroup = new THREE.Group()
  rootGroup.name = 'DeveloperWorkstation'

  // Material palette (Dark tech, violet & lilac accents, brushed metals)
  const deskMat = new THREE.MeshStandardMaterial({
    color: 0x181824,
    roughness: 0.35,
    metalness: 0.4,
  })
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x2e2e38,
    roughness: 0.2,
    metalness: 0.85,
  })
  const chairMat = new THREE.MeshStandardMaterial({
    color: 0x111118,
    roughness: 0.7,
    metalness: 0.1,
  })
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xd4a373,
    roughness: 0.65,
    metalness: 0.05,
  })
  const clothingMat = new THREE.MeshStandardMaterial({
    color: 0x1e1b4b, // Deep indigo hoodie
    roughness: 0.85,
    metalness: 0.05,
  })
  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Slate pants
    roughness: 0.8,
    metalness: 0.1,
  })
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x1c1917, // Dark hair
    roughness: 0.9,
    metalness: 0.1,
  })
  const emissiveVioletMat = new THREE.MeshStandardMaterial({
    color: 0xa78bfa,
    emissive: 0x7c3aed,
    emissiveIntensity: 0.8,
    roughness: 0.3,
  })

  // ---------------------------------------------------------------------------
  // 1. WORKSTATION FURNITURE & PERIPHERALS
  // ---------------------------------------------------------------------------

  // Ergonomic Chair Base & Casters
  const chairGroup = new THREE.Group()
  chairGroup.name = 'ErgonomicChair'

  const chairBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.08, 5), metalMat)
  chairBase.position.set(0, 0.1, 0)
  chairGroup.add(chairBase)

  const chairStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12), metalMat)
  chairStem.position.set(0, 0.32, 0)
  chairGroup.add(chairStem)

  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.52), chairMat)
  chairSeat.position.set(0, 0.54, 0)
  chairGroup.add(chairSeat)

  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.06), chairMat)
  chairBack.position.set(0, 0.9, -0.24)
  chairBack.rotation.x = -0.08
  chairGroup.add(chairBack)

  // Armrests
  const leftArmrest = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.22, 0.32), metalMat)
  leftArmrest.position.set(-0.3, 0.68, 0)
  chairGroup.add(leftArmrest)

  const rightArmrest = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.22, 0.32), metalMat)
  rightArmrest.position.set(0.3, 0.68, 0)
  chairGroup.add(rightArmrest)

  rootGroup.add(chairGroup)

  // Desk Surface & Structure
  const deskGroup = new THREE.Group()
  deskGroup.name = 'Desk'
  deskGroup.position.set(0, 0, 0.65)

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.8), deskMat)
  deskTop.position.set(0, 0.72, 0)
  deskGroup.add(deskTop)

  // Desk Legs
  const legGeo = new THREE.BoxGeometry(0.06, 0.72, 0.7)
  const leftLeg = new THREE.Mesh(legGeo, metalMat)
  leftLeg.position.set(-0.72, 0.36, 0)
  const rightLeg = new THREE.Mesh(legGeo, metalMat)
  rightLeg.position.set(0.72, 0.36, 0)
  deskGroup.add(leftLeg, rightLeg)

  // Ultrawide Curved Monitor
  const monitorGroup = new THREE.Group()
  monitorGroup.name = 'UltrawideMonitor'
  monitorGroup.position.set(0, 0.74, 0.15)

  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 12), metalMat)
  stand.position.set(0, 0.18, 0)
  const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.015, 0.2), metalMat)
  standBase.position.set(0, 0.01, 0)
  monitorGroup.add(stand, standBase)

  const screenBezel = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.44, 0.03), metalMat)
  screenBezel.position.set(0, 0.4, 0)
  monitorGroup.add(screenBezel)

  // Emissive Code Screen
  const codeTexture = createCodeScreenTexture()
  const screenMaterial = new THREE.MeshStandardMaterial({
    map: codeTexture,
    emissiveMap: codeTexture,
    emissive: 0x9333ea,
    emissiveIntensity: 0.65,
    roughness: 0.2,
  })
  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.06, 0.4), screenMaterial)
  screenMesh.position.set(0, 0.4, 0.018)
  monitorGroup.add(screenMesh)

  // Screen Light Illumination casting on avatar
  const screenLight = new THREE.PointLight(0xa78bfa, 1.8, 2.5)
  screenLight.position.set(0, 0.42, 0.12)
  monitorGroup.add(screenLight)

  deskGroup.add(monitorGroup)

  // Mechanical Keyboard
  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.02, 0.16), metalMat)
  keyboard.position.set(0, 0.755, -0.15)
  deskGroup.add(keyboard)

  const keycaps = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.14), emissiveVioletMat)
  keycaps.position.set(0, 0.77, -0.15)
  deskGroup.add(keycaps)

  // Mouse & Pad
  const mousePad = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.005, 0.35),
    new THREE.MeshStandardMaterial({ color: 0x0c0c14, roughness: 0.9 })
  )
  mousePad.position.set(0, 0.748, -0.15)
  deskGroup.add(mousePad)

  const mouse = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.025, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x222230, roughness: 0.3 })
  )
  mouse.position.set(0.3, 0.765, -0.15)
  deskGroup.add(mouse)

  // PC Tower on Desk
  const pcTower = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.48, 0.45),
    new THREE.MeshStandardMaterial({ color: 0x090910, metalness: 0.8, roughness: 0.2 })
  )
  pcTower.position.set(0.68, 0.98, 0.08)
  deskGroup.add(pcTower)

  // PC Internal Glow
  const pcGlow = new THREE.PointLight(0xc084fc, 0.9, 1.2)
  pcGlow.position.set(0.68, 0.98, 0.08)
  deskGroup.add(pcGlow)

  // Coffee Mug
  const mug = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.035, 0.09, 16),
    new THREE.MeshStandardMaterial({ color: 0xeeeeff, roughness: 0.2 })
  )
  mug.position.set(-0.35, 0.79, -0.1)
  deskGroup.add(mug)

  rootGroup.add(deskGroup)

  // ---------------------------------------------------------------------------
  // 2. RIGGED CHARACTER HIERARCHY WITH NAMED BONES
  // ---------------------------------------------------------------------------

  const avatarGroup = new THREE.Group()
  avatarGroup.name = 'RiggedDeveloper'
  avatarGroup.position.set(0, 0.54, 0) // Seated at seat height

  // Bones Hierarchy
  const rootBone = new THREE.Bone()
  rootBone.name = 'Hips'
  rootBone.position.set(0, 0, 0)

  const spineBone = new THREE.Bone()
  spineBone.name = 'Spine'
  spineBone.position.set(0, 0.18, 0)
  rootBone.add(spineBone)

  const spine2Bone = new THREE.Bone()
  spine2Bone.name = 'Spine2'
  spine2Bone.position.set(0, 0.18, 0)
  spineBone.add(spine2Bone)

  const neckBone = new THREE.Bone()
  neckBone.name = 'Neck'
  neckBone.position.set(0, 0.14, 0)
  spine2Bone.add(neckBone)

  const headBone = new THREE.Bone()
  headBone.name = 'Head'
  headBone.position.set(0, 0.12, 0)
  neckBone.add(headBone)

  // Left Arm & Hand
  const leftArmBone = new THREE.Bone()
  leftArmBone.name = 'LeftArm'
  leftArmBone.position.set(-0.22, 0.12, 0)
  leftArmBone.rotation.set(0.3, 0.15, -0.2)
  spine2Bone.add(leftArmBone)

  const leftForeArmBone = new THREE.Bone()
  leftForeArmBone.name = 'LeftForeArm'
  leftForeArmBone.position.set(-0.02, -0.22, 0.1)
  leftForeArmBone.rotation.set(-0.7, 0.3, 0)
  leftArmBone.add(leftForeArmBone)

  const leftHandBone = new THREE.Bone()
  leftHandBone.name = 'LeftHand'
  leftHandBone.position.set(0, -0.16, 0.05)
  leftForeArmBone.add(leftHandBone)

  // Right Arm & Hand
  const rightArmBone = new THREE.Bone()
  rightArmBone.name = 'RightArm'
  rightArmBone.position.set(0.22, 0.12, 0)
  rightArmBone.rotation.set(0.3, -0.15, 0.2)
  spine2Bone.add(rightArmBone)

  const rightForeArmBone = new THREE.Bone()
  rightForeArmBone.name = 'RightForeArm'
  rightForeArmBone.position.set(0.02, -0.22, 0.1)
  rightForeArmBone.rotation.set(-0.7, -0.3, 0)
  rightArmBone.add(rightForeArmBone)

  const rightHandBone = new THREE.Bone()
  rightHandBone.name = 'RightHand'
  rightHandBone.position.set(0, -0.16, 0.05)
  rightForeArmBone.add(rightHandBone)

  avatarGroup.add(rootBone)

  // Character Meshes Attached to Bones
  // Pelvis / Legs (Seated)
  const pelvisMesh = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.16, 0.28), pantsMat)
  pelvisMesh.position.set(0, 0.05, 0)
  rootBone.add(pelvisMesh)

  // Thighs extending forward toward desk
  const leftThigh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.38), pantsMat)
  leftThigh.position.set(-0.12, 0.02, 0.2)
  const rightThigh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.38), pantsMat)
  rightThigh.position.set(0.12, 0.02, 0.2)
  rootBone.add(leftThigh, rightThigh)

  // Calves down to floor
  const leftCalf = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.12), pantsMat)
  leftCalf.position.set(-0.12, -0.24, 0.36)
  const rightCalf = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.12), pantsMat)
  rightCalf.position.set(0.12, -0.24, 0.36)
  rootBone.add(leftCalf, rightCalf)

  // Torso / Hoodie attached to Spine & Spine2
  const lowerTorso = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.2, 0.24), clothingMat)
  lowerTorso.position.set(0, 0.09, 0)
  spineBone.add(lowerTorso)

  const upperTorso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.26), clothingMat)
  upperTorso.position.set(0, 0.1, 0)
  spine2Bone.add(upperTorso)

  // Head and Hair
  const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 0.22), skinMat)
  headMesh.position.set(0, 0.12, 0.02)
  headBone.add(headMesh)

  const hairMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.24), hairMat)
  hairMesh.position.set(0, 0.2, 0.01)
  headBone.add(hairMesh)

  // Stylized Glasses / Visor
  const glasses = new THREE.Mesh(
    new THREE.BoxGeometry(0.23, 0.05, 0.05),
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
    })
  )
  glasses.position.set(0, 0.13, 0.13)
  headBone.add(glasses)

  // Arms and Hands
  const leftUpperArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, 0.1), clothingMat)
  leftUpperArmMesh.position.set(0, -0.11, 0)
  leftArmBone.add(leftUpperArmMesh)

  const leftForeArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.2, 0.09), clothingMat)
  leftForeArmMesh.position.set(0, -0.09, 0)
  leftForeArmBone.add(leftForeArmMesh)

  const leftHandMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.1), skinMat)
  leftHandMesh.position.set(0, -0.04, 0.04)
  leftHandBone.add(leftHandMesh)

  const rightUpperArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, 0.1), clothingMat)
  rightUpperArmMesh.position.set(0, -0.11, 0)
  rightArmBone.add(rightUpperArmMesh)

  const rightForeArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.2, 0.09), clothingMat)
  rightForeArmMesh.position.set(0, -0.09, 0)
  rightForeArmBone.add(rightForeArmMesh)

  const rightHandMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.1), skinMat)
  rightHandMesh.position.set(0, -0.04, 0.04)
  rightHandBone.add(rightHandMesh)

  rootGroup.add(avatarGroup)

  // ---------------------------------------------------------------------------
  // 3. ANIMATION TRACKS (IDLE, TYPING, BLINK)
  // ---------------------------------------------------------------------------

  // A. Idle Animation (Breathing & Subtle Head Sway)
  const idleTimes = [0, 2.0, 4.0]
  const spineIdleRotations = [
    0, 0, 0, 1,
    0.03, 0, 0, 0.9995, // slight inhalation
    0, 0, 0, 1,
  ]
  const spineIdleTrack = new THREE.QuaternionKeyframeTrack('Spine.quaternion', idleTimes, spineIdleRotations)

  const headIdleRotations = [
    0, 0, 0, 1,
    -0.02, 0.04, 0, 0.999, // glancing across ultrawide monitor
    0, 0, 0, 1,
  ]
  const headIdleTrack = new THREE.QuaternionKeyframeTrack('Head.quaternion', idleTimes, headIdleRotations)

  const idleClip = new THREE.AnimationClip('Idle', 4.0, [spineIdleTrack, headIdleTrack])

  // B. Typing Animation (Rapid Hand / ForeArm Tapping & Head Focus)
  const typeTimes = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2]
  const leftHandPositions = [
    0, -0.04, 0.04,
    0, -0.02, 0.04,
    0, -0.04, 0.04,
    0, -0.03, 0.04,
    0, -0.04, 0.04,
    0, -0.02, 0.04,
    0, -0.04, 0.04,
    0, -0.03, 0.04,
    0, -0.04, 0.04,
  ]
  const leftHandTrack = new THREE.VectorKeyframeTrack('LeftHand.position', typeTimes, leftHandPositions)

  const rightHandPositions = [
    0, -0.03, 0.04,
    0, -0.04, 0.04,
    0, -0.02, 0.04,
    0, -0.04, 0.04,
    0, -0.03, 0.04,
    0, -0.04, 0.04,
    0, -0.02, 0.04,
    0, -0.04, 0.04,
    0, -0.03, 0.04,
  ]
  const rightHandTrack = new THREE.VectorKeyframeTrack('RightHand.position', typeTimes, rightHandPositions)

  const typingClip = new THREE.AnimationClip('Typing', 1.2, [leftHandTrack, rightHandTrack])

  // C. Blink Animation
  const blinkTimes = [0, 0.15, 0.3]
  const glassScales = [
    1, 1, 1,
    1, 0.1, 1, // brief compression mimicking blink
    1, 1, 1,
  ]
  const blinkTrack = new THREE.VectorKeyframeTrack('Head/Mesh.scale', blinkTimes, glassScales)
  const blinkClip = new THREE.AnimationClip('Blink', 0.3, [blinkTrack])

  const mixer = new THREE.AnimationMixer(rootGroup)
  const idleAction = mixer.clipAction(idleClip)
  const typingAction = mixer.clipAction(typingClip)
  idleAction.play()
  typingAction.play()

  return {
    scene: rootGroup,
    bones: {
      root: rootBone,
      spine: spineBone,
      spine2: spine2Bone,
      neck: neckBone,
      head: headBone,
      leftArm: leftArmBone,
      leftForeArm: leftForeArmBone,
      leftHand: leftHandBone,
      rightArm: rightArmBone,
      rightForeArm: rightForeArmBone,
      rightHand: rightHandBone,
    },
    animations: [idleClip, typingClip, blinkClip],
    mixer,
    screenLight,
    screenMesh,
  }
}

/**
 * Exports the generated procedural avatar rig to a GLB ArrayBuffer
 */
export async function exportAvatarToGLB(object: THREE.Object3D): Promise<ArrayBuffer> {
  const exporter = new GLTFExporter()
  return new Promise((resolve, reject) => {
    exporter.parse(
      object,
      (gltf) => {
        if (gltf instanceof ArrayBuffer) {
          resolve(gltf)
        } else {
          const str = JSON.stringify(gltf)
          const buffer = new TextEncoder().encode(str).buffer
          resolve(buffer)
        }
      },
      (error) => reject(error),
      {
        binary: true,
        animations: object.animations,
      }
    )
  })
}

/**
 * Triggers a browser download of the generated GLB
 */
export async function downloadAvatarGLB(): Promise<void> {
  const rig = createProceduralAvatarRig()
  const buffer = await exportAvatarToGLB(rig.scene)
  const blob = new Blob([buffer], { type: 'model/gltf-binary' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'character.glb'
  a.click()
  URL.revokeObjectURL(url)
}
