'use client'

import { Property, SiteSettings } from '@/types'
import Link from 'next/link'

interface MobileContactBarProps {
  property: Property
  settings: SiteSettings | null
}

export default function MobileContactBar({ property, settings }: MobileContactBarProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  
  const whatsappUrl = `https://wa.me/${settings?.whatsappNumber || ''}?text=${encodeURIComponent(
    `${settings?.whatsappMessage || ''}\n\nProperty: ${property.title}\nLink: ${baseUrl}/property/${property.slug.current}`
  )}`

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#FAF7F2]/95 backdrop-blur-2xl border-t border-[#EFE2D2] p-6 z-50 shadow-[0_-20px_50px_rgba(92,45,12,0.12)]">
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 bg-green-600 text-white font-black py-4 rounded-2xl transition-all active:scale-95"
      >
        WhatsApp
      </Link>
    </div>
  )
}
