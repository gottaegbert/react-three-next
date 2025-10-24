'use client'

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const toChars = (text) =>
  text.split('').map((char) => {
    if (char === ' ') return '\u00A0'
    if (char === '\n') return '\u00A0'
    return char
  })

export function ScrollVerse({
  container,
  text = `Ranbir’s practice distils material into experience: stainless steel becomes a vessel for the absolute, dissolving the visible into unseen dimensions.`,
}) {
  const verseRef = useRef(null)
  const charsRef = useRef([])

  useEffect(() => {
    charsRef.current = []
  }, [container, text])

  const characters = useMemo(() => toChars(text), [text])

  useLayoutEffect(() => {
    if (!verseRef.current) return

    const chars = charsRef.current.filter(Boolean)
    if (!chars.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        {
          scaleY: 0.1,
          scaleX: 1.8,
          filter: 'blur(12px) brightness(50%)',
          transformOrigin: '50% 50%',
        },
        {
          scaleY: 1,
          scaleX: 1,
          filter: 'blur(0px) brightness(100%)',
          ease: 'none',
          stagger: {
            each: 0.05,
            from: 'start',
          },
          scrollTrigger: {
            trigger: verseRef.current,
            scroller: container ?? undefined,
            start: 'top bottom-=12%',
            end: 'bottom center+=10%',
            scrub: true,
          },
        },
      )
    }, verseRef)

    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [characters, container])

  return (
    <section ref={verseRef} id='scroll-verse-anchor' className='relative w-full bg-black py-[28vh] text-white'>
      <div className='mx-auto max-w-5xl px-6 text-center md:px-10 lg:px-16'>
        <p className='flex flex-wrap items-end justify-center gap-y-4 text-2xl font-medium leading-tight text-white/90 md:text-4xl lg:text-[2.8rem]'>
          {characters.map((char, index) => (
            <span
              key={`${char}-${index}`}
              ref={(el) => {
                charsRef.current[index] = el
              }}
              className='inline-block will-change-transform'
            >
              {char}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
