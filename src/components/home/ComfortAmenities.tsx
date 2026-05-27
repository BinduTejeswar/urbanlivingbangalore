import {
  Car,
  House,
  ShieldCheck,
  Sparkles,
  Sun,
  WashingMachine,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ComfortAmenity {
  title: string
  description: string
  icon: LucideIcon
  featured?: boolean
}

const comforts: ComfortAmenity[] = [
  {
    title: 'CCTV Security',
    description: 'Security support with CCTV coverage for everyday peace of mind.',
    icon: ShieldCheck,
    featured: true,
  },
  {
    title: 'Housekeeping',
    description: 'Professional cleaning support so your flat stays fresh and comfortable.',
    icon: Sparkles,
  },
  {
    title: 'Power Backup',
    description: 'Backup support to keep essential routines running smoothly.',
    icon: Zap,
  },
  {
    title: 'Laundry Facilities',
    description: 'Convenient laundry access for easier weekly home care.',
    icon: WashingMachine,
  },
  {
    title: 'Dedicated Parking',
    description: 'Parking support for both 2-wheelers and 4-wheelers where available.',
    icon: Car,
  },
  {
    title: 'Spacious Balconies',
    description: 'Open balcony spaces for fresh air, light, and a quieter pause.',
    icon: Sun,
  },
  {
    title: 'Fully Furnished',
    description: 'Move-in ready homes with essential furniture and practical setup.',
    icon: House,
  },
  {
    title: 'Well Maintained',
    description: 'Clean, cared-for flats with regular upkeep for a smoother stay.',
    icon: Sparkles,
  },
]

export default function ComfortAmenities() {
  return (
    <section id="amenities" className="scroll-mt-24 bg-[#F8F7F5] px-4 py-12 text-[#1C1008] md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            Amenities
          </p>
          <h2 className="text-3xl font-black tracking-tighter sm:text-4xl">
            Everyday Comforts
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {comforts.map((comfort) => {
            const Icon = comfort.icon

            return (
              <article
                key={comfort.title}
                className={`group min-h-0 rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:min-h-64 sm:p-8 ${
                  comfort.featured
                    ? 'border-pink-100 bg-[#FFF1F7] shadow-pink-950/10'
                    : 'border-[#E8E2DC] bg-[#FFFFFF] shadow-slate-900/5'
                }`}
              >
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#1C1008] shadow-sm shadow-slate-900/10 ring-1 ring-black/5">
                  <Icon className={`h-6 w-6 transition-transform group-hover:scale-110 ${comfort.featured ? 'text-pink-600' : ''}`} />
                </div>
                <h3 className="mb-4 text-xl font-black leading-tight text-[#1C1008]">
                  {comfort.title}
                </h3>
                <p className="text-sm font-semibold leading-6 text-stone-500">
                  {comfort.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
