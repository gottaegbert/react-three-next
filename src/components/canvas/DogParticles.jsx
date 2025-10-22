'use client'

import { useGLTF, useFBO } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  AdditiveBlending,
  MathUtils,
  Matrix3,
  Vector3,
  Color,
  ShaderMaterial,
  BufferAttribute,
  DataTexture,
  RGBAFormat,
  FloatType,
  NearestFilter,
  ClampToEdgeWrapping,
  Scene,
  OrthographicCamera,
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
} from 'three'
import { MeshSurfaceSampler } from 'three-stdlib'

const defaultPalette = ['#EA972A', '#74542D', '#D4A163', '#E6D5AE', '#925B1F']

const getTextureSize = (count) => Math.max(1, Math.ceil(Math.sqrt(Math.max(1, count))))

const createSurfaceParticles = (scene, density, surfaceJitter, palette = defaultPalette) => {
  const meshes = []
  let totalWeight = 0

  if (!scene) {
    return {
      count: 0,
      textureSize: 1,
      basePositions: new Float32Array(),
      colors: new Float32Array(),
      uvs: new Float32Array(),
      baseData: new Float32Array(4),
      dirData: new Float32Array(4),
      center: new Vector3(),
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
      count: 0,
      textureSize: 1,
      basePositions: new Float32Array(),
      colors: new Float32Array(),
      uvs: new Float32Array(),
      baseData: new Float32Array(4),
      dirData: new Float32Array(4),
      center: new Vector3(),
    }
  }

  const densityFactor = Math.max(0.1, density)
  const count = Math.max(3200, Math.floor(totalWeight * densityFactor))

  const basePositions = new Float32Array(count * 3)
  const offsets = new Float32Array(count)
  const colors = new Float32Array(count * 3)
  const dirs = new Float32Array(count * 3)
  let maxRadius = 0

  const center = new Vector3()
  const position = new Vector3()
  const normal = new Vector3()
  const paletteColors = (palette && palette.length ? palette : defaultPalette).map((c) => new Color(c))

  for (let i = 0; i < count; i++) {
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
    basePositions[index] = position.x
    basePositions[index + 1] = position.y
    basePositions[index + 2] = position.z
    offsets[i] = Math.random() * Math.PI * 2

    const paletteColor = paletteColors[i % paletteColors.length] || new Color('#ffffff')
    const temp = paletteColor.clone().multiplyScalar(0.7 + Math.random() * 0.6)
    colors[index] = temp.r
    colors[index + 1] = temp.g
    colors[index + 2] = temp.b

    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const dx = Math.sin(phi) * Math.cos(theta)
    const dy = Math.sin(phi) * Math.sin(theta)
    const dz = Math.cos(phi)
    dirs[index] = dx
    dirs[index + 1] = dy
    dirs[index + 2] = dz
  }

  center.divideScalar(count)

  for (let i = 0; i < count; i++) {
    const index = i * 3
    basePositions[index] -= center.x
    basePositions[index + 1] -= center.y
    basePositions[index + 2] -= center.z

    const len = Math.hypot(basePositions[index], basePositions[index + 1], basePositions[index + 2])
    if (len > maxRadius) maxRadius = len
  }

  const textureSize = getTextureSize(count)
  const texelCount = textureSize * textureSize
  const baseData = new Float32Array(texelCount * 4)
  const dirData = new Float32Array(texelCount * 4)
  const sphereData = new Float32Array(texelCount * 4)
  const uvs = new Float32Array(count * 2)

  const sphereRadius = maxRadius > 0 ? maxRadius * 1.05 : 1

  for (let i = 0; i < count; i++) {
    const index3 = i * 3
    const index4 = i * 4
    baseData[index4] = basePositions[index3]
    baseData[index4 + 1] = basePositions[index3 + 1]
    baseData[index4 + 2] = basePositions[index3 + 2]
    baseData[index4 + 3] = offsets[i]

    dirData[index4] = dirs[index3]
    dirData[index4 + 1] = dirs[index3 + 1]
    dirData[index4 + 2] = dirs[index3 + 2]
    dirData[index4 + 3] = 0

    const randTheta = Math.random() * Math.PI * 2
    const randPhi = Math.acos(2 * Math.random() - 1)
    const randRadius = sphereRadius * (0.55 + 0.45 * Math.cbrt(Math.random()))
    const sx = Math.sin(randPhi) * Math.cos(randTheta)
    const sy = Math.sin(randPhi) * Math.sin(randTheta)
    const sz = Math.cos(randPhi)

    sphereData[index4] = sx * randRadius
    sphereData[index4 + 1] = sy * randRadius
    sphereData[index4 + 2] = sz * randRadius
    sphereData[index4 + 3] = offsets[i]

    const x = i % textureSize
    const y = Math.floor(i / textureSize)
    uvs[i * 2] = (x + 0.5) / textureSize
    uvs[i * 2 + 1] = (y + 0.5) / textureSize
  }

  // Unused texels stay zeroed out

  return { count, textureSize, basePositions, colors, uvs, baseData, dirData, sphereData, center }
}

