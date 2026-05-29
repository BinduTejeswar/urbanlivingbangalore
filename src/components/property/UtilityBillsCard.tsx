import type { UtilityBillsIncluded } from '@/types'
import { cn } from '@/lib/utils'
import { Droplets, Wifi, Zap } from 'lucide-react'

interface UtilityBillsCardProps {
  utilityBillsIncluded?: UtilityBillsIncluded
  className?: string
}

export default function UtilityBillsCard({ utilityBillsIncluded, className }: UtilityBillsCardProps) {
  const utilityBillDetails = [
    { label: 'Electricity', included: Boolean(utilityBillsIncluded?.electricity), icon: Zap },
    { label: 'WiFi', included: Boolean(utilityBillsIncluded?.wifi), icon: Wifi },
    { label: 'Water', included: Boolean(utilityBillsIncluded?.water), icon: Droplets },
  ]

  return (
    <div className={cn('rounded-2xl border border-[#DDE8DD] bg-white p-3', className)}>
      <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
        Bills
      </p>
      <div className="grid grid-cols-3 gap-2">
        {utilityBillDetails.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className={`min-h-20 rounded-xl border p-2.5 ${
                item.included
                  ? 'border-green-100 bg-green-50 text-green-700'
                  : 'border-[#E2EAE2] bg-[#F6F8F4] text-slate-500'
              }`}
            >
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <p className="break-words text-[9px] font-black uppercase tracking-widest">{item.label}</p>
              <p className="mt-1 text-[10px] font-black leading-tight text-[#1C1008]">
                {item.included ? 'Included in rent' : 'Excluded from rent'}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
