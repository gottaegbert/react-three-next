'use client'

import Image from 'next/image'
import { useLenisScroller } from '@/hooks/useLenisScroller'

export default function AboutPage() {
  useLenisScroller()

  return (
    <main className='relative min-h-screen w-full bg-black text-white'>
      <section className='mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:px-10 lg:gap-16 lg:py-32'>
        <div>
          <h1 className='text-sm font-semibold uppercase tracking-[0.6em] text-white/50'>About</h1>
          <p className='mt-8 text-3xl font-medium leading-tight text-white md:text-4xl lg:text-[2.8rem]'>
            Ranbir’s practice distils material into experience: stainless steel becomes a vessel for the absolute,
            dissolving the visible into unseen dimensions. Working at the threshold of material and immaterial, Ranbir
            fuses technical rigour with metaphysical longing, creating spaces where reflection and disappearance are one.
          </p>
          <p className='mt-6 text-base leading-relaxed text-white/70 md:text-lg'>
            The studio operates as both laboratory and sanctuary: material studies transition from rough steel to
            mirror-finish clarity, each surface archiving the gestures, heat, and intention of its making.
          </p>
        </div>
        <div className='relative aspect-[4/5] overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-sm'>
          <Image
            src='/img/artworks/XT5F1056.jpeg'
            alt='Studio reflection with balloon maquette'
            fill
            sizes='(max-width: 1024px) 90vw, 40vw'
            className='object-cover'
            priority
          />
        </div>
      </section>
    </main>
  )
}
