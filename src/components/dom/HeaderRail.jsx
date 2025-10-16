'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const defaultNav = ['About', 'Biography', 'Contact']

export function HeaderRail({
  name = 'Ranbir',
  navItems = defaultNav,
  className,
}) {
  return (
    <aside
      className={cn(
        'pointer-events-auto absolute top-1/2 z-30 flex w-[60px] -translate-y-1/2 flex-col overflow-hidden  border border-white/12 bg-black/55 px-4 py-8 text-white backdrop-blur-md',
        className,
      )}
    >
      <div className='flex flex-col items-center gap-4'>
        <span
          className='text-[14px] font-semibold uppercase tracking-[0.4em] text-white/80'
          style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
        >
          {name}
        </span>
       
      </div>

      <Separator orientation='vertical' className='mx-auto my-6 h-24  bg-white/25' />

      <div className='  flex flex-col'>
        {navItems.map((item) => (
          <Button
            key={item}
            variant='ghost'
            className='border-white/12 flex-0 flex h-56 flex-col items-center justify-center border-b text-white/70 last:border-b-0'
          >
            <span
              className='text-[14px] font-semibold tracking-[0.28em] transition group-hover:text-white'
              style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
            >
              {item}
            </span>
          </Button>
          
        ))}
      </div>

     
    </aside>
  )
}

