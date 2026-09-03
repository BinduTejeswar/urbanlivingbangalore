'use client'

import { Property } from '@/types'
import { useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { PropertyFilters } from './FilterBar'

type FilterOption = {
  label: string
  value: string
}

type FilterCategory = {
  key: keyof PropertyFilters
  label: string
  options: FilterOption[]
}

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

    return Array.from(new Set(allLocalities)).sort()
  }, [properties])

  const categories = useMemo<FilterCategory[]>(() => [
    {
      key: 'locality',
      label: 'Location',
      options: [
        { label: 'All Locations', value: 'All' },
        ...localities.map((locality) => ({ label: locality, value: locality })),
      ],
    },
    {
      key: 'budget',
      label: 'Budget',
      options: [
        { label: 'All Budgets', value: 'All' },
        { label: 'Under ₹15k', value: 'Under 15k' },
        { label: '₹15k - ₹30k', value: '15k-30k' },
        { label: '₹30k - ₹40k', value: '30k-40k' },
        { label: '₹40k+', value: '40k+' },
      ],
    },
    {
      key: 'flatType',
      label: 'Flat Type',
      options: [
        { label: 'All Types', value: 'All' },
        { label: '1RK', value: '1RK' },
        { label: '1BHK', value: '1BHK' },
        { label: '2BHK', value: '2BHK' },
        { label: '3BHK', value: '3BHK' },
      ],
    },
    {
      key: 'furnishing',
      label: 'Furnishing',
      options: [
        { label: 'Any Furnishing', value: 'All' },
        { label: 'Fully Furnished', value: 'Fully Furnished' },
        { label: 'Semi Furnished', value: 'Semi Furnished' },
      ],
    },
    {
      key: 'parking',
      label: 'Parking',
      options: [
        { label: 'Any', value: 'All' },
        { label: 'Car Parking', value: 'Car Parking' },
        { label: 'Bike Parking', value: 'Bike Parking' },
        { label: 'No Parking', value: 'No' },
      ],
    },
    {
      key: 'sortBy',
      label: 'Sort By',
      options: [
        { label: 'Budget Low to High', value: 'Budget Low' },
        { label: 'Budget High to Low', value: 'Budget High' },
      ],
    },
  ], [localities])

  const [activeKey, setActiveKey] = useState<keyof PropertyFilters>('locality')
  const activeCategory = categories.find((category) => category.key === activeKey) || categories[0]

  const handleSelect = (value: string) => {
    setFilters((current) => ({ ...current, [activeCategory.key]: value }))
  }

  return (
    <div className="flex h-[82vh] max-h-[680px] flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-2xl">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#E6DDD0] px-4">
        <h2 className="text-lg font-black text-[#1C1008]">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-black uppercase tracking-wider text-primary"
        >
          Clear All
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[38%_62%]">
        <div className="overflow-y-auto border-r border-[#E6DDD0] bg-[#F3ECE3] p-2">
          {categories.map((category) => {
            const isActive = activeCategory.key === category.key
            const hasValue = filters[category.key] !== 'All' && filters[category.key] !== 'Budget Low'

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => setActiveKey(category.key)}
                className={`relative mb-1 flex min-h-12 w-full items-center rounded-lg px-3 text-left text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-white border border-[#E6DDD0] text-primary shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{category.label}</span>
                {hasValue && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>

        <div className="min-w-0 overflow-y-auto bg-white py-3">
          {activeCategory.options.map((option) => {
            const isSelected = filters[activeCategory.key] === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className="flex min-h-14 w-full items-center gap-3 px-5 text-left text-base font-bold text-[#1C1008] transition-colors hover:bg-[#F3ECE3]"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected ? 'border-primary' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </span>
                <span className="min-w-0 truncate">{option.label}</span>
              </button>
            )
          })}
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
