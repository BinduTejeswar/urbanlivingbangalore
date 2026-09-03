'use client'

import { Property, SiteSettings } from '@/types'
import { urlForImage } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import { Share2, MapPin, IndianRupee, CheckCircle2, Heart, Wind, Tv, WashingMachine, Wifi, Thermometer, Microwave, Sofa, Table, Archive, Camera, Zap, ArrowUpCircle, Car, Bike, ShieldUser, Fingerprint, BedSingle, Coffee, GlassWater, Flame, PlugZap, PanelsTopLeft, LampDesk, Armchair, ShelvingUnit, Fan, Sparkles, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PropertyCardProps {
  property: Property
  settings?: SiteSettings | null
  isSaved?: boolean
  onToggleSave?: (propertyId: string) => void
}

const getAvailability = (availableFrom?: string): { label: string; isNow: boolean } | null => {
  if (!availableFrom) return null

  const date = new Date(availableFrom)
  if (Number.isNaN(date.getTime())) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (date <= today) return { label: 'Available now', isNow: true }

  return {
    label: `From ${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
    isNow: false,
  }
}

// Map facility strings to Lucide icons
const facilityIcons: Record<string, LucideIcon> = {
  'AC': Wind,
  'TV': Tv,
  'Washing Machine': WashingMachine,
  'Refrigerator': Archive,
  'WiFi': Wifi,
  'Geyser': Thermometer,
  'Microwave': Microwave,
  'Sofa': Sofa,
  'Dining Table': Table,
  'Wardrobe': Archive,
  'CCTV': Camera,
  'Power Backup': Zap,
  'Lift': ArrowUpCircle,
  'Parking': Car,
  'Bike Parking': Bike,
  'Car Parking': Car,
  'Security': ShieldUser,
  'Biometric Entry': Fingerprint,
  'Mattress': BedSingle,
  'Kettle': Coffee,
  'Water Purifier': GlassWater,
  'Gas Stove': Flame,
  'Induction Stove': PlugZap,
  'Curtains': PanelsTopLeft,
  'Study Table': LampDesk,
  'Chair': Armchair,
  'Kitchen Cabinets': ShelvingUnit,
  'Exhaust Fan': Fan,
}

const getNearbyAreas = (property: Property) => {
  const primaryArea = property.location.area?.trim().toLowerCase()

  return Array.from(new Set(
    (property.location.nearbyAreas || [])
      .map((area) => area?.trim())
      .filter((area): area is string => Boolean(area) && area.toLowerCase() !== primaryArea)
  ))
}

function normalizeWhatsappNumber(phoneNumber?: string) {
  const digits = phoneNumber?.replace(/\D/g, '') || ''

  if (digits.length === 10) {
    return `91${digits}`
  }

  return digits
}

export default function PropertyCard({ property, settings, isSaved = false, onToggleSave }: PropertyCardProps) {
  const [showToast, setShowToast] = useState(false)
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const pointerStartXRef = useRef<number | null>(null)
  const pointerStartYRef = useRef<number | null>(null)
  const didSwipeImageRef = useRef(false)
  const imageUrls = useMemo(() => (
    property.images
      ?.filter((image) => image.asset?._ref)
      .map((image) => urlForImage(image).width(800).url()) || []
  ), [property.images])
  const availability = useMemo(() => getAvailability(property.availableFrom), [property.availableFrom])
  const activeImageUrl = imageUrls[activeImageIndex % imageUrls.length]
  const hasMultipleImages = imageUrls.length > 1
  const primaryArea = property.location.area?.trim()
  const nearbyAreas = getNearbyAreas(property).slice(0, 3)
  const ownerWhatsappNumber = property.ownerContacts
    ?.map((owner) => normalizeWhatsappNumber(owner.contactNumber))
    .find(Boolean)
  const fallbackWhatsappNumber = normalizeWhatsappNumber(settings?.whatsappNumber)
  const whatsappNumber = ownerWhatsappNumber || fallbackWhatsappNumber

  useEffect(() => {
    if (!isCardHovered || imageUrls.length < 2) return

    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % imageUrls.length)
    }, 1200)

    return () => window.clearInterval(interval)
  }, [imageUrls.length, isCardHovered])

  const stopImageSlider = () => {
    setIsCardHovered(false)
  }

  const stopImageButtonPointer = (event: React.PointerEvent) => {
    event.stopPropagation()
  }

  const goToImage = (direction: -1 | 1, event?: React.SyntheticEvent) => {
    event?.preventDefault()
    event?.stopPropagation()

    if (!hasMultipleImages) return

    setIsCardHovered(false)
    setActiveImageIndex((current) => (current + direction + imageUrls.length) % imageUrls.length)
  }

  const handleImagePointerDown = (event: React.PointerEvent) => {
    if (!hasMultipleImages) return

    pointerStartXRef.current = event.clientX
    pointerStartYRef.current = event.clientY
    didSwipeImageRef.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleImagePointerUp = (event: React.PointerEvent) => {
    if (!hasMultipleImages || pointerStartXRef.current === null || pointerStartYRef.current === null) {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      return
    }

    const deltaX = event.clientX - pointerStartXRef.current
    const deltaY = event.clientY - pointerStartYRef.current
    const isHorizontalSwipe = Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2

    pointerStartXRef.current = null
    pointerStartYRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (!isHorizontalSwipe) return

    event.preventDefault()
    event.stopPropagation()
    didSwipeImageRef.current = true
    setIsCardHovered(false)
    setActiveImageIndex((current) => (
      deltaX < 0
        ? (current + 1) % imageUrls.length
        : (current - 1 + imageUrls.length) % imageUrls.length
    ))
  }

  const handleImagePointerCancel = (event: React.PointerEvent) => {
    pointerStartXRef.current = null
    pointerStartYRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleCardClickCapture = (event: React.MouseEvent) => {
    if (!didSwipeImageRef.current) return

    event.preventDefault()
    event.stopPropagation()
    didSwipeImageRef.current = false
  }

  const copyLinkToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/flats/${property.slug.current}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.title} in ${property.location.area}`,
          url,
        })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
      }
    }

    await copyLinkToClipboard(url)
  }

  const handleWhatsappContact = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!whatsappNumber) return

    const url = `${window.location.origin}/flats/${property.slug.current}`
    const message = `${settings?.whatsappMessage || "Hi, I'm interested in a flat listed on UrbanLivingBangalore."}\n\nProperty: ${property.title}\nLink: ${url}`
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleSave?.(property._id)
  }

  return (
    <Link href={`/flats/${property.slug.current}`} className="block group">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={stopImageSlider}
        onFocus={() => setIsCardHovered(true)}
        onBlur={stopImageSlider}
        onClickCapture={handleCardClickCapture}
        className="relative bg-white rounded-[2rem] overflow-hidden border border-[#E6DDD0] hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(28,16,8,0.1)] transition-all duration-500 flex flex-col h-full"
      >
        {/* Image Container - Slightly shorter aspect ratio */}
        <div
          className="relative aspect-[16/10] touch-pan-y overflow-hidden"
          onPointerDown={handleImagePointerDown}
          onPointerUp={handleImagePointerUp}
          onPointerCancel={handleImagePointerCancel}
        >
          {activeImageUrl ? (
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={activeImageUrl}
                initial={{ opacity: 0, x: '16%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '-16%' }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={activeImageUrl}
                  alt={property.title}
                  draggable={false}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="select-none object-cover transition-transform duration-700 group-hover:scale-105"
                  quality={90}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/15 via-[#F1E6D6] to-secondary/15" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          {/* Rent + availability badges */}
          <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/95 px-3 py-1.5 text-sm font-black text-[#1C1008] shadow-2xl backdrop-blur-md">
              <IndianRupee className="w-3 h-3" />
              {property.pricing.monthlyRent.toLocaleString('en-IN')}
              <span className="ml-1 text-[9px] font-bold uppercase text-slate-500">/ mo</span>
            </div>
            {availability && (
              <div
                className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg backdrop-blur-md ${
                  availability.isNow ? 'bg-secondary/95' : 'bg-[#4A403A]/90'
                }`}
              >
                {availability.label}
              </div>
            )}
          </div>

          {property.isRecommended && (
            <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-100/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-800 shadow-xl shadow-amber-950/10 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              Recommended
            </div>
          )}

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onPointerDown={stopImageButtonPointer}
                onPointerUp={stopImageButtonPointer}
                onClick={(event) => goToImage(-1, event)}
                aria-label="Previous property image"
                title="Previous image"
                className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white shadow-xl backdrop-blur-md transition-all hover:bg-black/50 active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onPointerDown={stopImageButtonPointer}
                onPointerUp={stopImageButtonPointer}
                onClick={(event) => goToImage(1, event)}
                aria-label="Next property image"
                title="Next image"
                className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white shadow-xl backdrop-blur-md transition-all hover:bg-black/50 active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                {imageUrls.map((imageUrl, index) => (
                  <span
                    key={`${imageUrl}-${index}`}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeImageIndex % imageUrls.length
                        ? 'w-5 bg-white'
                        : 'w-1.5 bg-white/55'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content - Compacted padding */}
        <div className="p-5 md:p-6 flex flex-col flex-grow">
          <div className="mb-4">
            <div className="flex items-start gap-2">
              <h3 className="min-w-0 flex-1 font-black text-xl text-[#1C1008] leading-tight group-hover:text-primary transition-colors line-clamp-1">
                {property.title}
              </h3>
              {onToggleSave && (
                <button
                  type="button"
                  onClick={handleToggleSave}
                  aria-label={isSaved ? 'Remove from saved flats' : 'Save this flat'}
                  title={isSaved ? 'Remove from saved' : 'Save flat'}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                    isSaved
                      ? 'border-primary bg-primary text-white'
                      : 'border-[#E6DDD0] bg-[#F1E6D6] text-primary hover:border-primary/40 hover:bg-primary hover:text-white'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
                </button>
              )}
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share property"
                title="Share property"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E6DDD0] bg-[#F1E6D6] text-primary transition-all hover:border-primary/40 hover:bg-primary hover:text-white active:scale-95"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-1 space-y-1.5 text-slate-500">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                <MapPin className="h-3 w-3 shrink-0 text-primary" />
                <span className="min-w-0 truncate">
                  Located in {primaryArea || property.location.area}
                </span>
              </div>
              {nearbyAreas.length > 0 ? (
                <p className="line-clamp-1 pl-4 text-[11px] font-bold leading-snug">
                  Nearby {nearbyAreas.join(', ')}
                </p>
              ) : null}
            </div>
          </div>

          {/* Mini Amenities Row */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap gap-2">
              {property.facilities?.slice(0, 4).map((fac) => {
                const Icon = facilityIcons[fac] || CheckCircle2
                return (
                  <div key={fac} className="bg-[#F1E6D6] p-1.5 rounded-lg border border-[#E6DDD0]" title={fac}>
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                )
              })}
              {property.facilities && property.facilities.length > 4 && (
                <div className="bg-[#F1E6D6] px-2 py-1.5 rounded-lg border border-[#E6DDD0] text-[9px] font-black text-primary">
                  +{property.facilities.length - 4}
                </div>
              )}
            </div>

            {whatsappNumber && (
              <button
                type="button"
                onClick={handleWhatsappContact}
                aria-label={`Contact owner for ${property.title} on WhatsApp`}
                title="Contact owner on WhatsApp"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-green-100 bg-green-50 text-green-700 shadow-sm transition-all hover:border-green-200 hover:bg-green-600 hover:text-white active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-[#E6DDD0] flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sqft</span>
              <span className="text-[#1C1008] font-bold text-xs">{property.pricing.squareFeet}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Type</span>
              <span className="text-[#1C1008] font-bold text-xs">{property.propertyType}</span>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-[#1C1008] text-white px-6 py-3 rounded-2xl text-[10px] font-black shadow-2xl z-[200] flex items-center gap-3 border border-white/10"
            >
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              LINK COPIED
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  )
}
