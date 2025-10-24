'use client'

import { useLenisScroller } from '@/hooks/useLenisScroller'

const HIGHLIGHTS = [
  {
    label: 'Latest Commission',
    value: 'Scarborough Rising (Scarborough Balloons), 2025–2027',
  },
]

export default function CommissionsPage() {
  useLenisScroller()

  return (
    <main className='relative min-h-screen w-full bg-black text-white'>
      <section className='mx-auto max-w-5xl px-6 py-24 md:px-10 lg:py-32'>
        <h1 className='text-sm font-semibold uppercase tracking-[0.6em] text-white/50'>Commissions</h1>
        <p className='mt-8 text-xl leading-relaxed text-white/80 md:text-2xl'>
          Public, private, and institutional commissions are developed in close dialogue with architects, fabricators,
          and communities. Bespoke installations adapt stainless steel, robotics, and light to the topography of each
          site, forging reflective landmarks that invite collective contemplation.
        </p>
        <dl className='mt-12 grid gap-6 text-white/70 md:grid-cols-2'>
          {HIGHLIGHTS.map((item) => (
            <div key={item.label} className='rounded-2xl border border-white/10 bg-white/[0.04] p-6'>
              <dt className='text-xs uppercase tracking-[0.45em] text-white/50'>{item.label}</dt>
              <dd className='mt-3 text-lg font-semibold text-white'>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  )
}
