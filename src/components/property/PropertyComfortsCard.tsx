"use client"

import { useState } from 'react'
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
  Compass,
  Droplets,
  Fan,
  Fingerprint,
  Flame,
  GlassWater,
  Home,
  LampDesk,
  Microwave,
  PanelsTopLeft,
  PawPrint,
  PlugZap,
  ShelvingUnit,
  ShieldUser,
  Sofa,
  Sparkles,
  Table,
  Thermometer,
  Tv,
  User,
  WashingMachine,
  Wifi,
  Wind,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { UtilityBillsIncluded, WashingMachineAccess } from '@/types'

type Tab = 'amenities' | 'details' | 'bills'

interface PropertyComfortsCardProps {
  facilities?: string[]
  washingMachineAccess?: WashingMachineAccess
  facing?: string | null
  floorNumber?: number | null
  totalFloors?: number | null
  preferredTenants?: 'Family' | 'Bachelor' | 'Any' | null
  petsAllowed?: boolean | null
  hasBalcony?: boolean | null
  societyName?: string | null
  utilityBillsIncluded?: UtilityBillsIncluded
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

interface DetailItem {
  label: string
  value: string
  icon: LucideIcon
  accent?: 'positive'
}

interface BillItem {
  label: string
  included: boolean
  icon: LucideIcon
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

const formatFloor = (floorNumber?: number | null, totalFloors?: number | null) => {
  if (typeof floorNumber === 'number' && typeof totalFloors === 'number') {
    return `${floorNumber} of ${totalFloors}`
  }

  if (typeof floorNumber === 'number') {
    return `Floor ${floorNumber}`
  }

  return 'N/A'
}

export default function PropertyComfortsCard({
  facilities,
  washingMachineAccess,
  facing,
  floorNumber,
  totalFloors,
  preferredTenants,
  petsAllowed,
  hasBalcony,
  societyName,
  utilityBillsIncluded,
}: PropertyComfortsCardProps) {
  const [tab, setTab] = useState<Tab>('amenities')

  const uniqueFacilities = getUniqueFacilities(facilities || [])
  const amenityGroups = getGroupedFacilities(uniqueFacilities)

  const details: DetailItem[] = [
    { label: 'Facing', value: facing || 'N/A', icon: Compass },
    { label: 'Floor', value: formatFloor(floorNumber, totalFloors), icon: Building2 },
    { label: 'Tenants', value: preferredTenants || 'Any', icon: User },
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
    { label: 'Society', value: societyName?.trim() || 'Private', icon: Home },
  ]

  const bills: BillItem[] = [
    { label: 'Electricity', included: utilityBillsIncluded?.electricity === true, icon: Zap },
    { label: 'WiFi', included: utilityBillsIncluded?.wifi === true, icon: Wifi },
    { label: 'Water', included: utilityBillsIncluded?.water !== false, icon: Droplets },
  ]

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'amenities', label: 'Amenities', count: uniqueFacilities.length },
    { key: 'details', label: 'Details', count: details.length },
    { key: 'bills', label: 'Bills', count: bills.length },
  ]

  return (
    <section className="rounded-[2rem] border border-[#DDE8DD] bg-[#FFFFFF] p-5 shadow-xl shadow-slate-900/5 md:p-6">
      <div className="mb-5">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
          Comforts &amp; Profile
        </p>
        <h2 className="text-2xl font-black tracking-tighter text-[#1C1008] sm:text-3xl">
          Amenities, Details &amp; Bills
        </h2>
      </div>

      <div className="mb-6 inline-flex items-center gap-1 rounded-2xl border border-[#DDE8DD] bg-[#F6F8F4] p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition-colors sm:px-4 ${
              tab === t.key ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                tab === t.key ? 'bg-[#FBEAE0] text-primary' : 'bg-white text-slate-400'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {tab === 'amenities' && (
        uniqueFacilities.length > 0 ? (
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
        ) : (
          <p className="text-sm font-semibold text-slate-500">No amenities listed for this flat yet.</p>
        )
      )}

      {tab === 'details' && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {details.map((detail) => {
            const Icon = detail.icon

            return (
              <div key={detail.label} className="min-h-[100px] rounded-2xl border border-[#DDE8DD] bg-white p-3">
                <span className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF4EE] text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{detail.label}</p>
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
      )}

      {tab === 'bills' && (
        <div className="grid grid-cols-3 gap-3">
          {bills.map((bill) => {
            const Icon = bill.icon

            return (
              <div
                key={bill.label}
                className={`min-h-24 rounded-2xl border p-3 ${
                  bill.included
                    ? 'border-green-100 bg-green-50 text-green-700'
                    : 'border-[#E2EAE2] bg-[#F6F8F4] text-slate-500'
                }`}
              >
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest">{bill.label}</p>
                <p className="mt-1 text-xs font-black leading-tight text-[#1C1008]">
                  {bill.included ? 'Included in rent' : 'Excluded from rent'}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
