import { IndianRupee, Home, Ruler, Sofa, CalendarCheck } from 'lucide-react'

interface PropertyQuickFactsProps {
  monthlyRent: number
  propertyType: string
  squareFeet: number
  furnishingStatus: string
  availableFrom?: string
}

export default function PropertyQuickFacts({
  monthlyRent,
  propertyType,
  squareFeet,
  furnishingStatus,
  availableFrom,
}: PropertyQuickFactsProps) {
  const chips = [
    { label: propertyType, icon: Home },
    { label: `${squareFeet} sqft`, icon: Ruler },
    { label: furnishingStatus, icon: Sofa },
    { label: availableFrom || 'Available now', icon: CalendarCheck },
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      <span className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-black text-white shadow-lg shadow-primary/20">
        <IndianRupee className="h-3.5 w-3.5" />
        {monthlyRent.toLocaleString('en-IN')}/mo
      </span>
      {chips.map((chip) => {
        const Icon = chip.icon

        return (
          <span
            key={chip.label}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#DDE8DD] bg-white px-3.5 py-2 text-xs font-black text-slate-600"
          >
            <Icon className="h-3.5 w-3.5 text-primary" />
            {chip.label}
          </span>
        )
      })}
    </div>
  )
}
