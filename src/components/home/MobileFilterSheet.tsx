'use client'

import { Property } from '@/types'
import { useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Building2, IndianRupee, MapPin, Sofa, SquareParking } from 'lucide-react'
import type { PropertyFilters } from './FilterBar'
import { FLAT_TYPE_OPTIONS, FURNISHING_OPTIONS, PARKING_OPTIONS, toggleFilterValue } from './FilterBar'
import { CheckboxPill, FilterSectionHeader, RentRangeSlider } from './FilterControls'

interface MobileFilterSheetProps {
  properties: Property[]
  filters: PropertyFilters
  setFilters: Dispatch<SetStateAction<PropertyFilters>>
  onReset: () => void
  onClose: () => void
  onApply: () => void
}

export default function MobileFilterSheet({
  properties,
  filters,
  setFilters,
  onReset,
  onClose,
  onApply,
}: MobileFilterSheetProps) {
  const localities = useMemo(() => {
    const allLocalities = properties.flatMap((property) => [
      property.location.area,
      ...(property.location.nearbyAreas || []),
    ]).map((area) => area?.trim()).filter(Boolean)

    return ['All', ...Array.from(new Set(allLocalities)).sort()]
  }, [properties])

  return (
    <div className="flex h-[86vh] max-h-[760px] flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-2xl">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#E6DDD0] px-5">
        <h2 className="text-lg font-black tracking-tight text-[#1C1008]">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-black uppercase tracking-wider text-primary"
        >
          Clear All
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-6">
          <div>
            <FilterSectionHeader icon={MapPin} label="Locality" />
            <div className="relative">
              <select
                value={filters.locality}
                onChange={(e) => setFilters((prev) => ({ ...prev, locality: e.target.value }))}
                className="w-full appearance-none rounded-xl border border-[#E6DDD0] bg-white px-4 py-3 text-sm font-bold text-[#1C1008] outline-none focus:ring-2 focus:ring-primary"
              >
                {localities.map((locality) => (
                  <option key={locality} value={locality}>{locality === 'All' ? 'All Locations' : locality}</option>
                ))}
              </select>
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
            <FilterSectionHeader icon={Building2} label="Flat Type" />
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
            <FilterSectionHeader icon={Sofa} label="Furnishing" />
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
            <FilterSectionHeader icon={SquareParking} label="Parking" />
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
      </div>

      <div className="grid shrink-0 grid-cols-[1fr_1.15fr] gap-4 border-t border-[#E6DDD0] bg-white px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <button
          type="button"
          onClick={onClose}
          className="h-12 rounded-xl text-left text-sm font-black uppercase tracking-wide text-slate-600"
        >
          Close
        </button>
        <button
          type="button"
          onClick={onApply}
          className="h-12 rounded-xl bg-primary px-5 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-orange-900/15 active:scale-95"
        >
          Apply
        </button>
      </div>
    </div>
  )
}
