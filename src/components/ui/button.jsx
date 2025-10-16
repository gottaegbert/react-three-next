'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const baseStyles =
  'inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-white/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black'

const variants = {
  default: baseStyles,
  ghost:
    'inline-flex items-center justify-center rounded-none border-none bg-transparent px-0 py-0 text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
}

export const Button = forwardRef(function Button({ className, variant = 'default', ...props }, ref) {
  return <button ref={ref} className={cn(variants[variant] ?? baseStyles, className)} {...props} />
})

