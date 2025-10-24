'use client'

import { useLenisScroller } from '@/hooks/useLenisScroller'

export default function StudioContactPage() {
  useLenisScroller()

  return (
    <main className='relative min-h-screen w-full bg-black text-white'>
      <section className='mx-auto max-w-5xl px-6 py-24 md:px-10 lg:py-32'>
        <h1 className='text-sm font-semibold uppercase tracking-[0.6em] text-white/50'>Studio Contact</h1>
        <p className='mt-8 max-w-3xl text-xl leading-relaxed text-white/80 md:text-2xl'>
          For commissions, exhibitions, and collaborations, please share a brief below. The studio replies within five
          working days and routes all enquiries through this form to maintain focus and protect client privacy.
        </p>
        <form className='mt-12 grid gap-5 text-sm text-white/80 md:grid-cols-2'>
          <label className='flex flex-col gap-2 md:col-span-1'>
            <span className='uppercase tracking-[0.35em] text-white/50'>Name</span>
            <input
              type='text'
              placeholder='Your name'
              className='rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/40 focus:ring-0'
            />
          </label>
          <label className='flex flex-col gap-2 md:col-span-1'>
            <span className='uppercase tracking-[0.35em] text-white/50'>Email</span>
            <input
              type='email'
              placeholder='you@example.com'
              className='rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/40 focus:ring-0'
            />
          </label>
          <label className='flex flex-col gap-2 md:col-span-2'>
            <span className='uppercase tracking-[0.35em] text-white/50'>Project Focus</span>
            <input
              type='text'
              placeholder='Commission, exhibition, collaboration...'
              className='rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/40 focus:ring-0'
            />
          </label>
          <label className='flex flex-col gap-2 md:col-span-2'>
            <span className='uppercase tracking-[0.35em] text-white/50'>Message</span>
            <textarea
              rows={5}
              placeholder='Share your timeline, site, and any references.'
              className='rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-white/40 focus:ring-0'
            />
          </label>
          <div className='md:col-span-2'>
            <button
              type='submit'
              onClick={(event) => event.preventDefault()}
              className='inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:border-white hover:bg-white/10'
            >
              Submit Enquiry
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
