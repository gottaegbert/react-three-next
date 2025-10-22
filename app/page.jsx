/* eslint-disable tailwindcss/no-custom-classname */
'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { Leva, useControls } from 'leva'
import { cn } from '@/lib/utils'

const modelOptions = [
  { id: 'B', label: 'Sculpture🗿', url: '/B.glb' },
  { id: 'pistol', label: 'Pistol🔫', url: '/Pistol.glb' },
    {id:'AK',label:'AK🔥',url:'/AssaultRifle.glb'},
  { id: 'astronaut', label: 'Astronaut🧑‍🚀', url: '/astronaut.glb' },
  { id: 'dog', label: 'Dog🐶', url: '/dog.glb' },
  { id: 'duck', label: 'Duck🦆', url: '/duck.glb' },
  { id: 'human', label: 'Human👱', url: '/human.glb' },
]

const DogParticles = dynamic(() => import('@/components/canvas/DogParticles').then((mod) => mod.DogParticles), {
  ssr: false,
})
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-white' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const {
    density,
    pointSize,
    breatheAmplitude,
    rotationSpeed,
    wobbleFrequency,
    surfaceJitter,
    color,
    forceStrength,
    forceFrequency,
    flowStrength,
    morphDuration,
  } = useControls(
    'Particles',
    {
      density: {
        value: 8.5,
        min: 0.25,
        max: 12,
        step: 0.25,
      },
      pointSize: {
        value: 0.01,
        min: 0.01,
        max: 0.12,
        step: 0.0025,
      },
      breatheAmplitude: {
        value: 0.08,
        min: 0,
        max: 0.3,
        step: 0.01,
      },
      rotationSpeed: {
        value: 0.25,
        min: 0,
        max: 1,
        step: 0.05,
      },
      wobbleFrequency: {
        value: 1.6,
        min: 0,
        max: 5,
        step: 0.1,
      },
      surfaceJitter: {
        value: 0,
        min: 0,
        max: 1,
        step: 0.05,
      },
      color: '#f7c873',
      forceStrength: {
        value: 0.6,
        min: 0,
        max: 2,
        step: 0.05,
      },
      forceFrequency: {
        value: 0.45,
        min: 0.05,
        max: 2.5,
        step: 0.05,
      },
      flowStrength: {
        value: 0.25,
        min: 0,
        max: 1.5,
        step: 0.05,
      },
      morphDuration: {
        value: 10,
        min: 1,
        max: 30,
        step: 1,
      },
    },
  )

  const [modelUrl, setModelUrl] = useState(modelOptions[0].url)
  const [selectedModelId, setSelectedModelId] = useState(modelOptions[0].id)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  const [uploadedName, setUploadedName] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [showModel, setShowModel] = useState(false)
  const [explode, setExplode] = useState(false)
  const [panelOpen, setPanelOpen] = useState(true)

  useEffect(() => () => {
    if (uploadedUrl) {
      URL.revokeObjectURL(uploadedUrl)
    }
  }, [uploadedUrl])

  const currentModelLabel = useMemo(() => {
    if (selectedModelId === 'upload' && uploadedName) {
      return uploadedName
    }
    const match = modelOptions.find((option) => option.id === selectedModelId)
    return match ? match.label : 'Custom Model'
  }, [selectedModelId, uploadedName])

  const handleSampleSelect = (option) => {
    if (!option) return
    if (uploadedUrl) {
      URL.revokeObjectURL(uploadedUrl)
      setUploadedUrl(null)
      setUploadedName('')
    }
    setUploadError('')
    setModelUrl(option.url)
    setSelectedModelId(option.id)
    setExplode(false)
  }

  const handleUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 3 * 1024 * 1024) {
      setUploadError('File too large. Please choose a GLTF/GLB model under 3MB.')
      event.target.value = ''
      return
    }

    const objectUrl = URL.createObjectURL(file)
    if (uploadedUrl) {
      URL.revokeObjectURL(uploadedUrl)
    }
    setUploadedUrl(objectUrl)
    setUploadedName(file.name)
    setModelUrl(objectUrl)
    setSelectedModelId('upload')
    setUploadError('')
    setExplode(false)
    event.target.value = ''
  }

  return (
    <main className='relative min-h-screen w-full overflow-hidden bg-black text-white'>
      <Leva collapsed />

      <div className='relative h-screen w-full'>
        <div className='pointer-events-none fixed inset-x-0 top-6 z-30 flex justify-center px-4 sm:justify-start sm:px-6'>
          <div
            className={cn(
              'pointer-events-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-black/70 shadow-lg backdrop-blur-xl transition-all duration-300',
              panelOpen ? 'p-4' : 'p-3',
            )}
          >
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60'>Examples</p>
                <p className='mt-0.5 text-[10px] uppercase tracking-[0.24em] text-white/35'>
                  Current Model: {currentModelLabel}
                </p>
              </div>
              <button
                type='button'
                onClick={() => setPanelOpen((prev) => !prev)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.28em] transition',
                  panelOpen
                    ? 'border-white/25 bg-white/15 text-white hover:bg-white/25'
                    : 'border-white bg-white text-black hover:bg-white/90',
                )}
                aria-expanded={panelOpen}
              >
                {panelOpen ? 'Collapse' : 'Expand'}
              </button>
            </div>

            <div
              className={cn(
                'transition-[max-height,opacity] duration-500 ease-out',
                panelOpen ? 'max-h-[520px] opacity-100' : 'pointer-events-none max-h-0 opacity-0',
              )}
            >
              <div className='flex flex-col gap-5 pt-3'>
                <div className='-m-1 flex flex-wrap items-center gap-2 overflow-hidden'>
                  <div className='flex flex-1 flex-wrap items-center gap-2'>
                    {modelOptions.map((option) => (
                      <button
                        key={option.id}
                        type='button'
                        onClick={() => handleSampleSelect(option)}
                        className={cn(
                          ' border px-2 py-2 text-[10px]  tracking-[0.28em] transition sm:text-[11px]',
                          selectedModelId === option.id
                            ? 'border-white bg-white text-black hover:bg-white/90 hover:text-black'
                            : 'border-white/18 text-white/65 hover:bg-white/10 hover:text-white',
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='flex flex-wrap items-center gap-3'>
                  <button
                    type='button'
                    onClick={() => setShowModel((prev) => !prev)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] transition sm:text-[11px]',
                      showModel
                        ? 'border-white bg-white text-black hover:bg-white/90'
                        : 'border-white/20 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white',
                    )}
                  >
                    {showModel ? 'Hide Mesh' : 'Show Mesh'}
                  </button>
                  <button
                    type='button'
                    onClick={() => setExplode((prev) => !prev)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] transition sm:text-[11px]',
                      explode
                        ? 'border-white bg-white text-black hover:bg-white/90'
                        : 'border-white/20 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white',
                    )}
                  >
                    {explode ? 'Assemble🫶' : 'Explode💥'}
                  </button>
                  <label className='inline-flex cursor-pointer items-center rounded-full border border-dashed border-cyan-400/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 transition hover:border-white/45 hover:text-white sm:text-[11px]'>
                    Upload GLB Model 🧱
                    <input
                      type='file'
                      accept='.glb,.gltf,model/gltf-binary,model/gltf+json'
                      className='hidden'
                      onChange={handleUpload}
                    />
                  </label>
                  <span className='text-[10px] tracking-[0.24em] text-white/60 sm:text-[11px]'>
                    Supports GLB/GLTF · Max 3MB
                  </span>
                  <span className='text-[10px] tracking-[0.24em] text-white/60 sm:text-[11px]'>
                    Download models from{' '}
                    <a className='text-cyan-300 underline-offset-4 hover:underline' href='https://poly.pizza/explore'>
                      poly pizza
                    </a>{' '}
                    and upload here to see them in particles
                  </span>
                  {selectedModelId === 'upload' && uploadedName ? (
                    <span className='rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/60 sm:text-[11px]'>
                      {uploadedName}
                    </span>
                  ) : null}
                </div>

                {uploadError ? (
                  <p className='text-[10px] font-semibold uppercase tracking-[0.24em] text-red-300'>{uploadError}</p>
                ) : null}

                <p className='text-[10px] uppercase tracking-[0.24em] text-white/50 sm:text-[11px]'>
                  Made by{' '}
                  <a
                    href='https://bento.me/siyuhu'
                    target='_blank'
                    rel='noreferrer'
                    className='text-cyan-300 underline-offset-4 hover:underline'
                  >
                    Siyu
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <View className='absolute inset-0 size-full' orbit>
          <Suspense fallback={null}>
            <DogParticles
              density={density}
              pointSize={pointSize}
              color={color}
              breatheAmplitude={breatheAmplitude}
              rotationSpeed={rotationSpeed}
              wobbleFrequency={wobbleFrequency}
              surfaceJitter={surfaceJitter}
              forceStrength={forceStrength}
              forceFrequency={forceFrequency}
              flowStrength={flowStrength}
              morphDuration={morphDuration}
              scale={2}
              modelUrl={modelUrl}
              showModel={showModel}
              explode={explode}
            />
            <Common color='#000000' />
          </Suspense>
        </View>

      </div>
    </main>
  )
}
