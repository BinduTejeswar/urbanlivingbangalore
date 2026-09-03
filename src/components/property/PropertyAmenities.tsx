import {
  AirVent,
  Archive,
  ArrowUpCircle,
  Armchair,
  BedSingle,
  Bike,
  Building2,
  Camera,
  Car,
  CheckCircle2,
  Coffee,
  Fingerprint,
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
}

interface AmenityGroup {
  title: string
  icon: LucideIcon
  facilities: string[]
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
  'Bike Parking': Bike,
  'Car Parking': Car,
  Security: ShieldUser,
  'Biometric Entry': Fingerprint,
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
  },
  {
    title: 'Appliances',
    icon: WashingMachine,
    members: createMemberSet(['TV', 'Washing Machine', 'Refrigerator', 'Microwave', 'Kettle']),
  },
  {
    title: 'Kitchen',
    icon: Flame,
    members: createMemberSet(['Gas Stove', 'Induction Stove', 'Dining Table', 'Kitchen Cabinets']),
  },
  {
    title: 'Furniture',
    icon: Sofa,
    members: createMemberSet(['Sofa', 'Wardrobe', 'Mattress', 'Study Table', 'Chair', 'Curtains']),
  },
  {
    title: 'Climate',
    icon: AirVent,
    members: createMemberSet(['AC', 'Fan', 'Exhaust Fan']),
  },
  {
    title: 'Building',
    icon: Building2,
    members: createMemberSet(['CCTV', 'Lift', 'Security', 'Biometric Entry', 'Bike Parking', 'Car Parking']),
  },
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
    })
  }

  return visibleGroups
}

function getFacilityDisplayName(facility: string, washingMachineAccess?: WashingMachineAccess) {
  if (normalizeFacility(facility) !== 'washing machine') return facility
  if (washingMachineAccess === 'Individual') return 'Individual Washing Machine'

  return 'Common Washing Machine'
}

export default function PropertyAmenities({ facilities, washingMachineAccess }: PropertyAmenitiesProps) {
  const uniqueFacilities = getUniqueFacilities(facilities)
  const amenityGroups = getGroupedFacilities(uniqueFacilities)

  return (
    <section className="rounded-[2rem] border border-[#DDE8DD] bg-[#FFFFFF] p-5 shadow-xl shadow-slate-900/5 md:p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
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

      <div className="flex flex-col gap-6">
        {amenityGroups.map((group, index) => {
          const GroupIcon = group.icon

          return (
            <div key={group.title}>
              {index > 0 && <div className="mb-6 h-px bg-[#EDE6DB]" />}

              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEF4EE] text-primary">
                  <GroupIcon className="h-3.5 w-3.5" />
                </span>
                <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-[#4A3F33]">
                  {group.title}
                </h3>
                <span className="ml-auto rounded-full border border-[#DDE8DD] bg-[#F6F8F4] px-2 py-0.5 text-[10px] font-black text-slate-500">
                  {group.facilities.length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                {group.facilities.map((facility) => {
                  const Icon = facilityIcons[facility] || CheckCircle2
                  const displayName = getFacilityDisplayName(facility, washingMachineAccess)

                  return (
                    <div
                      key={facility}
                      className="flex items-center gap-2.5 rounded-xl border border-[#DDE8DD] bg-[#F8F4EC] px-3 py-2.5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 truncate text-xs font-black text-[#1C1008]">
                        {displayName}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
