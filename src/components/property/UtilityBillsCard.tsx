import type { UtilityBillsIncluded } from '@/types'
import { cn } from '@/lib/utils'
import { Droplets, Wifi, Zap } from 'lucide-react'

interface UtilityBillsCardProps {
  utilityBillsIncluded?: UtilityBillsIncluded
  className?: string
}

export default function UtilityBillsCard({ utilityBillsIncluded, className }: UtilityBillsCardProps) {
  const utilityBillDetails = [
    { label: 'Electricity', mobileLabel: 'Power', included: utilityBillsIncluded?.electricity === true, icon: Zap },
    { label: 'WiFi', mobileLabel: 'WiFi', included: utilityBillsIncluded?.wifi === true, icon: Wifi },
    { label: 'Water', mobileLabel: 'Water', included: utilityBillsIncluded?.water !== false, icon: Droplets },
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
              <p className="whitespace-nowrap text-[9px] font-black uppercase tracking-normal sm:tracking-widest">
                <span className="sm:hidden">{item.mobileLabel}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </p>
              <p className="mt-1 whitespace-nowrap text-[10px] font-black leading-tight text-[#1C1008]">
                <span className="sm:hidden">{item.included ? 'Included' : 'Excluded'}</span>
                <span className="hidden sm:inline">
                  {item.included ? 'Included in rent' : 'Excluded from rent'}
                </span>
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
