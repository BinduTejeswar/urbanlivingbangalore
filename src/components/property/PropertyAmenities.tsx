import {
  AirVent,
  Armchair,
  ArrowUpCircle,
  Archive,
  BedSingle,
  Bike,
  Building2,
  Camera,
  Car,
  CheckCircle2,
  Coffee,
  Flame,
  GlassWater,
  LampDesk,
  Microwave,
  PanelsTopLeft,
  PlugZap,
  ShieldUser,
  ShelvingUnit,
  Sofa,
  Sparkles,
  Table,
  Thermometer,
  Tv,
  WashingMachine,
  Wifi,
  Wind,
  Zap,
  Fan,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { WashingMachineAccess } from '@/types'

interface PropertyAmenitiesProps {
  facilities: string[]
  washingMachineAccess?: WashingMachineAccess
}

interface AmenityGroupDefinition {
  title: string
  icon: LucideIcon
  members: Set<string>
  tone: string
}

interface AmenityGroup {
  title: string
  icon: LucideIcon
  facilities: string[]
  tone: string
}

const facilityIcons: Record<string, LucideIcon> = {
  AC: Wind,
  TV: Tv,
  'Washing Machine': WashingMachine,
  Refrigerator: Archive,
  WiFi: Wifi,
  Geyser: Thermometer,
  Microwave,
  Sofa,
  'Dining Table': Table,
  Wardrobe: Archive,
  CCTV: Camera,
  'Power Backup': Zap,
  Lift: ArrowUpCircle,
  Parking: Car,
  'Bike Parking': Bike,
  'Car Parking': Car,
  Security: ShieldUser,
  Mattress: BedSingle,
  Kettle: Coffee,
  'Water Purifier': GlassWater,
  'Gas Stove': Flame,
  'Induction Stove': PlugZap,
  Curtains: PanelsTopLeft,
  'Study Table': LampDesk,
  Chair: Armchair,
  'Kitchen Cabinets': ShelvingUnit,
  'Exhaust Fan': Fan,
}

const normalizeFacility = (facility: string) => facility.trim().toLowerCase()

const createMemberSet = (members: string[]) => new Set(members.map(normalizeFacility))

const amenityGroupDefinitions: AmenityGroupDefinition[] = [
  {
    title: 'Essentials',
    icon: Sparkles,
    members: createMemberSet(['WiFi', 'Power Backup', 'Water Purifier', 'Geyser']),
    tone: 'border-orange-100 bg-orange-50/70 text-orange-700',
  },
  {
    title: 'Appliances',
    icon: WashingMachine,
    members: createMemberSet(['TV', 'Washing Machine', 'Refrigerator', 'Microwave', 'Kettle']),
    tone: 'border-sky-100 bg-sky-50/70 text-sky-700',
  },
  {
    title: 'Kitchen',
    icon: Flame,
    members: createMemberSet(['Gas Stove', 'Induction Stove', 'Dining Table', 'Kitchen Cabinets']),
    tone: 'border-emerald-100 bg-emerald-50/70 text-emerald-700',
  },
  {
    title: 'Furniture',
    icon: Sofa,
    members: createMemberSet(['Sofa', 'Wardrobe', 'Mattress', 'Study Table', 'Chair', 'Curtains']),
    tone: 'border-violet-100 bg-violet-50/70 text-violet-700',
  },
  {
    title: 'Climate',
    icon: AirVent,
    members: createMemberSet(['AC', 'Fan', 'Exhaust Fan']),
    tone: 'border-cyan-100 bg-cyan-50/70 text-cyan-700',
  },
  {
    title: 'Building',
    icon: Building2,
    members: createMemberSet(['CCTV', 'Lift', 'Security', 'Parking', 'Bike Parking', 'Car Parking']),
    tone: 'border-rose-100 bg-rose-50/70 text-rose-700',
  },
]

const featuredAmenityOrder = [
  'WiFi',
  'Washing Machine',
  'Power Backup',
  'Lift',
  'Security',
  'Water Purifier',
  'AC',
  'Geyser',
]

function getUniqueFacilities(facilities: string[]) {
  const seen = new Set<string>()

  return facilities.reduce<string[]>((uniqueFacilities, facility) => {
    const trimmedFacility = facility.trim()
    const key = normalizeFacility(trimmedFacility)

    if (!trimmedFacility || seen.has(key)) {
      return uniqueFacilities
    }

    seen.add(key)
    uniqueFacilities.push(trimmedFacility)
    return uniqueFacilities
  }, [])
}

function getGroupedFacilities(facilities: string[]) {
  const groupedFacilities = amenityGroupDefinitions.map((group) => ({
    title: group.title,
    icon: group.icon,
    facilities: [] as string[],
    tone: group.tone,
  }))
  const otherFacilities: string[] = []

  facilities.forEach((facility) => {
    const matchingGroupIndex = amenityGroupDefinitions.findIndex((group) => (
      group.members.has(normalizeFacility(facility))
    ))

    if (matchingGroupIndex >= 0) {
      groupedFacilities[matchingGroupIndex].facilities.push(facility)
      return
    }

    otherFacilities.push(facility)
  })

  const visibleGroups: AmenityGroup[] = groupedFacilities.filter((group) => group.facilities.length > 0)

  if (otherFacilities.length > 0) {
    visibleGroups.push({
      title: 'More comforts',
      icon: CheckCircle2,
      facilities: otherFacilities,
      tone: 'border-slate-200 bg-slate-50 text-slate-600',
    })
  }

  return visibleGroups
}

function getFeaturedFacilities(facilities: string[]) {
  const facilitiesByKey = new Map(facilities.map((facility) => [normalizeFacility(facility), facility]))
  const preferredFacilities = featuredAmenityOrder
    .map((facility) => facilitiesByKey.get(normalizeFacility(facility)))
    .filter((facility): facility is string => Boolean(facility))

  return (preferredFacilities.length > 0 ? preferredFacilities : facilities).slice(0, 4)
}

function getFacilityDisplayName(facility: string, washingMachineAccess?: WashingMachineAccess) {
  if (normalizeFacility(facility) !== 'washing machine') return facility
  if (washingMachineAccess === 'Individual') return 'Individual Washing Machine'

  return 'Common Washing Machine'
}

export default function PropertyAmenities({ facilities, washingMachineAccess }: PropertyAmenitiesProps) {
  const uniqueFacilities = getUniqueFacilities(facilities)
  const amenityGroups = getGroupedFacilities(uniqueFacilities)
  const featuredFacilities = getFeaturedFacilities(uniqueFacilities)

  return (
    <section className="rounded-[2rem] border border-[#DDE8DD] bg-[#FFFFFF] p-5 shadow-xl shadow-slate-900/5 md:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
            Comforts
          </p>
          <h2 className="text-3xl font-black tracking-tighter text-[#1C1008]">Amenities</h2>
        </div>
        <span className="rounded-full border border-[#DDE8DD] bg-[#F6F8F4] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
          {uniqueFacilities.length} included
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-[#DDE8DD] bg-[#F6F8F4] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Included</p>
              <p className="text-2xl font-black tracking-tighter text-[#1C1008]">{uniqueFacilities.length}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white px-3 py-2.5">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Groups</p>
              <p className="mt-1 text-lg font-black text-[#1C1008]">{amenityGroups.length}</p>
            </div>
            <div className="rounded-2xl bg-white px-3 py-2.5">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Shown</p>
              <p className="mt-1 text-lg font-black text-[#1C1008]">All</p>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {featuredFacilities.map((facility) => {
              const Icon = facilityIcons[facility] || CheckCircle2
              const displayName = getFacilityDisplayName(facility, washingMachineAccess)

              return (
                <div
                  key={facility}
                  className="flex min-h-28 flex-col justify-between rounded-2xl border border-[#DDE8DD] bg-[#EEF4EE] p-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-3 break-words text-xs font-black leading-tight text-[#1C1008]">
                    {displayName}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {amenityGroups.map((group) => {
              const GroupIcon = group.icon

              return (
                <div key={group.title} className={`rounded-2xl border p-3 ${group.tone}`}>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/80">
                        <GroupIcon className="h-4 w-4" />
                      </div>
                      <h3 className="truncate text-xs font-black uppercase tracking-widest">
                        {group.title}
                      </h3>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/80 px-2 py-1 text-[10px] font-black">
                      {group.facilities.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.facilities.map((facility) => {
                      const Icon = facilityIcons[facility] || CheckCircle2
                      const displayName = getFacilityDisplayName(facility, washingMachineAccess)

                      return (
                        <span
                          key={facility}
                          className="inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-xl bg-white/85 px-2.5 py-1.5 text-[11px] font-black leading-tight text-slate-700 shadow-sm"
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0 text-current" />
                          <span className="min-w-0 break-words">{displayName}</span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
