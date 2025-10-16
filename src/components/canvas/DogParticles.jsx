'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useEffect } from 'react'
import { AdditiveBlending, MathUtils, Matrix3, Vector3, Color, ShaderMaterial, BufferAttribute } from 'three'
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
  const colors = new Float32Array(targetCount * 3)
  const dirs = new Float32Array(targetCount * 3)
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
    colors[index] = temp.r
    colors[index + 1] = temp.g
    colors[index + 2] = temp.b

    // random direction per point (unit sphere)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const dx = Math.sin(phi) * Math.cos(theta)
    const dy = Math.sin(phi) * Math.sin(theta)
    const dz = Math.cos(phi)
    dirs[index] = dx
    dirs[index + 1] = dy
    dirs[index + 2] = dz
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

  return { positions, basePositions, offsets, colors, dirs }
}

export function DogParticles({
  density = 1.9,
  pointSize = 0.035,
  color = '#f7c873',
  palette = defaultPalette,
  colorShiftSpeed = 0.8,
  colorIntensity = 0.35,
  breatheAmplitude = 0.08,
  rotationSpeed = 0.25,
  wobbleFrequency = 1.6,
  surfaceJitter = 0,
  ...props
}) {
  const group = useRef()
  const pointsRef = useRef()
  const { scene } = useGLTF('/A.glb')

  const { positions, basePositions, offsets, colors, dirs } = useMemo(
    () => createSurfaceParticles(scene, density, surfaceJitter, palette),
    [scene, density, surfaceJitter, palette],
  )

  // (Re)build geometry attributes whenever data changes
  useEffect(() => {
    const pts = pointsRef.current
    if (!pts) return
    const geom = pts.geometry
    if (!geom) return
    geom.setAttribute('position', new BufferAttribute(positions, 3))
    geom.setAttribute('aBase', new BufferAttribute(basePositions, 3))
    geom.setAttribute('aPhase', new BufferAttribute(offsets, 1))
    geom.setAttribute('aDir', new BufferAttribute(dirs, 3))
    geom.setAttribute('aColor', new BufferAttribute(colors, 3))
    geom.computeBoundingSphere()
  }, [positions, basePositions, offsets, dirs, colors])

  // Shader material for round glowing particles
  const shaderMat = useMemo(() => {
    const mat = new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPointSize: { value: pointSize },
          uBreatheAmplitude: { value: breatheAmplitude },
          uWobbleFrequency: { value: wobbleFrequency },
          uColorIntensity: { value: colorIntensity },
          uColorShiftSpeed: { value: colorShiftSpeed },
        },
        vertexShader: `
          varying vec3 vColor;
          attribute vec3 aBase;
          attribute float aPhase;
          attribute vec3 aDir;
          attribute vec3 aColor;
          uniform float uTime;
          uniform float uPointSize;
          uniform float uBreatheAmplitude;
          uniform float uWobbleFrequency;
          uniform float uColorIntensity;
          uniform float uColorShiftSpeed;

          void main() {
            float s = sin(uTime * uWobbleFrequency + aPhase);
            vec3 displaced = aBase + aDir * (s * uBreatheAmplitude * 0.6);
            vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            // interpret uPointSize similar to R3F size (world units) with attenuation
            float scale = (uPointSize * 1200.0) / max(1.0, -mvPosition.z);
            gl_PointSize = clamp(scale, 2.5, 80.0);

            float pulse = 1.0 - uColorIntensity + abs(sin(uTime * uColorShiftSpeed + aPhase)) * uColorIntensity;
            vColor = aColor * pulse;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float dist = length(uv);
            float alpha = smoothstep(0.35, 0.0, dist);
            if (alpha <= 0.001) discard;
            float glow = smoothstep(0.5, 0.0, dist);
            vec3 col = vColor * (1.0 + glow * 0.85);
            gl_FragColor = vec4(col, alpha);
          }
        `,
      })
    return mat
  }, [pointSize, breatheAmplitude, wobbleFrequency, colorIntensity, colorShiftSpeed])

  useEffect(() => {
    return () => {
      shaderMat?.dispose()
    }
  }, [shaderMat])

  useFrame(({ clock }, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * rotationSpeed
      // group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, Math.sin(clock.elapsedTime * 0.3) * 0.25, 0.05)
    }
    if (shaderMat) shaderMat.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <group ref={group} {...props}>
      <points ref={pointsRef} frustumCulled={false} key={`points-${positions.length}`}>
        <bufferGeometry attach='geometry' />
        {/* @ts-ignore */}
        <primitive object={shaderMat} attach='material' />
      </points>
    </group>
  )
}

useGLTF.preload('/A.glb')
