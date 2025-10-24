'use client'

import Image from 'next/image'
import { useLenisScroller } from '@/hooks/useLenisScroller'

export default function StudioPracticePage() {
  useLenisScroller()

  return (
    <main className='relative min-h-screen w-full bg-black text-white'>
      <section className='mx-auto max-w-6xl px-6 py-24 md:px-10 lg:py-32'>
        <h1 className='text-sm font-semibold uppercase tracking-[0.6em] text-white/50'>Studio Practice</h1>
        <div className='mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16'>
          <div className='space-y-6 text-xl leading-relaxed text-white/80 md:text-2xl'>
            <p>
              Ranbir's studio practice is a rigorous exploration of stainless steel, where two decades of technical
              expertise converge with a decade of artistic innovation. He transforms the industrial material into
              immersive sculptural and installation works that challenge perceptual boundaries, echoing the spiritual
              quests of post-war abstraction.
            </p>
            <p>
              Central to the process is the mastery of joint connectivity. Advanced adhesion techniques, precision
              welding, CNC machining, and meticulous finishing resolve structural demands into seamless, mirror-finish
              planes.
            </p>
            <p className='text-base text-white/60 md:text-lg'>
              Every commission begins on the fabrication floor—a choreography captured in his Instagram feed—where
              stainless is coaxed from raw plate into resonance with light.
            </p>
          </div>
          <div className='space-y-6'>
            <div className='relative aspect-[4/5] overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-sm'>
              <Image
                src='/img/artworks/XT5F1074.jpeg'
                alt='Robotic Flower welding sequence'
                fill
                sizes='(max-width: 1024px) 90vw, 40vw'
                className='object-cover'
              />
            </div>
            <div className='relative aspect-[4/5] overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-sm'>
              <Image
                src='/img/artworks/XT5F1096.jpeg'
                alt='Mirror finishing detail'
                fill
                sizes='(max-width: 1024px) 90vw, 40vw'
                className='object-cover'
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
