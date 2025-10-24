'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollVerse } from '@/components/dom/ScrollVerse'
import { ArtworkGallery } from '@/components/dom/ArtworkGallery'
import { useLenisScroller } from '@/hooks/useLenisScroller'

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const range = (t, a, b) => {
  if (t <= a) return 0
  if (t >= b) return 1
  return (t - a) / (b - a)
}

export function HeroScrollVideo({ src = '/562.mp4' }) {
  const videoRef = useRef(null)
  const [container, setContainer] = useState(null)
  const [scrollY, setScrollY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window === 'undefined' ? 1 : window.innerHeight,
  )
  const lenis = useLenisScroller()

  const sections = useMemo(
    () => ({
      video: 220,
    }),
    [],
  )

  const videoScrollDistance = useMemo(
    () => (sections.video / 100) * viewportHeight,
    [sections.video, viewportHeight],
  )
  useEffect(() => {
    const el = document.querySelector('[data-scroll-container]')
    setContainer(el)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => setViewportHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (lenis) {
      const handleScroll = ({ scroll }) => {
        setScrollY(scroll)
      }
      setScrollY(lenis.scroll ?? 0)
      lenis.on('scroll', handleScroll)
      return () => lenis.off('scroll', handleScroll)
    }

    if (container) {
      setScrollY(container.scrollTop || 0)
    }
  }, [lenis, container])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const play = video.play()
    if (play && typeof play.catch === 'function') {
      play.catch(() => {})
    }
  }, [src])

  const videoProgress = useMemo(
    () => (videoScrollDistance <= 0 ? 1 : clamp(scrollY / videoScrollDistance)),
    [scrollY, videoScrollDistance],
  )

  const titleOpacity = range(videoProgress, 0.12, 0.45)
  const subOpacity = range(videoProgress, 0.28, 0.62)
  const captionOpacity = range(videoProgress, 0.5, 0.8)
  const titleTranslate = (1 - titleOpacity) * 42
  const subTranslate = (1 - subOpacity) * 48
  const captionTranslate = (1 - captionOpacity) * 54

  return (
    <div id='home' className='relative w-full'>
      <section className='sticky top-0 h-screen w-full'>
        <div className='absolute inset-0 bg-black' />
        <video
          ref={videoRef}
          src={src}
          className='absolute inset-0 size-full object-cover'
          autoPlay
          muted
          playsInline
          preload='auto'
        />

        <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-white md:px-10'>
          <span
            className='text-xs font-semibold uppercase tracking-[0.5em] text-white/60 md:text-sm'
            style={{
              opacity: captionOpacity,
              transform: `translateY(${captionTranslate}px)`,
            }}
          >
            Contemporary Motion Stories
          </span>
          <h1
            className='mt-6 max-w-4xl text-center text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl'
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleTranslate}px)`,
            }}
          >
            Immersive Art Direction For Digital Worlds
          </h1>
          <p
            className='mt-6 max-w-2xl text-center text-base text-white/80 md:text-lg'
            style={{
              opacity: subOpacity,
              transform: `translateY(${subTranslate}px)`,
            }}
          >
            Scroll to drift through the studio archive. As the film breathes, the experience unfolds in layers of light
            and particles.
          </p>
        </div>
      </section>

      <ScrollVerse container={container} />
      <ArtworkGallery container={container} lenis={lenis} />
    </div>
  )
}
