'use client'

import { urlForImage } from '@/sanity/lib/image'
import type { SanityImage } from '@/types'
import { getPropertyVideoEmbed } from '@/lib/utils'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageGalleryProps {
  images: SanityImage[]
  videoUrl?: string
}

type GallerySlide =
  | { type: 'image'; image: SanityImage }
  | { type: 'video'; platform: 'youtube' | 'instagram'; src: string }

export default function ImageGallery({ images, videoUrl }: ImageGalleryProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isHovering, setIsHovering] = useState(false)
  const [isPausedByClick, setIsPausedByClick] = useState(false)
  const galleryImages = useMemo(() => {
    const getImageArea = (image: SanityImage) => {
      const ref = image?.asset?._ref || ''
      const dimensions = ref.match(/-(\d+)x(\d+)-/)
      if (!dimensions) return 0
      return Number(dimensions[1]) * Number(dimensions[2])
    }

    return [...(images || [])].sort((a, b) => getImageArea(b) - getImageArea(a))
  }, [images])

  const videoEmbed = useMemo(() => (
    videoUrl ? getPropertyVideoEmbed(videoUrl) : null
  ), [videoUrl])

  const slides = useMemo<GallerySlide[]>(() => {
    const imageSlides: GallerySlide[] = galleryImages.map((image) => ({ type: 'image', image }))

    if (!videoEmbed) return imageSlides

    return [
      ...imageSlides,
      {
        type: 'video',
        platform: videoEmbed.platform,
        src: videoEmbed.src,
      },
    ]
  }, [galleryImages, videoEmbed])

  const currentSlide = slides[index]
  const next = useCallback(() => {
    setDirection(1)
    setIndex((current) => (current + 1) % slides.length)
  }, [slides.length])
  const advanceHoverSlide = useCallback(() => {
    setDirection(1)
    setIndex((current) => {
      const nextIndex = current + 1

      if (nextIndex >= slides.length) {
        setIsPausedByClick(true)
        return current
      }

      if (slides[nextIndex]?.type === 'video') {
        setIsPausedByClick(true)
      }

      return nextIndex
    })
  }, [slides])
  const prev = useCallback(() => {
    setDirection(-1)
    setIndex((current) => (current - 1 + slides.length) % slides.length)
  }, [slides.length])
  const goToSlide = (slideIndex: number) => {
    setDirection(slideIndex >= index ? 1 : -1)
    setIndex(slideIndex)
  }

  useEffect(() => {
    if (!isHovering || isPausedByClick || slides.length < 2) return

    let interval: number | undefined
    const startTimer = window.setTimeout(() => {
      advanceHoverSlide()
      interval = window.setInterval(advanceHoverSlide, 2500)
    }, 2500)

    return () => {
      window.clearTimeout(startTimer)
      if (interval) window.clearInterval(interval)
    }
  }, [advanceHoverSlide, isHovering, isPausedByClick, slides.length])

  if (slides.length === 0) return null

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-square overflow-hidden rounded-[1.25rem] border border-[#DDE8DD] bg-[#EEF4EE] shadow-xl shadow-slate-900/10 lg:aspect-[4/3]"
        onMouseEnter={() => {
          setIsPausedByClick(false)
          setIsHovering(true)
        }}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => setIsPausedByClick(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSlide.type}-${index}`}
            initial={{ opacity: 0, x: direction > 0 ? '38%' : '-38%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? '-38%' : '38%' }}
            transition={{ duration: 0.85, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            {currentSlide.type === 'image' ? (
              <Image
                src={urlForImage(currentSlide.image).width(900).quality(90).url()}
                alt={`Property image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 460px"
                className="object-cover"
                preload={index === 0}
                quality={90}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#101713] p-3">
                <div className={`relative overflow-hidden rounded-2xl bg-black ${
                  currentSlide.platform === 'instagram'
                    ? 'h-full aspect-[9/16]'
                    : 'w-full aspect-video'
                }`}>
                  <iframe
                    src={currentSlide.src}
                    title={`${currentSlide.platform === 'instagram' ? 'Instagram' : 'YouTube'} Property Video Tour`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        {slides.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
            <button 
              onClick={prev}
              className="pointer-events-auto rounded-xl border border-white/10 bg-black/45 p-2.5 text-white shadow-2xl backdrop-blur-xl transition-all hover:bg-primary active:scale-90"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={next}
              className="pointer-events-auto rounded-xl border border-white/10 bg-black/45 p-2.5 text-white shadow-2xl backdrop-blur-xl transition-all hover:bg-primary active:scale-90"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Counter Badge */}
        <div className="absolute bottom-3 right-3 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-black tracking-widest text-white shadow-2xl backdrop-blur-xl">
          {index + 1} / {slides.length}
        </div>
      </div>

      {/* Thumbnails */}
      {slides.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto px-1 pb-2 no-scrollbar">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 sm:w-[4.5rem] ${
                index === i ? 'border-primary scale-105 shadow-xl shadow-slate-900/20' : 'border-[#DDE8DD] opacity-55 hover:opacity-100'
              }`}
            >
              {slide.type === 'image' ? (
                <Image
                  src={urlForImage(slide.image).width(240).quality(75).url()}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#101713] text-white">
                  <Play className="h-5 w-5 fill-white" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Tour
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
