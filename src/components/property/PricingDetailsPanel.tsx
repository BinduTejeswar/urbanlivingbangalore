import Link from 'next/link'
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Home,
  IndianRupee,
  MessageCircle,
  Ruler,
  Sofa,
  WalletCards,
} from 'lucide-react'

export interface ContactLink {
  key: string
  label: string
  href: string
  isOwner: boolean
}

interface PricingDetailsPanelProps {
  monthlyRent: number
  deposit: {
    value: string
    note: string
  }
  maintenance: {
    value: string
    note: string
  }
  squareFeet: number
  availableFrom?: string
  propertyType: string
  furnishingStatus: string
  contactLinks: ContactLink[]
}

export default function PricingDetailsPanel({
  monthlyRent,
  deposit,
  maintenance,
  squareFeet,
  availableFrom,
  propertyType,
  furnishingStatus,
  contactLinks,
}: PricingDetailsPanelProps) {
  const rentDisplay = monthlyRent.toLocaleString('en-IN')
  const quickDetails = [
    { label: 'Size', value: `${squareFeet} sqft`, note: 'Built-up area', icon: Ruler },
    { label: 'Available', value: availableFrom || 'Immediately', note: 'Move-in date', icon: Calendar },
    { label: 'Type', value: propertyType, note: 'Home layout', icon: Home },
    { label: 'Furnishing', value: furnishingStatus, note: 'Move-in setup', icon: Sofa },
  ]
  const moneyDetails = [
    { label: 'Deposit', value: deposit.value, note: deposit.note, icon: WalletCards },
    { label: 'Maintenance', value: maintenance.value, note: maintenance.note, icon: CheckCircle2 },
  ]

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[#DDE8DD] bg-white shadow-xl shadow-slate-900/5">
      <div className="border-b border-[#DDE8DD] bg-[#F6F8F4] p-4 text-[#1C1008]">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
            Monthly Rent
          </p>
          <span className="rounded-full border border-[#DDE8DD] bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-600">
            No brokerage
          </span>
        </div>

        <div className="flex items-end gap-1.5">
          <IndianRupee className="mb-1 h-5 w-5 text-primary" />
          <span className="text-3xl font-black leading-none tracking-tighter sm:text-4xl">
            {rentDisplay}
          </span>
          <span className="pb-1 text-xs font-black uppercase tracking-widest text-slate-500">/ mo</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="grid grid-cols-2 gap-2.5">
          {moneyDetails.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-[#DDE8DD] bg-[#F6F8F4] p-3"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                <p className="mt-1 break-words text-sm font-black leading-tight text-[#1C1008]">{item.value}</p>
                <p className="mt-1 text-[10px] font-bold leading-tight text-slate-500">
                  {item.note}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-3.5">
          <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            At a glance
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {quickDetails.map((item) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="min-h-20 rounded-2xl border border-[#DDE8DD] bg-white p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF4EE] text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                  <p className="mt-1 break-words text-sm font-black leading-tight text-[#1C1008]">{item.value}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-green-100 bg-green-50 p-3">
          <div className="mb-3 flex items-center gap-3 px-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-widest text-green-700">Owner Contact</p>
              <p className="truncate text-sm font-black text-[#1C1008]">Contact Owner Directly</p>
            </div>
          </div>

          <div className="space-y-2">
            {contactLinks.length > 0 ? (
              contactLinks.map((contact) => (
                <Link
                  key={contact.key}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-black text-white shadow-xl shadow-green-900/15 transition-all hover:bg-green-700 active:scale-95"
                >
                  <span className="min-w-0 truncate">
                    {contact.isOwner ? `Contact ${contact.label}` : 'Chat on WhatsApp'}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-green-100 bg-white px-4 py-3 text-sm font-bold text-slate-500">
                Owner WhatsApp is not available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
