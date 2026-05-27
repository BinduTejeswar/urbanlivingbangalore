'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Marquee from './Marquee'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, ChevronRight } from 'lucide-react'

const heroImages = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2400&h=1500&q=82",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&h=1500&q=82",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2400&h=1500&q=82",
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2400&h=1500&q=82",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2400&h=1500&q=82",
]

export default function Hero() {
  const backgroundImages = useMemo(() => heroImages, [])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const activeImage = backgroundImages[activeImageIndex % backgroundImages.length]
  const backgroundMessages = [
    'Zero Brokerage',
    'Owner Listed',
    'Ready to Move',
    'Verified Homes',
    'Better Locations',
    'Managed Flats',
  ]

  useEffect(() => {
    if (backgroundImages.length < 2) return

    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % backgroundImages.length)
    }, 6500)

    return () => window.clearInterval(interval)
  }, [backgroundImages.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#0F0D0C] transition-colors duration-500">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1.035 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{
              opacity: { duration: 1.2, ease: "easeInOut" },
              scale: { duration: 6.5, ease: "easeInOut" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={activeImage}
              alt=""
              fill
              priority={activeImageIndex === 0}
              sizes="100vw"
              className="object-cover object-center opacity-90 saturate-105"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/15 to-[#0F0D0C]/80"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,13,12,0.72),rgba(15,13,12,0.34)_42%,rgba(15,13,12,0.08)_72%)]"></div>

        <div aria-hidden="true" className="absolute inset-0 overflow-hidden opacity-25 [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_76%,transparent)]">
          {[0, 1, 2].map((row) => (
            <motion.div
              key={row}
              animate={{ x: row % 2 === 0 ? ['0%', '-33.333%'] : ['-33.333%', '0%'] }}
              transition={{
                duration: 34 + row * 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className={[
                "absolute flex w-max whitespace-nowrap text-white/15 drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)]",
                "font-black uppercase tracking-[0.26em]",
                row === 0 ? "top-[18%] text-2xl md:text-5xl -rotate-6" : "",
                row === 1 ? "top-[44%] text-xl md:text-4xl rotate-3" : "",
                row === 2 ? "top-[68%] text-2xl md:text-6xl -rotate-3" : "",
              ].join(' ')}
            >
              {[...backgroundMessages, ...backgroundMessages, ...backgroundMessages].map((message, index) => (
                <span key={`${message}-${row}-${index}`} className="mx-8 md:mx-12">
                  {message}
                </span>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 py-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex -translate-y-2 items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-xl shadow-black/25 text-white border border-white/20"
        >
          <Heart className="w-3 h-3 fill-primary" /> Find Your Home
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] mb-7 tracking-tighter text-white drop-shadow-[0_3px_20px_rgba(0,0,0,0.75)]"
        >
          Find a Home <br/>
          <span className="text-[#D4A373]">Without the Brokerage.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-2xl text-white mb-12 leading-relaxed max-w-2xl mx-auto font-bold drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)]"
        >
          <span className="bg-black/40 box-decoration-clone px-1.5 rounded-md">
            Owner-listed flats. No agents, no stress.
          </span>
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/flats"
            className="group bg-primary text-white px-10 py-5 rounded-[2rem] font-black hover:bg-orange-600 transition-all text-sm md:text-lg shadow-2xl shadow-orange-900/40 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            Browse Flats
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Signboard Marquee at the bottom */}
      <div className="absolute bottom-0 left-0 w-full mb-12">
        <Marquee />
      </div>
    </section>
  )
}
