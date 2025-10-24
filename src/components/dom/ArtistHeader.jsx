'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

const defaultNavItems = [
  'Home',
  'About',
  'Biography',
  'Studio Practice',
  'Exhibitions',
  'Commissions',
  'Works',
  'Shop',
  'Contact',
]

const actionItems = new Set(['Commissions', 'Shop', 'Contact'])

const navRoutes = {
  Home: '/',
  About: '/about',
  Biography: '/biography',
  'Studio Practice': '/studio-practice',
  Exhibitions: '/exhibitions',
  Commissions: '/commissions',
  Works: '/works',
  Shop: '/shop',
  'Studio Contact': '/studio-contact',
}

const labelToHref = (label) => navRoutes[label] ?? `/${label.toLowerCase().replace(/\s+/g, '-')}`

export function ArtistHeader({
  navItems = defaultNavItems,
  name = 'Ranbir Studio',
  subtitle = 'Contemporary Artist',
  className,
  style,
}) {
  const primaryLinks = navItems.filter((item) => !actionItems.has(item))
  const primaryAnchors = primaryLinks.map((label) => ({
    label,
    href: labelToHref(label),
  }))

  const actionAnchors = navItems
    .filter((item) => actionItems.has(item))
    .map((label) => ({
      label,
      href: labelToHref(label),
    }))

  return (
    <header
      className={cn(
        'pointer-events-auto fixed left-0 right-0 top-4 z-40 flex w-full justify-center px-4 transition-all duration-500 ease-out sm:top-6 sm:px-6 lg:px-12',
        className,
      )}
      style={style}
    >
      <div className='relative w-full max-w-[min(98vw,1440px)] overflow-hidden rounded-[22px] border border-white/[0.18] px-5 py-4 sm:px-7 sm:py-5 lg:max-w-[min(94vw,1580px)] lg:px-10 lg:py-6'>
        <div className='absolute inset-[1.25px] overflow-hidden border border-white/[0.08] opacity-60' aria-hidden />
        <div className='relative flex flex-wrap items-center justify-between gap-5 sm:flex-nowrap sm:gap-8'>
          <div className='min-w-44 flex-1 sm:flex-none'>
            <span className='block text-[0.64rem] font-semibold uppercase tracking-[0.46em] text-white/85 sm:text-[0.68rem]'>
              {name}
            </span>
            {subtitle ? (
              <span className='mt-1 block text-[0.62rem] uppercase tracking-[0.34em] text-white/45 sm:text-[0.64rem]'>
                {subtitle}
              </span>
            ) : null}
          </div>

          {primaryAnchors.length ? (
            <nav className='flex-1'>
              <div className='flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-1 text-[0.64rem] uppercase tracking-[0.32em] text-white/65 sm:gap-x-5 sm:gap-y-2.5 sm:text-[0.7rem] lg:gap-x-6 lg:text-[0.76rem]'>
                {primaryAnchors.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className='group relative px-3 py-1.5 transition duration-200 hover:text-white'
                  >
                    <span>{label}</span>
<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
              <span className='pointer-events-none absolute inset-x-2 bottom-1 h-px origin-left scale-x-0 bg-white/80 transition-transform duration-200 ease-out group-hover:scale-x-100' />
                  </Link>
=======
=======
>>>>>>> theirs
=======
>>>>>>> theirs
                    <span className='pointer-events-none absolute inset-x-2 bottom-1 h-px origin-left scale-x-0 bg-white/80 transition-transform duration-200 ease-out group-hover:scale-x-100' />
                  </a>
>>>>>>> theirs
                ))}
              </div>
            </nav>
          ) : null}

          {actionAnchors.length ? (
            <div className='flex flex-1 items-center justify-end gap-2.5 sm:flex-none'>
              {actionAnchors.map(({ label, href }) => {
                const baseClasses =
                  'inline-flex items-center justify-center rounded-full border px-5 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.34em] transition sm:text-[0.7rem]'

                const variant =
                  label === 'Contact'
                    ? 'border-white bg-white text-black hover:bg-white/90'
                    : label === 'Commissions'
                      ? 'border-white/25 bg-white/15 text-white hover:bg-white/25'
                      : 'border-transparent bg-transparent text-white/70 hover:text-white'

                return (
                  <Link key={label} href={href} className={cn(baseClasses, variant)}>
                    {label}
                  </Link>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
