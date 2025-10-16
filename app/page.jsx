/* eslint-disable tailwindcss/no-custom-classname */
'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Leva, useControls } from 'leva'

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
        value: 2.6,
        min: 0.25,
        max: 12,
        step: 0.25,
      },
      pointSize: {
        value: 0.035,
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

  return (
    <main className='relative min-h-screen w-full overflow-hidden bg-black text-white'>
      <Leva collapsed />
      <div className='relative flex min-h-screen w-full items-center justify-center px-4 py-12'>
        <View className='relative h-screen w-full max-w-5xl' orbit>
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
            />
            <Common color='#000000' />
          </Suspense>
        </View>
      </div>
    </main>
  )
}
