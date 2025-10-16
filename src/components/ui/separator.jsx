'use client'

import { cn } from '@/lib/utils'

const orientationClasses = {
  horizontal: 'h-px w-full',
  vertical: 'w-px h-full',
}

export function Separator({ className, orientation = 'horizontal' }) {
  return (
    <div
      role='separator'
      aria-orientation={orientation}
      className={cn(
        'bg-white/15',
        orientationClasses[orientation] ?? orientationClasses.horizontal,
        className,
      )}
    />
  )
}

