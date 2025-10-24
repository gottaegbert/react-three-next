'use client'

import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className='mt-auto bg-black py-20 text-white/60'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:flex-row md:items-start md:justify-between md:px-12'>
        <div className='space-y-3 text-sm uppercase tracking-[0.4em] text-white/40'>
          <span>Ranbir Studio</span>
          <p className='text-xs tracking-[0.32em] text-white/30'>Scarborough · Canada · Working internationally</p>
        </div>
        <div className='grid gap-6 text-sm text-white/65 md:grid-cols-2'>
          <div className='space-y-2'>
            <p className='uppercase tracking-[0.35em] text-white/40'>Commissions</p>
            <Link href='/commissions' className='block text-white/70 hover:text-white'>Scarborough Rising, 2025–2027</Link>
            <Link href='/works' className='block text-white/70 hover:text-white'>Studio Works Archive</Link>
          </div>
          <div className='space-y-2'>
            <p className='uppercase tracking-[0.35em] text-white/40'>Connect</p>
            <Link href='/studio-contact' className='block text-white/70 hover:text-white'>Studio Contact Form</Link>
            <a href='mailto:studio@ranbir.com' className='block text-white/70 hover:text-white'>studio@ranbir.com</a>
          </div>
        </div>
      </div>
      <div className='mx-auto mt-12 w-full max-w-6xl border-t border-white/10 px-6 pt-8 text-xs uppercase tracking-[0.32em] text-white/30 md:px-12'>
        © {new Date().getFullYear()} Ranbir Studio. Crafted in stainless steel &amp; light.
      </div>
    </footer>
  )
}
