'use client'

import { Property } from '@/types'
import { useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Building2, ChevronDown, Filter, IndianRupee, MapPin, RotateCcw, Sofa, SquareParking } from 'lucide-react'
import { CheckboxPill, FilterSectionHeader, RentRangeSlider, RENT_MAX, RENT_MIN } from './FilterControls'

export type PropertyFilters = {
  locality: string
  flatTypes: string[]
  minRent: number
  maxRent: number
  furnishings: string[]
  parking: string[]
  near: string
  sortBy: string
}

export const FLAT_TYPE_OPTIONS = ['1RK', '1BHK', '2BHK', '3BHK']
export const FURNISHING_OPTIONS = ['Fully Furnished', 'Semi Furnished', 'Unfurnished']
export const PARKING_OPTIONS = ['Car Parking', 'Bike Parking', 'No Parking']

interface FilterBarProps {
  properties: Property[]
  filters: PropertyFilters
  setFilters: Dispatch<SetStateAction<PropertyFilters>>
  onReset: () => void
  className?: string
}

export const toggleFilterValue = (list: string[], value: string) => (
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
)

export default function FilterBar({ properties, filters, setFilters, onReset, className = '' }: FilterBarProps) {
  const localities = useMemo(() => {
    const allLocalities = properties.flatMap((property) => [
      property.location.area,
      ...(property.location.nearbyAreas || []),
    ]).map((area) => area?.trim()).filter(Boolean)

    return ['All', ...Array.from(new Set(allLocalities)).sort()]
  }, [properties])

  const activeCount = [
    filters.locality !== 'All',
    filters.flatTypes.length > 0,
    filters.minRent !== RENT_MIN || filters.maxRent !== RENT_MAX,
    filters.furnishings.length > 0,
    filters.parking.length > 0,
  ].filter(Boolean).length

  return (
    <aside className={`bg-white/90 backdrop-blur-2xl border border-[#E6DDD0] rounded-[1.75rem] p-5 shadow-xl shadow-[#1C1008]/5 ${className}`}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-[#1C1008]">Filters</p>
              <p className="text-[11px] font-semibold text-[#8A7A68]">
                {activeCount > 0 ? `${activeCount} active` : 'Locality, rent & essentials'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="shrink-0 p-2.5 rounded-xl bg-[#F3ECE3] text-[#8A7A68] hover:text-primary hover:bg-white transition-colors border border-[#E6DDD0]"
            aria-label="Reset filters"
            title="Reset filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="h-px bg-[#EDE6DB]" />

        <div>
          <FilterSectionHeader icon={MapPin} label="Locality" />
          <div className="relative group">
            <select
              value={filters.locality}
              onChange={(e) => setFilters((prev) => ({ ...prev, locality: e.target.value }))}
              className="w-full bg-white text-[#1C1008] border border-[#E6DDD0] rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none appearance-none transition-all group-hover:border-primary/50 cursor-pointer"
            >
              {localities.map((locality) => (
                <option key={locality} value={locality}>{locality === 'All' ? 'All Locations' : locality}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
          </div>
        </div>

        <div className="h-px bg-[#EDE6DB]" />

        <div>
          <FilterSectionHeader icon={IndianRupee} label="Monthly Rent" />
          <RentRangeSlider
            minValue={filters.minRent}
            maxValue={filters.maxRent}
            onChange={(min, max) => setFilters((prev) => ({ ...prev, minRent: min, maxRent: max }))}
          />
        </div>

        <div className="h-px bg-[#EDE6DB]" />

        <div>
          <FilterSectionHeader
            icon={Building2}
            label="Flat Type"
            hint={filters.flatTypes.length > 0 ? `${filters.flatTypes.length} selected` : undefined}
          />
          <div className="grid grid-cols-2 gap-2">
            {FLAT_TYPE_OPTIONS.map((option) => (
              <CheckboxPill
                key={option}
                label={option}
                checked={filters.flatTypes.includes(option)}
                onToggle={() => setFilters((prev) => ({ ...prev, flatTypes: toggleFilterValue(prev.flatTypes, option) }))}
              />
            ))}
          </div>
        </div>

        <div className="h-px bg-[#EDE6DB]" />

        <div>
          <FilterSectionHeader
            icon={Sofa}
            label="Furnishing"
            hint={filters.furnishings.length > 0 ? `${filters.furnishings.length} selected` : undefined}
          />
          <div className="flex flex-col gap-2">
            {FURNISHING_OPTIONS.map((option) => (
              <CheckboxPill
                key={option}
                label={option}
                checked={filters.furnishings.includes(option)}
                onToggle={() => setFilters((prev) => ({ ...prev, furnishings: toggleFilterValue(prev.furnishings, option) }))}
              />
            ))}
          </div>
        </div>

        <div className="h-px bg-[#EDE6DB]" />

        <div>
          <FilterSectionHeader
            icon={SquareParking}
            label="Parking"
            hint={filters.parking.length > 0 ? `${filters.parking.length} selected` : undefined}
          />
          <div className="flex flex-col gap-2">
            {PARKING_OPTIONS.map((option) => (
              <CheckboxPill
                key={option}
                label={option}
                checked={filters.parking.includes(option)}
                onToggle={() => setFilters((prev) => ({ ...prev, parking: toggleFilterValue(prev.parking, option) }))}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
