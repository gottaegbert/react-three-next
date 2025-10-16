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
  const { density, pointSize, breatheAmplitude, rotationSpeed, wobbleFrequency, surfaceJitter, color } = useControls(
    'Particles',
    {
      density: {
        value: 1.9,
        min: 0.25,
        max: 6,
        step: 0.25,
      },
      pointSize: {
        value: 0.02,
        min: 0.005,
        max: 0.06,
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
    },
  )

  return (
    <main className='relative min-h-screen w-full overflow-hidden bg-black text-white'>
      <Leva collapsed />
      <div className='relative flex min-h-screen w-full items-center justify-center px-4 py-12'>
        <View className='relative h-[70vh] w-full max-w-5xl'>
          <Suspense fallback={null}>
            <DogParticles
              density={density}
              pointSize={pointSize}
              color={color}
              breatheAmplitude={breatheAmplitude}
              rotationSpeed={rotationSpeed}
              wobbleFrequency={wobbleFrequency}
              surfaceJitter={surfaceJitter}
              scale={2}
            />
            <Common color='#000000' />
          </Suspense>
        </View>
      </div>
    </main>
  )
}
