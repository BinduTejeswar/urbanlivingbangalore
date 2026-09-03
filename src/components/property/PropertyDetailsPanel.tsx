import {
  Building2,
  Compass,
  Home,
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
  icon: LucideIcon
  accent?: 'positive'
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
  const details: DetailItem[] = [
    {
      label: 'Facing',
      value: facing || 'N/A',
      icon: Compass,
    },
    {
      label: 'Floor',
      value: formatFloor(floorNumber, totalFloors),
      icon: Building2,
    },
    {
      label: 'Tenants',
      value: preferredTenants || 'Any',
      icon: User,
    },
    {
      label: 'Pets',
      value: petsAllowed ? 'Allowed' : 'Not Allowed',
      icon: PawPrint,
      accent: petsAllowed ? 'positive' : undefined,
    },
    {
      label: 'Balcony',
      value: hasBalcony ? 'Available' : 'Not Available',
      icon: PanelsTopLeft,
      accent: hasBalcony ? 'positive' : undefined,
    },
    {
      label: 'Society',
      value: societyName?.trim() || 'Private',
      icon: Home,
    },
  ]

  return (
    <section className="rounded-[2rem] border border-[#DDE8DD] bg-[#FFFFFF] p-5 shadow-xl shadow-slate-900/5 md:p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
            Home Profile
          </p>
          <h2 className="text-3xl font-black tracking-tighter text-[#1C1008]">
            Property Details
          </h2>
        </div>
        <span className="rounded-full border border-[#DDE8DD] bg-[#F6F8F4] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
          {details.length} details
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {details.map((detail) => {
          const Icon = detail.icon

          return (
            <div
              key={detail.label}
              className="min-h-[100px] rounded-2xl border border-[#DDE8DD] bg-white p-3"
            >
              <span className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF4EE] text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                {detail.label}
              </p>
              <p className="mt-1 flex items-center gap-1.5 break-words text-sm font-black leading-tight text-[#1C1008]">
                {detail.accent === 'positive' && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                )}
                {detail.value}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
