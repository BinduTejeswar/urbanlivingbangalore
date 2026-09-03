'use client'

import { Property } from '@/types'
import { useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Building2, ChevronDown, Filter, IndianRupee, MapPin, RotateCcw, Sofa, SquareParking } from 'lucide-react'

export type PropertyFilters = {
  locality: string
  flatType: string
  budget: string
  furnishing: string
  parking: string
  near: string
  sortBy: string
}

type FilterOption = {
  label: string
  value: string
}

interface FilterBarProps {
  properties: Property[]
  filters: PropertyFilters
  setFilters: Dispatch<SetStateAction<PropertyFilters>>
  onReset: () => void
  className?: string
}

interface FilterSelectProps {
  label: string
  name: keyof PropertyFilters
  value: string
  icon: LucideIcon
  options: FilterOption[]
  onChange: (name: keyof PropertyFilters, value: string) => void
}

function FilterSelect({ label, name, value, icon: Icon, options, onChange }: FilterSelectProps) {
  return (
    <div className="flex flex-col min-w-[160px] flex-grow lg:min-w-0 lg:w-full">
      <label className="mb-2 flex items-center gap-1.5 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#8A7A68]">
        <Icon className="h-3 w-3 text-primary" />
        {label}
      </label>
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full bg-white text-[#1C1008] border border-[#E6DDD0] rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none appearance-none transition-all group-hover:border-primary/50 cursor-pointer"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
      </div>
    </div>
  )
}

export default function FilterBar({ properties, filters, setFilters, onReset, className = '' }: FilterBarProps) {
  const localities = useMemo(() => {
    const allLocalities = properties.flatMap((property) => [
      property.location.area,
      ...(property.location.nearbyAreas || []),
    ]).map((area) => area?.trim()).filter(Boolean)

    return ['All', ...Array.from(new Set(allLocalities)).sort()]
  }, [properties])

  const handleChange = (name: keyof PropertyFilters, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  return (
    <aside className={`bg-white/90 backdrop-blur-2xl border border-[#E6DDD0] rounded-[1.75rem] p-5 shadow-xl shadow-[#1C1008]/5 ${className}`}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-black text-[#1C1008]">Filters</p>
              <p className="text-[11px] font-semibold text-[#8A7A68]">Locality, budget &amp; essentials</p>
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

        <div className="flex flex-wrap gap-4 lg:flex-col">
          <FilterSelect
            label="Locality"
            name="locality"
            value={filters.locality}
            icon={MapPin}
            onChange={handleChange}
            options={localities.map(locality => ({ label: locality, value: locality }))}
          />

          <FilterSelect
            label="Flat Type"
            name="flatType"
            value={filters.flatType}
            icon={Building2}
            onChange={handleChange}
            options={[
              { label: 'All Types', value: 'All' },
              { label: '1RK', value: '1RK' },
              { label: '1BHK', value: '1BHK' },
              { label: '2BHK', value: '2BHK' },
              { label: '3BHK', value: '3BHK' },
            ]}
          />

          <FilterSelect
            label="Monthly Rent"
            name="budget"
            value={filters.budget}
            icon={IndianRupee}
            onChange={handleChange}
            options={[
              { label: 'All Budgets', value: 'All' },
              { label: 'Under ₹15k', value: 'Under 15k' },
              { label: '₹15k – ₹30k', value: '15k-30k' },
              { label: '₹30k – ₹40k', value: '30k-40k' },
              { label: '₹40k+', value: '40k+' },
            ]}
          />

          <FilterSelect
            label="Furnishing"
            name="furnishing"
            value={filters.furnishing}
            icon={Sofa}
            onChange={handleChange}
            options={[
              { label: 'All Status', value: 'All' },
              { label: 'Fully Furnished', value: 'Fully Furnished' },
              { label: 'Semi Furnished', value: 'Semi Furnished' },
            ]}
          />

          <FilterSelect
            label="Parking"
            name="parking"
            value={filters.parking}
            icon={SquareParking}
            onChange={handleChange}
            options={[
              { label: 'Any', value: 'All' },
              { label: 'Car Parking', value: 'Car Parking' },
              { label: 'Bike Parking', value: 'Bike Parking' },
              { label: 'No Parking', value: 'No' },
            ]}
          />
        </div>

      </div>
    </aside>
  )
}
