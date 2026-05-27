'use client'

import { Property } from '@/types'
import { useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { ChevronDown, Filter, RotateCcw } from 'lucide-react'

export type PropertyFilters = {
  locality: string
  flatType: string
  budget: string
  furnishing: string
  parking: string
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
  options: FilterOption[]
  onChange: (name: keyof PropertyFilters, value: string) => void
}

function FilterSelect({ label, name, value, options, onChange }: FilterSelectProps) {
  return (
    <div className="flex flex-col min-w-[160px] flex-grow lg:min-w-0 lg:w-full">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">
        {label}
      </label>
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full bg-white text-[#1C1008] border border-[#DDE8DD] rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none appearance-none transition-all group-hover:border-primary/50 cursor-pointer"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-primary transition-colors pointer-events-none" />
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
    <aside className={`bg-[#EEF4EE]/95 backdrop-blur-2xl border border-[#DDE8DD] rounded-2xl p-4 shadow-xl shadow-slate-900/5 ${className}`}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 w-fit">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-xs font-black text-primary uppercase tracking-widest">Explore Flats</span>
            </div>
            <p className="mt-3 text-xs font-bold text-slate-500">
              Refine by locality, budget, and essentials.
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="shrink-0 p-3 rounded-xl bg-white/85 text-slate-500 hover:text-primary hover:bg-white transition-colors border border-[#DDE8DD]"
            aria-label="Reset filters"
            title="Reset filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-4 lg:flex-col">
          <FilterSelect 
            label="Locality"
            name="locality"
            value={filters.locality}
            onChange={handleChange}
            options={localities.map(locality => ({ label: locality, value: locality }))}
          />

          <FilterSelect
            label="Flat Type" 
            name="flatType" 
            value={filters.flatType} 
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
