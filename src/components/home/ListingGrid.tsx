'use client'

import { Property, SiteSettings } from '@/types'
import { useState, useMemo, useEffect } from 'react'
import FilterBar from './FilterBar'
import type { PropertyFilters } from './FilterBar'
import MobileFilterSheet from './MobileFilterSheet'
import PropertyCard from './PropertyCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Home as HomeIcon, MessageCircle } from 'lucide-react'

interface ListingGridProps {
  properties: Property[]
  settings?: SiteSettings | null
}

const DEFAULT_FILTERS: PropertyFilters = {
  locality: 'All',
  flatType: 'All',
  budget: 'All',
  furnishing: 'All',
  parking: 'All',
  sortBy: 'Budget Low',
}

const WHATSAPP_MESSAGE = "Hi, I'm interested in a flat listed on UrbanLivingBangalore."

const SORT_OPTIONS: Array<{ label: string; value: PropertyFilters['sortBy'] }> = [
  { label: 'Low to High', value: 'Budget Low' },
  { label: 'High to Low', value: 'Budget High' },
]

type StoredFilters = Partial<PropertyFilters> & {
  type?: string
  area?: string
}

const getPropertyAreas = (property: Property) => (
  Array.from(new Set([
    property.location.area,
    ...(property.location.nearbyAreas || []),
  ].map((area) => area?.trim()).filter(Boolean)))
)

const normalizeSortBy = (sortBy?: string) => {
  if (sortBy === 'Rent Low') return 'Budget Low'
  if (sortBy === 'Rent High') return 'Budget High'
  if (sortBy === 'Budget Low' || sortBy === 'Budget High') return sortBy
  return DEFAULT_FILTERS.sortBy
}

const normalizeFurnishing = (furnishing?: string) => {
  if (furnishing === 'Unfurnished') return DEFAULT_FILTERS.furnishing
  return furnishing ?? DEFAULT_FILTERS.furnishing
}

const normalizeFlatType = (flatType?: string) => {
  if (flatType === 'Studio/Bachelor') return '1RK'
  return flatType ?? DEFAULT_FILTERS.flatType
}

const normalizeBudget = (budget?: string) => {
  if (budget === 'Under 10k' || budget === '10k-15k') return 'Under 15k'
  if (budget === '15k-25k') return '15k-30k'
  if (budget === '25k+') return DEFAULT_FILTERS.budget
  return budget ?? DEFAULT_FILTERS.budget
}

const normalizeFilters = (filters: StoredFilters): PropertyFilters => ({
  locality: filters.locality ?? filters.area ?? DEFAULT_FILTERS.locality,
  flatType: normalizeFlatType(filters.flatType ?? filters.type),
  budget: normalizeBudget(filters.budget),
  furnishing: normalizeFurnishing(filters.furnishing),
  parking: filters.parking ?? DEFAULT_FILTERS.parking,
  sortBy: normalizeSortBy(filters.sortBy),
})

const hasParkingFacility = (property: Property, parkingType: 'Bike Parking' | 'Car Parking') => {
  return Boolean(property.facilities?.some((facility) => facility.toLowerCase() === parkingType.toLowerCase()))
}

const hasAnyParking = (property: Property) => {
  return hasParkingFacility(property, 'Bike Parking') || hasParkingFacility(property, 'Car Parking')
}

function normalizeWhatsappNumber(phoneNumber?: string) {
  const digits = phoneNumber?.replace(/\D/g, '') || ''

  if (digits.length === 10) {
    return `91${digits}`
  }

  return digits
}

