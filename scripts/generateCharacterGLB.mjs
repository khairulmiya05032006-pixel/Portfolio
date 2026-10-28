import fs from 'node:fs'
import path from 'node:path'

// Node.js FileReader polyfill for GLTFExporter
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf
        if (this.onload) this.onload({ target: this })
        if (this.onloadend) this.onloadend({ target: this })
      })
    }
  }
}

import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

async function generateGLB() {
  const root = new THREE.Group()
  root.name = 'DeveloperWorkstation'

  // Materials
  const deskMat = new THREE.MeshStandardMaterial({ color: 0x181824, roughness: 0.35, metalness: 0.4 })
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x2e2e38, roughness: 0.2, metalness: 0.85 })
  const chairMat = new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.7 })
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.65 })
  const hoodieMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.85 })
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 })
  const emissiveViolet = new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0x7c3aed, emissiveIntensity: 0.8 })

  // Chair
  const chair = new THREE.Group()
  chair.name = 'Chair'
  chair.add(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.08, 5), metalMat))
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.52), chairMat)
  seat.position.set(0, 0.54, 0)
  chair.add(seat)
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.06), chairMat)
  back.position.set(0, 0.9, -0.24)
  chair.add(back)
  root.add(chair)

  // Desk
  const desk = new THREE.Group()
  desk.name = 'Desk'
  desk.position.set(0, 0, 0.65)
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.8), deskMat)
  top.position.set(0, 0.72, 0)
  desk.add(top)
  const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.72, 0.7), metalMat)
  leg1.position.set(-0.72, 0.36, 0)
  const leg2 = leg1.clone()
  leg2.position.set(0.72, 0.36, 0)
  desk.add(leg1, leg2)

  // Ultrawide Screen
  const monitor = new THREE.Group()
  monitor.name = 'Monitor'
  monitor.position.set(0, 0.74, 0.15)
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.44, 0.03), metalMat)
  bezel.position.set(0, 0.4, 0)
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.06, 0.4), emissiveViolet)
  screen.position.set(0, 0.4, 0.018)
  monitor.add(bezel, screen)
  desk.add(monitor)

  // Keyboard & Peripherals
  const kb = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.02, 0.16), metalMat)
  kb.position.set(0, 0.755, -0.15)
  const keys = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.14), emissiveViolet)
  keys.position.set(0, 0.77, -0.15)
  desk.add(kb, keys)

  const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.025, 0.1), metalMat)
  mouse.position.set(0.3, 0.765, -0.15)
  desk.add(mouse)

  const pc = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.48, 0.45), metalMat)
  pc.position.set(0.68, 0.98, 0.08)
  desk.add(pc)

  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.09, 16), new THREE.MeshStandardMaterial({ color: 0xeeeef0 }))
  mug.position.set(-0.35, 0.79, -0.1)
  desk.add(mug)
  root.add(desk)

  // Rigged Avatar Hierarchical Group
  const avatar = new THREE.Group()
  avatar.name = 'RiggedDeveloper'
  avatar.position.set(0, 0.54, 0)

  const rootBone = new THREE.Bone()
  rootBone.name = 'Hips'
  const spine = new THREE.Bone()
  spine.name = 'Spine'
  spine.position.set(0, 0.18, 0)
  rootBone.add(spine)

  const spine2 = new THREE.Bone()
  spine2.name = 'Spine2'
  spine2.position.set(0, 0.18, 0)
  spine.add(spine2)

  const neck = new THREE.Bone()
  neck.name = 'Neck'
  neck.position.set(0, 0.14, 0)
  spine2.add(neck)

  const head = new THREE.Bone()
  head.name = 'Head'
  head.position.set(0, 0.12, 0)
  neck.add(head)

  // Meshes on bones
  const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.26), hoodieMat)
  torsoMesh.position.set(0, 0.19, 0)
  spine.add(torsoMesh)

  const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 0.22), skinMat)
  headMesh.position.set(0, 0.12, 0.02)
  head.add(headMesh)

  const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.05, 0.05), emissiveViolet)
  glasses.position.set(0, 0.13, 0.13)
  head.add(glasses)

  // Arms
  const leftArm = new THREE.Bone()
  leftArm.name = 'LeftArm'
  leftArm.position.set(-0.22, 0.12, 0)
  spine2.add(leftArm)
  const leftForeArm = new THREE.Bone()
  leftForeArm.name = 'LeftForeArm'
  leftForeArm.position.set(-0.02, -0.22, 0.1)
  leftArm.add(leftForeArm)
  const leftHand = new THREE.Bone()
  leftHand.name = 'LeftHand'
  leftHand.position.set(0, -0.16, 0.05)
  leftForeArm.add(leftHand)

  const rightArm = new THREE.Bone()
  rightArm.name = 'RightArm'
  rightArm.position.set(0.22, 0.12, 0)
  spine2.add(rightArm)
  const rightForeArm = new THREE.Bone()
  rightForeArm.name = 'RightForeArm'
  rightForeArm.position.set(0.02, -0.22, 0.1)
  rightArm.add(rightForeArm)
  const rightHand = new THREE.Bone()
  rightHand.name = 'RightHand'
  rightHand.position.set(0, -0.16, 0.05)
  rightForeArm.add(rightHand)

  // Arm meshes
  const lUpper = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.1), hoodieMat)
  lUpper.position.set(0, -0.11, 0)
  leftArm.add(lUpper)
  const lFore = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.2, 0.09), hoodieMat)
  lFore.position.set(0, -0.09, 0)
  leftForeArm.add(lFore)
  const lHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.1), skinMat)
  lHand.position.set(0, -0.04, 0.04)
  leftHand.add(lHand)

  const rUpper = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.1), hoodieMat)
  rUpper.position.set(0, -0.11, 0)
  rightArm.add(rUpper)
  const rFore = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.2, 0.09), hoodieMat)
  rFore.position.set(0, -0.09, 0)
  rightForeArm.add(rFore)
  const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.1), skinMat)
  rHand.position.set(0, -0.04, 0.04)
  rightHand.add(rHand)

  // Legs (Seated)
  const legs = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.16, 0.36), pantsMat)
  legs.position.set(0, 0.05, 0.12)
  rootBone.add(legs)

  avatar.add(rootBone)
  root.add(avatar)

  // Export to GLB
  const exporter = new GLTFExporter()
  exporter.parse(
    root,
    (gltf) => {
      const buffer = Buffer.from(gltf)
      const outDir = path.join(process.cwd(), 'public', 'models')
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true })
      }
      const outPath = path.join(outDir, 'character.glb')
      fs.writeFileSync(outPath, buffer)
      console.log('Successfully generated public/models/character.glb (' + buffer.length + ' bytes)')
    },
    (err) => console.error(err),
    { binary: true }
  )
}

generateGLB()
