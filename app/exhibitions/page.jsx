'use client'

import { useLenisScroller } from '@/hooks/useLenisScroller'

export default function ExhibitionsPage() {
  useLenisScroller()

  return (
    <main className='relative min-h-screen w-full bg-black text-white'>
      <section className='mx-auto max-w-5xl px-6 py-24 md:px-10 lg:py-32'>
        <h1 className='text-sm font-semibold uppercase tracking-[0.6em] text-white/50'>Exhibitions</h1>
        <p className='mt-8 text-xl leading-relaxed text-white/80 md:text-2xl'>
          Art Gallery of Ontario — forthcoming presentation within the AGO philanthropic programme, debuting mirror-finish interventions that explore reflection, disappearance, and civic generosity. Additional exhibition announcements will follow as the studio schedule evolves.
        </p>
      </section>
    </main>
  )
}