export default function ListingGrid({ properties, settings }: ListingGridProps) {
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS)
  const [draftFilters, setDraftFilters] = useState<PropertyFilters>(DEFAULT_FILTERS)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load filters from localStorage on mount
  useEffect(() => {
    let isActive = true

    queueMicrotask(() => {
      if (!isActive) return

      const savedFilters = localStorage.getItem('propertyFilters')
      if (savedFilters) {
        try {
          setFilters(normalizeFilters(JSON.parse(savedFilters)))
        } catch (e) {
          console.error('Error parsing saved filters', e)
        }
      }
      setIsInitialized(true)
    })

    return () => {
      isActive = false
    }
  }, [])

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('propertyFilters', JSON.stringify(filters))
    }
  }, [filters, isInitialized])

  useEffect(() => {
    document.body.style.overflow = isMobileFiltersOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileFiltersOpen])

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0.05 }
    )

    observer.observe(footer)

    return () => observer.disconnect()
  }, [])

  const filteredProperties = useMemo(() => {
    const results = properties.filter(property => {
      if (filters.locality !== 'All' && !getPropertyAreas(property).includes(filters.locality)) return false

      if (filters.flatType !== 'All' && property.propertyType !== filters.flatType) return false
      
      const rent = property.pricing.monthlyRent
      if (filters.budget === 'Under 15k' && rent >= 15000) return false
      if (filters.budget === '15k-30k' && (rent < 15000 || rent >= 30000)) return false
      if (filters.budget === '30k-40k' && (rent < 30000 || rent >= 40000)) return false
      if (filters.budget === '40k+' && rent < 40000) return false

      if (filters.furnishing !== 'All' && property.furnishingStatus !== filters.furnishing) return false

      if (filters.parking === 'Car Parking' && !hasParkingFacility(property, 'Car Parking')) return false
      if (filters.parking === 'Bike Parking' && !hasParkingFacility(property, 'Bike Parking')) return false
      if (filters.parking === 'No' && hasAnyParking(property)) return false

      return true
    })

    return results.sort((a, b) => {
      if (a.isRecommended !== b.isRecommended) {
        return a.isRecommended ? -1 : 1
      }

      return filters.sortBy === 'Budget High'
        ? b.pricing.monthlyRent - a.pricing.monthlyRent
        : a.pricing.monthlyRent - b.pricing.monthlyRent
    })
  }, [properties, filters])

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => (
    key !== 'sortBy' && value !== DEFAULT_FILTERS[key as keyof PropertyFilters]
  )).length
  const whatsappNumber = normalizeWhatsappNumber(settings?.whatsappNumber)
  const whatsappMessage = settings?.whatsappMessage || WHATSAPP_MESSAGE
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : ''

  const openMobileFilters = () => {
    setDraftFilters(filters)
    setIsMobileFiltersOpen(true)
  }

  const applyMobileFilters = () => {
    setFilters(draftFilters)
    setIsMobileFiltersOpen(false)
  }

  // Don't render cards until filters are loaded to avoid "flicker"
  if (!isInitialized) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <section id="listings" className="bg-[#F3ECE3] pt-4 pb-36 transition-colors duration-500 md:pt-24 lg:pb-24">
      <div className="max-w-[1500px] mx-auto pl-2 pr-4 md:pl-3 md:pr-6 lg:pl-2 lg:pr-8 lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-6 xl:gap-8 items-start">
        <div className="hidden lg:block">
          <FilterBar
            properties={properties}
            filters={filters}
            setFilters={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            className="lg:sticky lg:top-20"
          />
        </div>

        <div className="mt-0 min-w-0">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                Owner-listed homes
              </p>
              <p className="text-sm font-black text-slate-500">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'flat' : 'flats'} available
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Sort by budget
              </p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                {SORT_OPTIONS.map((option) => {
                  const isActive = filters.sortBy === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilters(prev => ({ ...prev, sortBy: option.value }))}
                      className={`rounded-xl border px-4 py-2.5 text-xs font-black transition-all active:scale-95 ${
                        isActive
                          ? 'border-primary bg-primary text-white shadow-lg shadow-orange-900/15'
                          : 'border-[#E6DDD0] bg-white text-[#1C1008] hover:border-primary/40'
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property._id} property={property} settings={settings} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center md:py-32"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 border border-primary/20">
                <HomeIcon className="w-10 h-10 text-primary/70" />
              </div>
              <h3 className="text-3xl font-black text-[#1C1008] mb-4 tracking-tighter">No Flats Found</h3>
              <p className="text-slate-500 max-w-md font-medium">
                We couldn&apos;t find any flats matching these filters. Try adjusting your search or resetting all filters.
              </p>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="mt-10 bg-primary text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-orange-500/20 active:scale-95"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}

        </div>
      </div>

      {!isFooterVisible && (
        <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-[#E6DDD0] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-18px_40px_rgba(28,16,8,0.12)] backdrop-blur-xl lg:hidden">
          <div className={`mx-auto grid h-12 max-w-md ${whatsappUrl ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <button
              type="button"
              onClick={openMobileFilters}
              className="relative flex items-center justify-center gap-1.5 font-bold text-slate-700 active:bg-[#F1E6D6]"
            >
              <span className="relative">
                <Filter className="h-4 w-4 text-slate-700" />
                {activeFilterCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-1 text-[8px] font-black text-white">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              <span className="text-[11px] leading-none">Filter</span>
            </button>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex items-center justify-center gap-1.5 border-l border-[#E6DDD0] font-bold text-slate-700 active:bg-[#F1E6D6]"
              >
                <MessageCircle className="h-4 w-4 text-[#12A150]" />
                <span className="text-[11px] leading-none">WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {isMobileFiltersOpen && (
          <motion.div
            className="fixed inset-0 z-[120] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setIsMobileFiltersOpen(false)}
              className="absolute inset-0 bg-black/55"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 360 }}
              className="absolute inset-x-0 bottom-0 mx-auto max-w-lg"
            >
              <MobileFilterSheet
                properties={properties}
                filters={draftFilters}
                setFilters={setDraftFilters}
                onReset={() => setDraftFilters(DEFAULT_FILTERS)}
                onClose={() => setIsMobileFiltersOpen(false)}
                onApply={applyMobileFilters}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
