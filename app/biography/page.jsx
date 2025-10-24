'use client'

import Image from 'next/image'
import { useLenisScroller } from '@/hooks/useLenisScroller'

export default function BiographyPage() {
  useLenisScroller()

  return (
    <main className='relative min-h-screen w-full bg-black text-white'>
      <section className='mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:px-10 lg:gap-16 lg:py-32'>
        <div className='relative aspect-[3/4] overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-sm'>
          <Image
            src='/img/artworks/XT5F1127.jpeg'
            alt='Ranbir studio self-portrait reflection'
            fill
            sizes='(max-width: 1024px) 90vw, 35vw'
            className='object-cover'
            priority
          />
        </div>
        <div className='space-y-6 text-xl leading-relaxed text-white/80 md:text-2xl'>
          <h1 className='text-sm font-semibold uppercase tracking-[0.6em] text-white/50'>Biography</h1>
          <p>
            Ranbir, a visionary sculptor, transforms metal and light into ethereal landscapes, bridging the tangible and
            transcendent. Born in Manchester and raised in Scarborough, his fusion of two decades of technical mastery
            with artistic exploration yields immersive, reflective environments.
          </p>
          <p>
            Inspired by exploration of art through global travel and spiritual resonance, his work echoes post-war
            abstraction’s pursuit of the ineffable, crafting stainless steel into portals of perception.
          </p>
          <p className='text-base text-white/60 md:text-lg'>
            The artist’s Instagram journal documents this journey: field recordings of light, rehearsals with fabricators,
            and the mirrored portraits that punctuate each completed piece.
          </p>
        </div>
      </section>
    </main>
  )
}
