'use client'

import { useMemo, useRef, useState } from 'react'
import type { NearbyPlace, NearbyPlaceCategory } from '@/types'
import {
  BriefcaseBusiness,
  ChevronRight,
  GraduationCap,
  Hospital,
  MapPin,
  ShoppingBag,
  TrainFront,
  Utensils,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type NearbyPlaceInput = string | NearbyPlace

type NormalizedNearbyPlace = {
  key: string
  category: NearbyPlaceCategory
  name: string
  distance?: string
}

const categoryOrder: NearbyPlaceCategory[] = [
  'Shopping Malls',
  'Metro & Commute',
  'Healthcare',
  'Schools',
  'Restaurants',
  'IT Companies',
  'Other',
]

const categoryIcons: Record<NearbyPlaceCategory, LucideIcon> = {
  'Shopping Malls': ShoppingBag,
  'Metro & Commute': TrainFront,
  Healthcare: Hospital,
  Schools: GraduationCap,
  Restaurants: Utensils,
  'IT Companies': BriefcaseBusiness,
  Other: MapPin,
}

const categoryTones: Record<NearbyPlaceCategory, {
  active: string
  inactive: string
}> = {
  'Shopping Malls': {
    active: 'border-pink-200 bg-pink-100 text-pink-800 shadow-pink-950/10',
    inactive: 'border-pink-100 bg-pink-50 text-pink-700 hover:border-pink-200 hover:bg-pink-100',
  },
  'Metro & Commute': {
    active: 'border-sky-200 bg-sky-100 text-sky-800 shadow-sky-950/10',
    inactive: 'border-sky-100 bg-sky-50 text-sky-700 hover:border-sky-200 hover:bg-sky-100',
  },
  Healthcare: {
    active: 'border-red-200 bg-red-100 text-red-800 shadow-red-950/10',
    inactive: 'border-red-100 bg-red-50 text-red-700 hover:border-red-200 hover:bg-red-100',
  },
  Schools: {
    active: 'border-amber-200 bg-amber-100 text-amber-900 shadow-amber-950/10',
    inactive: 'border-amber-100 bg-amber-50 text-amber-800 hover:border-amber-200 hover:bg-amber-100',
  },
  Restaurants: {
    active: 'border-orange-200 bg-orange-100 text-orange-800 shadow-orange-950/10',
    inactive: 'border-orange-100 bg-orange-50 text-orange-700 hover:border-orange-200 hover:bg-orange-100',
  },
  'IT Companies': {
    active: 'border-indigo-200 bg-indigo-100 text-indigo-800 shadow-indigo-950/10',
    inactive: 'border-indigo-100 bg-indigo-50 text-indigo-700 hover:border-indigo-200 hover:bg-indigo-100',
  },
  Other: {
    active: 'border-emerald-200 bg-emerald-100 text-emerald-800 shadow-emerald-950/10',
    inactive: 'border-emerald-100 bg-emerald-50 text-emerald-700 hover:border-emerald-200 hover:bg-emerald-100',
  },
}

const normalizeNearbyPlaces = (places?: NearbyPlaceInput[]) => {
  const seen = new Set<string>()

  return (places || []).reduce<NormalizedNearbyPlace[]>((result, place, index) => {
    const normalized = typeof place === 'string'
      ? {
          key: `legacy-${index}-${place}`,
          category: 'Other' as NearbyPlaceCategory,
          name: place.trim(),
          distance: undefined,
        }
      : {
          key: place._key || `nearby-${index}`,
          category: place.category || 'Other',
          name: place.name?.trim() || '',
          distance: place.distance?.trim(),
        }

    const uniqueKey = `${normalized.category}-${normalized.name}-${normalized.distance || ''}`.toLowerCase()

    if (!normalized.name || seen.has(uniqueKey)) {
      return result
    }

    seen.add(uniqueKey)
    result.push(normalized)
    return result
  }, [])
}

interface NearbyPlacesSectionProps {
  places?: NearbyPlaceInput[]
}

export default function NearbyPlacesSection({ places }: NearbyPlacesSectionProps) {
  const categoryScrollerRef = useRef<HTMLDivElement>(null)
  const nearbyPlaces = useMemo(() => normalizeNearbyPlaces(places), [places])
  const visibleCategories = useMemo(() => (
    categoryOrder.filter((category) => nearbyPlaces.some((place) => place.category === category))
  ), [nearbyPlaces])
  const [activeCategory, setActiveCategory] = useState<NearbyPlaceCategory | undefined>()

  if (nearbyPlaces.length === 0) return null

  const selectedCategory = activeCategory && visibleCategories.includes(activeCategory)
    ? activeCategory
    : visibleCategories[0]
  const filteredPlaces = nearbyPlaces.filter((place) => place.category === selectedCategory)
  const scrollCategoriesRight = () => {
    categoryScrollerRef.current?.scrollBy({
      left: 180,
      behavior: 'smooth',
    })
  }

  return (
    <section className="rounded-[2rem] border border-[#DDE8DD] bg-[#FFFFFF] p-5 shadow-xl shadow-slate-900/5 md:p-6">
      <div className="mb-5">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
          Around the Area
        </p>
        <h2 className="text-2xl font-black tracking-tighter text-[#1C1008]">
          Nearby Places
        </h2>
      </div>

      <div className="relative mb-5">
        <div ref={categoryScrollerRef} className="flex gap-2 overflow-x-auto pb-1 pr-12 no-scrollbar md:pr-0">
          {visibleCategories.map((category) => {
            const Icon = categoryIcons[category]
            const tone = categoryTones[category]
            const isActive = selectedCategory === category

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-xl border px-4 text-xs font-black transition-all active:scale-95 ${
                  isActive
                    ? `${tone.active} shadow-lg`
                    : tone.inactive
                }`}
              >
                <Icon className="h-4 w-4" />
                {category}
              </button>
            )
          })}
        </div>

        {visibleCategories.length > 2 && (
          <div className="pointer-events-none absolute right-0 top-0 flex h-10 w-12 items-center justify-end bg-gradient-to-l from-white via-white/90 to-transparent md:hidden">
            <button
              type="button"
              onClick={scrollCategoriesRight}
              aria-label="Scroll nearby categories right"
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-[#DDE8DD] bg-white text-primary shadow-lg shadow-slate-900/10 transition-transform active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlaces.map((place) => {
          const Icon = categoryIcons[place.category]

          return (
            <div key={place.key} className="flex items-center gap-3 rounded-2xl border border-[#DDE8DD] bg-[#EEF4EE] px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DDE8DD] bg-[#FFFFFF]">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <span className="block text-sm font-black leading-tight text-slate-700">{place.name}</span>
                {place.distance && (
                  <span className="mt-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    {place.distance}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
