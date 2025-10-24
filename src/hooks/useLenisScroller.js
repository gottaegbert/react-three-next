'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null
let rafId = null

export function useLenisScroller() {
  const [instance, setInstance] = useState(() => lenisInstance)

  useEffect(() => {
    const wrapper = document.querySelector('[data-scroll-container]')
    const content = wrapper?.firstElementChild
    if (!wrapper || !content) return

    if (!lenisInstance) {
      const lenis = new Lenis({
        wrapper,
        content,
        duration: 1.2,
        lerp: 0.12,
        smoothWheel: true,
        smoothTouch: false,
      })

      lenisInstance = lenis
      wrapper.__lenis = lenis

      const raf = (time) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)

      lenis.on('scroll', ScrollTrigger.update)

      ScrollTrigger.scrollerProxy(wrapper, {
        scrollTop(value) {
          if (arguments.length) {
            lenis.scrollTo(value, { immediate: true })
          }
          return lenis.scroll
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          }
        },
        pinType: wrapper.style.transform ? 'transform' : 'fixed',
      })

      ScrollTrigger.defaults({ scroller: wrapper })
      ScrollTrigger.refresh()
    }

    setInstance(lenisInstance)

    return () => {
      // Lenis stays active for the lifetime of the app; cleanup not required here.
    }
  }, [])

  return instance
}
