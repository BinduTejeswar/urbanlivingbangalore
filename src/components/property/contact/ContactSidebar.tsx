'use client'

import { Property, SiteSettings } from '@/types'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface ContactSidebarProps {
  property: Property
  settings: SiteSettings | null
}

export default function ContactSidebar({ property, settings }: ContactSidebarProps) {
  const whatsappNumber = settings?.whatsappNumber || ''
  const whatsappMessage = settings?.whatsappMessage || ''

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const currentUrl = `${baseUrl}/property/${property.slug.current}`
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `${whatsappMessage}\n\nProperty: ${property.title}\nLink: ${currentUrl}`
  )}`

  return (
    <div className="space-y-6">
      {/* WhatsApp Button */}
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-[2rem] transition-all shadow-xl shadow-green-900/20 active:scale-95"
      >
        <MessageCircle className="w-6 h-6" />
        Chat on WhatsApp
      </Link>

      <div className="bg-[#FFFCF7] border border-[#EFE2D2] rounded-[2rem] p-7 text-center shadow-xl shadow-orange-900/5">
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Direct Listing</p>
        <p className="text-sm text-slate-600 font-bold leading-relaxed">
          Zero Brokerage. Contact the owner directly through the buttons above.
        </p>
      </div>
    </div>
  )
}
