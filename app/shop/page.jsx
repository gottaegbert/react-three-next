'use client'

import { useLenisScroller } from '@/hooks/useLenisScroller'

export default function ShopPage() {
  useLenisScroller()

  return (
    <main className='relative min-h-screen w-full bg-black text-white'>
      <section className='mx-auto flex max-w-4xl flex-col gap-8 px-6 py-24 md:px-10 lg:py-32'>
        <h1 className='text-sm font-semibold uppercase tracking-[0.6em] text-white/50'>Shop</h1>
        <p className='text-3xl font-medium leading-tight text-white md:text-4xl'>Collectors Editions &amp; Maquettes</p>
        <p className='text-base leading-relaxed text-white/70 md:text-lg'>
          Limited stainless maquettes and signed photographic editions are released in seasonal capsules. Join the
          collector’s ledger to receive previews, studio commentary, and production updates before each release.
        </p>
        <div className='rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur'>
          <p className='text-sm uppercase tracking-[0.4em] text-white/50'>Next Capsule</p>
          <p className='mt-3 text-lg font-semibold text-white'>Edition 03 — “Mirror Bloom Study” shipping Spring 2025</p>
        </div>
        <a
          href='/studio-contact'
          className='inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:border-white hover:bg-white/10'
        >
          Request Catalogue
        </a>
      </section>
    </main>
  )
}