const createDataTexture = (data, size) => {
  const texture = new DataTexture(data, size, size, RGBAFormat, FloatType)
  texture.needsUpdate = true
  texture.magFilter = NearestFilter
  texture.minFilter = NearestFilter
  texture.wrapS = ClampToEdgeWrapping
  texture.wrapT = ClampToEdgeWrapping
  texture.flipY = false
  return texture
}

export function DogParticles({
  density = 8.5,
  pointSize = 0.01,
  color = '#d4af37',
  palette = defaultPalette,
  colorShiftSpeed = 0.8,
  colorIntensity = 0.35,
  breatheAmplitude = 0.08,
  rotationSpeed = 0.25,
  wobbleFrequency = 1.7,
  surfaceJitter = 0.05,
  forceStrength = 0.6,
  forceFrequency = 0.45,
  flowStrength = 0.25,
  morphDuration = 10,
  showModel = true,
  explode = false,
  modelUrl = '/B.glb',
  ...props
}) {
  const group = useRef()
  const pointsRef = useRef()
  const morphProgressRef = useRef(0)
  const targetProgressRef = useRef(explode ? 0 : 1)
  const sourceTextureRef = useRef(null)
  const latestTargetRef = useRef(null)
  const renderer = useThree((state) => state.gl)
  const resolvedUrl = modelUrl || '/B.glb'
  const { scene } = useGLTF(resolvedUrl)

  const {
    count,
    textureSize,
    basePositions,
    colors,
    uvs,
    baseData,
    dirData,
    sphereData: randomSphereData,
    center,
  } = useMemo(
    () => createSurfaceParticles(scene, density, surfaceJitter, palette),
    [scene, density, surfaceJitter, palette],
  )

  const baseTexture = useMemo(() => createDataTexture(baseData, textureSize), [baseData, textureSize])
  const dirTexture = useMemo(() => createDataTexture(dirData, textureSize), [dirData, textureSize])
  const randomTexture = useMemo(() => createDataTexture(randomSphereData, textureSize), [randomSphereData, textureSize])

  useEffect(() => () => baseTexture.dispose(), [baseTexture])
  useEffect(() => () => dirTexture.dispose(), [dirTexture])
  useEffect(() => () => randomTexture.dispose(), [randomTexture])
  useEffect(() => () => sourceTextureRef.current?.dispose(), [])

  const model = useMemo(() => {
    if (!scene) return null

    const baseColor = new Color('#101015')
    const goldColor = new Color('#d4af37')

    const clone = scene.clone(true)
    let meshIndex = 0
    clone.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true
      if (Array.isArray(child.material)) {
        child.material.forEach((mat) => mat?.dispose?.())
      } else {
        child.material?.dispose?.()
      }
      const material = new MeshStandardMaterial({
        color: baseColor.clone().lerp(goldColor, meshIndex % 2 === 0 ? 0.35 : 0.55),
        metalness: 0.88,
        roughness: 0.28,
      })
      material.emissive.copy(goldColor)
      material.emissiveIntensity = meshIndex % 2 === 0 ? 0.12 : 0.2
      child.material = material
      meshIndex += 1
    })

    clone.position.set(-center.x, -center.y, -center.z)
    return clone
  }, [center, scene])

  const simulationMaterial = useMemo(
    () =>
      new ShaderMaterial({
        depthWrite: false,
        uniforms: {
          uSourceMap: { value: null },
          uTargetMap: { value: null },
          uDirMap: { value: null },
          uTime: { value: 0 },
          uMorphProgress: { value: 0 },
          uBreatheAmplitude: { value: breatheAmplitude },
          uWobbleFrequency: { value: wobbleFrequency },
          uForceStrength: { value: forceStrength },
          uForceFrequency: { value: forceFrequency },
          uFlowStrength: { value: flowStrength },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform sampler2D uSourceMap;
          uniform sampler2D uTargetMap;
          uniform sampler2D uDirMap;
          uniform float uTime;
          uniform float uMorphProgress;
          uniform float uBreatheAmplitude;
          uniform float uWobbleFrequency;
          uniform float uForceStrength;
          uniform float uForceFrequency;
          uniform float uFlowStrength;

          void main() {
            vec4 source = texture2D(uSourceMap, vUv);
            vec4 target = texture2D(uTargetMap, vUv);
            vec3 dir = texture2D(uDirMap, vUv).xyz;
            float phase = mix(source.w, target.w, uMorphProgress);
            vec3 basePos = mix(source.xyz, target.xyz, uMorphProgress);
            float s = sin(uTime * uWobbleFrequency + phase);
            float forceBlend = clamp(1.0 - uMorphProgress, 0.0, 1.0);
            vec3 swirl = vec3(-basePos.z, 0.0, basePos.x);
            float swirlLen = length(swirl);
            if (swirlLen > 0.0001) {
              swirl /= swirlLen;
            } else {
              swirl = vec3(0.0, 1.0, 0.0);
            }

            float swirlAmount = uForceStrength * forceBlend * sin(uTime * uForceFrequency + phase);
            vec3 forceOffset = swirl * swirlAmount;

            float radialLen = length(basePos);
            if (radialLen > 0.0001) {
              vec3 radialDir = basePos / radialLen;
              forceOffset += radialDir * (uForceStrength * 0.2 * forceBlend * cos(uTime * (uForceFrequency * 0.6) + phase));
            }

            forceOffset.y += uFlowStrength * forceBlend * sin(uTime * (uForceFrequency * 0.5) + basePos.x * 0.35 + basePos.z * 0.25);

            vec3 displaced = basePos + forceOffset + dir * (s * uBreatheAmplitude * 0.6);
            gl_FragColor = vec4(displaced, phase);
          }
        `,
      }),
    [flowStrength, forceFrequency, forceStrength, breatheAmplitude, wobbleFrequency],
  )

  const pointsMaterial = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPointSize: { value: pointSize },
          uColorIntensity: { value: colorIntensity },
          uColorShiftSpeed: { value: colorShiftSpeed },
          uPositionTexture: { value: null },
          uTint: { value: new Color(color) },
          uUseTint: { value: 1 },
        },
        vertexShader: `
          attribute vec2 aUv;
          attribute vec3 aColor;
          varying vec3 vColor;
          uniform sampler2D uPositionTexture;
          uniform float uTime;
          uniform float uPointSize;
          uniform float uColorIntensity;
          uniform float uColorShiftSpeed;
          uniform vec3 uTint;
          uniform float uUseTint;

          void main() {
            vec4 posData = texture2D(uPositionTexture, aUv);
            vec3 pos = posData.xyz;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            float scale = (uPointSize * 3200.0) / max(1.0, -mvPosition.z);
            gl_PointSize = clamp(scale, 2.5, 120.0);

            float phase = posData.w;
            float pulse = 1.0 - uColorIntensity + abs(sin(uTime * uColorShiftSpeed + phase)) * uColorIntensity;
            vec3 paletteColor = aColor;
            if (uUseTint > 0.5) {
              paletteColor *= uTint;
            }
            vColor = paletteColor * pulse;
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
      }),
    [],
  )

  useEffect(() => () => simulationMaterial.dispose(), [simulationMaterial])
  useEffect(() => () => pointsMaterial.dispose(), [pointsMaterial])

  const setSourceTexture = useCallback(
    (dataArray) => {
      if (!dataArray) return
      sourceTextureRef.current?.dispose()
      sourceTextureRef.current = createDataTexture(dataArray, textureSize)
      simulationMaterial.uniforms.uSourceMap.value = sourceTextureRef.current
    },
    [simulationMaterial, textureSize],
  )

  useEffect(() => {
    if (!sourceTextureRef.current) {
      setSourceTexture(randomSphereData)
    }
  }, [randomSphereData, setSourceTexture])

  useEffect(() => {
    let captured = null
    if (renderer && latestTargetRef.current) {
      const target = latestTargetRef.current
      const width = target.width ?? textureSize
      const height = target.height ?? textureSize
      if (width === textureSize && height === textureSize) {
        const buffer = new Float32Array(textureSize * textureSize * 4)
        try {
          renderer.readRenderTargetPixels(target, 0, 0, textureSize, textureSize, buffer)
          captured = buffer
        } catch {
          captured = null
        }
      }
    }

    setSourceTexture(captured ?? randomSphereData)
    targetProgressRef.current = explode ? 0 : 1
    morphProgressRef.current = 0
  }, [renderer, explode, randomSphereData, setSourceTexture, textureSize])

  useEffect(() => {
    simulationMaterial.uniforms.uTargetMap.value = explode ? randomTexture : baseTexture
  }, [baseTexture, explode, randomTexture, simulationMaterial])

  useEffect(() => {
    simulationMaterial.uniforms.uDirMap.value = dirTexture
  }, [dirTexture, simulationMaterial])

  useEffect(() => {
    simulationMaterial.uniforms.uBreatheAmplitude.value = breatheAmplitude
  }, [simulationMaterial, breatheAmplitude])

  useEffect(() => {
    simulationMaterial.uniforms.uWobbleFrequency.value = wobbleFrequency
  }, [simulationMaterial, wobbleFrequency])

  useEffect(() => {
    simulationMaterial.uniforms.uForceStrength.value = forceStrength
  }, [simulationMaterial, forceStrength])

  useEffect(() => {
    simulationMaterial.uniforms.uForceFrequency.value = forceFrequency
  }, [simulationMaterial, forceFrequency])

  useEffect(() => {
    simulationMaterial.uniforms.uFlowStrength.value = flowStrength
  }, [simulationMaterial, flowStrength])

  useEffect(() => {
    pointsMaterial.uniforms.uPointSize.value = pointSize
  }, [pointsMaterial, pointSize])

  useEffect(() => {
    pointsMaterial.uniforms.uColorIntensity.value = colorIntensity
  }, [pointsMaterial, colorIntensity])

  useEffect(() => {
    pointsMaterial.uniforms.uColorShiftSpeed.value = colorShiftSpeed
  }, [pointsMaterial, colorShiftSpeed])

  useEffect(() => {
    pointsMaterial.uniforms.uTint.value.set(color)
  }, [pointsMaterial, color])

  useEffect(() => {
    pointsMaterial.uniforms.uUseTint.value = palette && palette.length > 1 ? 0 : 1
  }, [pointsMaterial, palette])

  useEffect(() => {
    const pts = pointsRef.current
    if (!pts) return
    const geom = pts.geometry
    geom.setAttribute('position', new BufferAttribute(basePositions, 3))
    geom.setAttribute('aUv', new BufferAttribute(uvs, 2))
    geom.setAttribute('aColor', new BufferAttribute(colors, 3))
    geom.computeBoundingSphere()
  }, [basePositions, uvs, colors, count])

  const simulationTarget = useFBO(textureSize, textureSize, {
    type: FloatType,
    format: RGBAFormat,
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    depthBuffer: false,
  })

  useEffect(() => {
    pointsMaterial.uniforms.uPositionTexture.value = simulationTarget.texture
    latestTargetRef.current = simulationTarget
  }, [pointsMaterial, simulationTarget])

  const simulationScene = useMemo(() => {
    const sceneObj = new Scene()
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const quad = new Mesh(new PlaneGeometry(2, 2), simulationMaterial)
    sceneObj.add(quad)
    return { scene: sceneObj, camera, quad }
  }, [simulationMaterial])

  useEffect(() => () => simulationScene.quad.geometry.dispose(), [simulationScene])

  useFrame(({ gl, clock }, delta) => {
    if (!baseTexture || !dirTexture || count === 0) return

    if (group.current) {
      group.current.rotation.y += delta * rotationSpeed
      group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, Math.sin(clock.elapsedTime * 0.3) * 0.25, 0.05)
    }

    const elapsed = clock.elapsedTime
    simulationMaterial.uniforms.uTime.value = elapsed

    const target = targetProgressRef.current
    const step = delta / Math.max(0.001, morphDuration)
    let current = morphProgressRef.current
    if (current < target) {
      current = Math.min(target, current + step)
    } else if (current > target) {
      current = Math.max(target, current - step)
    }
    morphProgressRef.current = current
    simulationMaterial.uniforms.uMorphProgress.value = current

    gl.setRenderTarget(simulationTarget)
    gl.render(simulationScene.scene, simulationScene.camera)
    gl.setRenderTarget(null)

    pointsMaterial.uniforms.uTime.value = elapsed
    pointsMaterial.uniforms.uPositionTexture.value = simulationTarget.texture
    latestTargetRef.current = simulationTarget
  })

  return (
    <group ref={group} {...props}>
      <ambientLight intensity={0.2} color='#0d0d12' />
      <directionalLight position={[6, 8, 6]} intensity={1.2} color='#f5c46d' castShadow />
      <directionalLight position={[-4, -3, -5]} intensity={0.5} color='#c79f3a' />
      {model && showModel && <primitive object={model} dispose={null} />}
      <points ref={pointsRef} key={`particles-${count}`} frustumCulled={false}>
        <bufferGeometry attach='geometry' />
        {/* @ts-ignore */}
        <primitive object={pointsMaterial} attach='material' />
      </points>
    </group>
  )
}

useGLTF.preload('/B.glb')
useGLTF.preload('/Pistol.glb')
useGLTF.preload('/astronaut.glb')
useGLTF.preload('/dog.glb')
useGLTF.preload('/duck.glb')
useGLTF.preload('/human.glb')
