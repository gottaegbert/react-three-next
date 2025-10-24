'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_ARTWORKS = [
  { src: '/img/artworks/IMG_2474.jpeg', title: 'Scarborough Rising — Balloon Study' },
  { src: '/img/artworks/XT5F1056.jpeg', title: 'Scarborough Rising — Gateway Elevation' },
  { src: '/img/artworks/XT5F1062.jpeg', title: 'Picasso Series — Stainless Detail' },
  { src: '/img/artworks/XT5F1070.jpeg', title: 'Picasso Series — Mirror Plane' },
  { src: '/img/artworks/XT5F1074.jpeg', title: 'Robotic Flower — Assembly' },
  { src: '/img/artworks/XT5F1081.jpeg', title: 'Robotic Flower — Motion Bloom' },
  { src: '/img/artworks/XT5F1096.jpeg', title: 'Dastur Bunga — Reflective Facet' },
  { src: '/img/artworks/XT5F1127.jpeg', title: 'Dastur Bunga — Light Field' },
  { src: '/img/artworks/XT5F1143.jpeg', title: 'Balancing Act — AGO Edition' },
  { src: '/img/artworks/XT5F1154.jpeg', title: 'Balancing Act — Process Study' },
]

export function ArtworkGallery({ container, lenis, items = DEFAULT_ARTWORKS }) {
  const sectionRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    if (!gridRef.current || !lenis) return

    const grid = gridRef.current
    const gridWrap = grid.querySelector('.grid-wrap')
    const gridItems = grid.querySelectorAll('.grid__item')

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: gridWrap,
        scroller: container ?? undefined,
        start: 'top bottom+=5%',
        end: 'bottom top-=5%',
        scrub: true,
      },
    })

    grid.style.setProperty('--grid-width', '105%')
    grid.style.setProperty('--grid-columns', '8')
    grid.style.setProperty('--perspective', '1500px')
    grid.style.setProperty('--grid-inner-scale', '0.5')
    grid.style.setProperty('--grid-item-ratio', '1.5')
    grid.style.setProperty('--grid-gap', '4vw')

    timeline
      .set(gridItems, {
        transformOrigin: '50% 0%',
        z: () => gsap.utils.random(-5000, -2000),
        rotationX: () => gsap.utils.random(-65, -25),
        filter: 'brightness(0%)',
      })
      .to(
        gridItems,
        {
          xPercent: () => gsap.utils.random(-150, 150),
          yPercent: () => gsap.utils.random(-300, 300),
          rotationX: 0,
          filter: 'brightness(200%)',
        },
        0,
      )
      .to(
        gridWrap,
        {
          z: 6500,
        },
        0,
      )
      .fromTo(
        gridItems,
        { scale: 2 },
        { scale: 0.5 },
        0,
      )

    ScrollTrigger.refresh()

    return () => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
    }
  }, [container, lenis])

  return (
    <section ref={sectionRef} className='relative w-full bg-black py-[22vh] text-white'>
      <div className='mx-auto max-w-4xl px-6 text-center md:px-10'>
        <h2 className='text-sm font-semibold uppercase tracking-[0.6em] text-white/50'>Compositions Archive</h2>
        <p className='mt-6 text-3xl font-medium leading-tight text-white md:text-4xl lg:text-[2.8rem]'>
          Material studies captured in the atelier, each frame a fragment of light and stainless resonance.
        </p>
      </div>

      <div
        ref={gridRef}
        className='artwork-grid relative mx-auto mt-20 w-full px-6'
        style={{
          '--grid-width': '105%',
          '--grid-columns': '8',
          '--grid-gap': '4vw',
          '--perspective': '1500px',
          '--grid-item-ratio': '1.5',
          '--grid-inner-scale': '0.5',
        }}
      >
        <div
          className='grid-wrap mx-auto grid place-items-center'
          style={{
            width: 'var(--grid-width)',
            gap: 'var(--grid-gap)',
            gridTemplateColumns: 'repeat(var(--grid-columns), minmax(0, 1fr))',
            perspective: 'var(--perspective)',
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item) => (
            <div key={item.src} className='grid__item transform-gpu'>
              <div className='grid__item-inner transition-transform duration-700'>
                <img
                  src={item.src}
                  alt={item.title || ''}
                  className='h-full w-full object-contain'
                  loading='lazy'
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
