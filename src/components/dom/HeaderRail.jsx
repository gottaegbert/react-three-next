'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const defaultNav = [
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

const ctaItems = new Set(['Shop', 'Contact'])

export function HeaderRail({
  name = 'Ranbir',
  subtitle,
  navItems = defaultNav,
  className,
}) {
  const primaryLinks = navItems.filter((item) => !ctaItems.has(item))
  const actionLinks = navItems.filter((item) => ctaItems.has(item))

  return (
    <aside
      className={cn(
        'pointer-events-auto fixed bottom-6 left-1/2 z-30 flex w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-8xl xl:max-w-8xl -translate-x-1/2 justify-center px-4 sm:px-6',
        className,
      )}
    >
      <div className='flex w-full items-center gap-4 rounded-full border border-white/15 bg-black/70 px-4 py-3 text-white backdrop-blur-xl sm:px-6'>
        <div className='min-w-[96px] flex-1 sm:flex-none'>
          <span className='block text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75'>
            {name}
          </span>
          {subtitle ? (
            <span className='mt-1 block text-[9px] uppercase tracking-[0.34em] text-white/40'>
              {subtitle}
            </span>
          ) : null}
        </div>

        <Separator orientation='vertical' className='hidden h-9 bg-white/15 sm:block' />

        <nav className='flex flex-1 items-center justify-center gap-1.5 overflow-x-auto whitespace-nowrap px-1'>
          {primaryLinks.map((item) => (
            <Button
              key={item}
              variant='ghost'
              className='rounded-full px-4 py-2 text-[10px] tracking-[0.32em] text-white/70 hover:bg-white/10 hover:text-white sm:px-5 sm:text-[11px]'
            >
              {item}
            </Button>
          ))}
        </nav>

        {actionLinks.length > 0 ? (
          <>
            <Separator orientation='vertical' className='hidden h-9 bg-white/15 sm:block' />
            <div className='flex items-center gap-2'>
              {actionLinks.map((item) => (
                <Button
                  key={item}
                  className={cn(
                    'px-5 py-2 text-[10px] tracking-[0.3em] sm:text-[11px]',
                    item === 'Contact'
                      ? 'border-white bg-white text-black hover:bg-white/90'
                      : 'border-white/25 bg-white/15 text-white hover:bg-white/25',
                  )}
                >
                  {item}
                </Button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </aside>
  )
}
