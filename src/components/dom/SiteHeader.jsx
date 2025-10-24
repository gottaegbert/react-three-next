'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Biography', href: '/biography' },
  { label: 'Studio Practice', href: '/studio-practice' },
  { label: 'Exhibitions', href: '/exhibitions' },
  { label: 'Commissions', href: '/commissions' },
  { label: 'Works', href: '/works' },
  { label: 'Shop', href: '/shop' },
  { label: 'Studio Contact', href: '/studio-contact' },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className='pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 sm:px-6 lg:px-12'>
      <div className='pointer-events-auto mt-4 flex w-full max-w-[min(98vw,1440px)] items-center gap-4 rounded-full border border-white/15 bg-black/70 px-4 py-3 text-white backdrop-blur-xl sm:px-6'>
        <Link
          href='/'
          className='shrink-0 text-[0.58rem] font-semibold uppercase tracking-[0.48em] text-white/80 transition hover:text-white sm:text-[0.62rem]'
        >
          Ranbir Studio
        </Link>
        <nav className='flex flex-1 items-center justify-center gap-1.5 overflow-x-auto whitespace-nowrap px-1'>
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href
            const isCTA = label === 'Shop' || label === 'Studio Contact'
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'rounded-full px-3 py-1 text-[0.56rem] uppercase tracking-[0.32em] transition sm:px-4 sm:text-[0.6rem]',
                  isCTA
                    ? 'border border-white/20 bg-white/15 text-white hover:border-white hover:bg-white/25'
                    : 'text-white/60 hover:bg-white/10 hover:text-white',
                  active && !isCTA ? 'bg-white/20 text-white' : '',
                  active && isCTA ? 'border-white bg-white text-black hover:bg-white/90' : '',
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
