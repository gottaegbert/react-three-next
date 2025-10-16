'use client'

import { useGLTF, Points } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, MathUtils, Matrix3, Vector3, Color, BufferAttribute } from 'three'
import { MeshSurfaceSampler } from 'three-stdlib'

const defaultPalette = ['#EA972A', '#74542D', '#D4A163', '#E6D5AE', '#925B1F']

const createSurfaceParticles = (scene, density, surfaceJitter, palette = defaultPalette) => {
  const meshes = []
  let totalWeight = 0

  if (!scene) {
    return {
      positions: new Float32Array(),
      basePositions: new Float32Array(),
      offsets: new Float32Array(),
    }
  }

  scene.updateMatrixWorld(true)
  scene.traverse((child) => {
    if (!child.isMesh || !child.geometry?.attributes?.position) return
    const positionAttr = child.geometry.attributes.position
    if (!positionAttr?.count) return

    const sampler = new MeshSurfaceSampler(child).build()
    meshes.push({
      mesh: child,
      sampler,
      weight: positionAttr.count,
      normalMatrix: new Matrix3().getNormalMatrix(child.matrixWorld),
    })
    totalWeight += positionAttr.count
  })

  if (!meshes.length || totalWeight === 0) {
    return {
      positions: new Float32Array(),
      basePositions: new Float32Array(),
      offsets: new Float32Array(),
    }
  }

  const densityFactor = Math.max(0.1, density)
  const targetCount = Math.max(400, Math.floor(totalWeight * densityFactor))
  const positions = new Float32Array(targetCount * 3)
  const basePositions = new Float32Array(targetCount * 3)
  const offsets = new Float32Array(targetCount)
  const baseColors = new Float32Array(targetCount * 3)
  const colors = new Float32Array(targetCount * 3)
  const center = new Vector3()
  const position = new Vector3()
  const normal = new Vector3()
  const paletteColors = (palette && palette.length ? palette : defaultPalette).map((c) => new Color(c))

  for (let i = 0; i < targetCount; i++) {
    let r = Math.random() * totalWeight
    let selected = meshes[0]
    for (let j = 0; j < meshes.length; j++) {
      const entry = meshes[j]
      r -= entry.weight
      if (r <= 0) {
        selected = entry
        break
      }
    }

    selected.sampler.sample(position, normal)
    position.applyMatrix4(selected.mesh.matrixWorld)
    normal.applyMatrix3(selected.normalMatrix).normalize()

    if (surfaceJitter > 0) {
      position.addScaledVector(normal, MathUtils.randFloatSpread(surfaceJitter))
    }

    center.add(position)

    const index = i * 3
    basePositions[index] = positions[index] = position.x
    basePositions[index + 1] = positions[index + 1] = position.y
    basePositions[index + 2] = positions[index + 2] = position.z
    offsets[i] = Math.random() * Math.PI * 2

    // Base color per-point from palette with slight random brightness variation
    const pc = paletteColors[i % paletteColors.length] || new Color('#ffffff')
    const temp = pc.clone().multiplyScalar(0.7 + Math.random() * 0.6)
    baseColors[index] = temp.r
    baseColors[index + 1] = temp.g
    baseColors[index + 2] = temp.b
    colors[index] = temp.r
    colors[index + 1] = temp.g
    colors[index + 2] = temp.b
  }

  center.divideScalar(targetCount)

  for (let i = 0; i < targetCount; i++) {
    const index = i * 3
    basePositions[index] -= center.x
    basePositions[index + 1] -= center.y
    basePositions[index + 2] -= center.z
    positions[index] -= center.x
    positions[index + 1] -= center.y
    positions[index + 2] -= center.z
  }

  return { positions, basePositions, offsets, baseColors, colors }
}

export function DogParticles({
  density = 1.9,
  pointSize = 0.015,
  color = '#f7c873',
  palette = defaultPalette,
  colorShiftSpeed = 0.0,
  colorIntensity = 0.3,
  breatheAmplitude = 0.08,
  rotationSpeed = 0.25,
  wobbleFrequency = 1.6,
  surfaceJitter = 0,
  ...props
}) {
  const group = useRef()
  const pointsRef = useRef()
  const { scene } = useGLTF('/A.glb')

  const { positions, basePositions, offsets, baseColors, colors } = useMemo(
    () => createSurfaceParticles(scene, density, surfaceJitter, palette),
    [scene, density, surfaceJitter, palette],
  )

  // Attach vertex colors once geometry is ready
  useEffect(() => {
    const geom = pointsRef.current?.geometry
    if (!geom || !colors?.length) return
    geom.setAttribute('color', new BufferAttribute(colors, 3))
  }, [colors])

  useFrame(({ clock }, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * rotationSpeed
      group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, Math.sin(clock.elapsedTime * 0.3) * 0.25, 0.05)
    }

    const pointGeometry = pointsRef.current?.geometry
    if (!pointGeometry) return

    const attribute = pointGeometry.attributes.position
    const colorAttr = pointGeometry.attributes.color
    if (!attribute) return

    const time = clock.elapsedTime
    if (!offsets.length) return

    for (let i = 0; i < attribute.count; i++) {
      const index = i * 3
      const wobble = 1 + Math.sin(time * wobbleFrequency + offsets[i]) * breatheAmplitude

      attribute.array[index] = basePositions[index] * wobble
      attribute.array[index + 1] = basePositions[index + 1] * wobble
      attribute.array[index + 2] = basePositions[index + 2] * wobble

      if (colorAttr && baseColors?.length && colorShiftSpeed > 0) {
        const pulse = 1 - colorIntensity + Math.abs(Math.sin(time * colorShiftSpeed + offsets[i])) * colorIntensity
        colorAttr.array[index] = baseColors[index] * pulse
        colorAttr.array[index + 1] = baseColors[index + 1] * pulse
        colorAttr.array[index + 2] = baseColors[index + 2] * pulse
      }
    }

    attribute.needsUpdate = true
    if (colorAttr && colorShiftSpeed > 0) colorAttr.needsUpdate = true
  })

  return (
    <group ref={group} {...props}>
      <Points key={positions.length} ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <pointsMaterial
          attach='material'
          vertexColors
          color={palette && palette.length ? '#ffffff' : color}
          size={pointSize}
          depthWrite={false}
          sizeAttenuation
          toneMapped={false}
          blending={AdditiveBlending}
          transparent
        />
      </Points>
    </group>
  )
}

useGLTF.preload('/A.glb')
