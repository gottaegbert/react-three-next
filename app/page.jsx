/* eslint-disable tailwindcss/no-custom-classname */
'use client'

import dynamic from 'next/dynamic'

const HeroScrollVideo = dynamic(() => import('@/components/dom/HeroScrollVideo').then((m) => m.HeroScrollVideo), {
  ssr: false,
})

export default function Page() {
  return (
    <main className='relative min-h-screen w-full overflow-hidden bg-black text-white'>
      <HeroScrollVideo src='/562.mp4' />
    </main>
  )
}
