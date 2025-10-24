'use client'

import { useLenisScroller } from '@/hooks/useLenisScroller'

const WORKS_COPY = `In response to the Scarborough Town Centre gateway commission, Ranbir proposed Scarborough Rising: a pair of mirror-polished stainless steel balloons flanking the pedestrian mews. Their reflective skins merge viewers with the horizon, embodying liberation and civic optimism. The work is currently in development for installation from 2025 through 2027.`

export default function WorksPage() {
  useLenisScroller()

  return (
    <main className='relative min-h-screen w-full bg-black text-white'>
      <section className='mx-auto max-w-5xl px-6 py-24 md:px-10 lg:py-32'>
        <div className='space-y-6'>
          <h1 className='text-sm font-semibold uppercase tracking-[0.6em] text-white/50'>Works</h1>
          <p className='text-xl leading-relaxed text-white/80 md:text-2xl'>{WORKS_COPY}</p>
          <p className='text-sm uppercase tracking-[0.35em] text-white/40'>Comprehensive image archive available on the home page.</p>
        </div>
      </section>
    </main>
  )
}
