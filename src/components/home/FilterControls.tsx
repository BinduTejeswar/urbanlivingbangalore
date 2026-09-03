'use client'

import type { LucideIcon } from 'lucide-react'
import { Check } from 'lucide-react'

export const RENT_MIN = 5000
export const RENT_MAX = 60000
export const RENT_STEP = 1000

export const formatRent = (value: number) => {
  if (value >= RENT_MAX) return `₹${Math.round(RENT_MAX / 1000)}k+`
  if (value >= 1000) return `₹${Math.round(value / 1000)}k`
  return `₹${value}`
}

interface FilterSectionHeaderProps {
  icon: LucideIcon
  label: string
  hint?: string
}

export function FilterSectionHeader({ icon: Icon, label, hint }: FilterSectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center gap-2 px-0.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#4A3F33]">
        {label}
      </span>
      {hint && <span className="ml-auto text-[11px] font-black text-primary">{hint}</span>}
    </div>
  )
}

interface CheckboxPillProps {
  label: string
  checked: boolean
  onToggle: () => void
}

export function CheckboxPill({ label, checked, onToggle }: CheckboxPillProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm font-bold transition-all active:scale-[0.98] ${
        checked
          ? 'border-primary bg-primary/[0.06] text-[#1C1008]'
          : 'border-[#E6DDD0] bg-white text-[#4A3F33] hover:border-primary/40'
      }`}
    >
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors ${
          checked ? 'border-primary bg-primary' : 'border-[#D8CDBE] bg-white'
        }`}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </span>
      <span className="min-w-0 truncate">{label}</span>
    </button>
  )
}

interface RentRangeSliderProps {
  minValue: number
  maxValue: number
  onChange: (min: number, max: number) => void
}

export function RentRangeSlider({ minValue, maxValue, onChange }: RentRangeSliderProps) {
  const minPercent = ((minValue - RENT_MIN) / (RENT_MAX - RENT_MIN)) * 100
  const maxPercent = ((maxValue - RENT_MIN) / (RENT_MAX - RENT_MIN)) * 100

  const handleMinChange = (value: number) => {
    const next = Math.min(value, maxValue - RENT_STEP)
    onChange(Math.max(RENT_MIN, next), maxValue)
  }

  const handleMaxChange = (value: number) => {
    const next = Math.max(value, minValue + RENT_STEP)
    onChange(minValue, Math.min(RENT_MAX, next))
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="rounded-xl border border-[#E6DDD0] bg-[#F8F4EC] px-3 py-2">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8A7A68]">Min</p>
          <p className="text-sm font-black text-[#1C1008]">{formatRent(minValue)}</p>
        </div>
        <span className="h-px w-4 shrink-0 bg-[#D8CDBE]" />
        <div className="rounded-xl border border-[#E6DDD0] bg-[#F8F4EC] px-3 py-2 text-right">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8A7A68]">Max</p>
          <p className="text-sm font-black text-[#1C1008]">{formatRent(maxValue)}</p>
        </div>
      </div>

      <div className="relative h-5">
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#EDE6DB]" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={RENT_MIN}
          max={RENT_MAX}
          step={RENT_STEP}
          value={minValue}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="range-slider-input absolute inset-x-0 top-1/2 h-5 w-full -translate-y-1/2"
          aria-label="Minimum rent"
        />
        <input
          type="range"
          min={RENT_MIN}
          max={RENT_MAX}
          step={RENT_STEP}
          value={maxValue}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="range-slider-input absolute inset-x-0 top-1/2 h-5 w-full -translate-y-1/2"
          aria-label="Maximum rent"
        />
      </div>
    </div>
  )
}
