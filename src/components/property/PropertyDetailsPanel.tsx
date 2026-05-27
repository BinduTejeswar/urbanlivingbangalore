import {
  Building2,
  Compass,
  Home,
  Layers3,
  PawPrint,
  PanelsTopLeft,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface PropertyDetailsPanelProps {
  facing?: string | null
  floorNumber?: number | null
  totalFloors?: number | null
  preferredTenants?: 'Family' | 'Bachelor' | 'Any' | null
  petsAllowed?: boolean | null
  hasBalcony?: boolean | null
  societyName?: string | null
}

interface DetailItem {
  label: string
  value: string
  note: string
  icon: LucideIcon
  tone: string
}

const formatFloor = (floorNumber?: number | null, totalFloors?: number | null) => {
  if (typeof floorNumber === 'number' && typeof totalFloors === 'number') {
    return `${floorNumber} of ${totalFloors}`
  }

  if (typeof floorNumber === 'number') {
    return `Floor ${floorNumber}`
  }

  return 'N/A'
}

export default function PropertyDetailsPanel({
  facing,
  floorNumber,
  totalFloors,
  preferredTenants,
  petsAllowed,
  hasBalcony,
  societyName,
}: PropertyDetailsPanelProps) {
  const floorDisplay = formatFloor(floorNumber, totalFloors)
  const tenantDisplay = preferredTenants || 'Any'
  const societyDisplay = societyName?.trim() || 'Private'
  const details: DetailItem[] = [
    {
      label: 'Facing',
      value: facing || 'N/A',
      note: 'Natural light direction',
      icon: Compass,
      tone: 'border-sky-100 bg-sky-50 text-sky-700',
    },
    {
      label: 'Floor',
      value: floorDisplay,
      note: 'Building level',
      icon: Building2,
      tone: 'border-orange-100 bg-orange-50 text-orange-700',
    },
    {
      label: 'Tenants',
      value: tenantDisplay,
      note: 'Preferred profile',
      icon: User,
      tone: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Pets',
      value: petsAllowed ? 'Allowed' : 'Not Allowed',
      note: 'Pet policy',
      icon: PawPrint,
      tone: petsAllowed
        ? 'border-violet-100 bg-violet-50 text-violet-700'
        : 'border-slate-200 bg-slate-50 text-slate-600',
    },
    {
      label: 'Balcony',
      value: hasBalcony ? 'Available' : 'Not Available',
      note: 'Open-air space',
      icon: PanelsTopLeft,
      tone: hasBalcony
        ? 'border-teal-100 bg-teal-50 text-teal-700'
        : 'border-slate-200 bg-slate-50 text-slate-600',
    },
    {
      label: 'Society',
      value: societyDisplay,
      note: 'Community type',
      icon: Home,
      tone: 'border-rose-100 bg-rose-50 text-rose-700',
    },
  ]
  const summaryItems = [
    { label: 'Layout Fit', value: tenantDisplay, icon: User },
    { label: 'Level', value: floorDisplay, icon: Layers3 },
    { label: 'Community', value: societyDisplay, icon: Home },
  ]

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#DDE8DD] bg-white shadow-xl shadow-slate-900/5">
      <div className="grid gap-0 lg:grid-cols-[minmax(220px,300px)_minmax(0,1fr)]">
        <div className="border-b border-[#DDE8DD] bg-[#F6F8F4] p-5 lg:border-b-0 lg:border-r md:p-6">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
            Home Profile
          </p>
          <h2 className="text-3xl font-black tracking-tighter text-[#1C1008]">
            Property Details
          </h2>

          <div className="mt-5 space-y-2.5">
            {summaryItems.map((item) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-[#DDE8DD] bg-white p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF4EE] text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                    <p className="truncate text-sm font-black text-[#1C1008]">{item.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3 md:p-6">
          {details.map((detail) => {
            const Icon = detail.icon

            return (
              <article
                key={detail.label}
                className={`group min-h-32 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg ${detail.tone}`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/85 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-white/80 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                    {detail.label}
                  </span>
                </div>
                <p className="break-words text-lg font-black leading-tight text-[#1C1008]">
                  {detail.value}
                </p>
                <p className="mt-2 text-[11px] font-bold leading-snug text-slate-500">
                  {detail.note}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
