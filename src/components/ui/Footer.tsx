'use client'

import { SiteSettings } from '@/types'
import Link from 'next/link'
import { MessageCircle, Home as HomeIcon } from 'lucide-react'

interface FooterProps {
  settings: SiteSettings | null
  compact?: boolean
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function Footer({ settings, compact = false }: FooterProps) {
  const whatsappUrl = settings 
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`
    : '#'
  const instagramUrl = 'https://www.instagram.com/urbanlivingbangalore'

  return (
    <footer id="contact" className={`scroll-mt-28 text-white ${compact ? 'bg-[#0F0D0C] py-10 border-t border-white/5' : 'bg-[#0F0D0C] py-24 border-t border-white/5'} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {!compact && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-20">
            <div className="space-y-6">
              <Link href="/" className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                <div className="bg-primary p-2 rounded-xl">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                Urban<span className="font-serif font-normal italic text-[#D4A373]">Living</span>Bangalore
              </Link>
              <p className="text-slate-400 max-w-sm text-lg font-normal">
                Beautifully curated flats in Bangalore&apos;s best neighborhoods.
                Zero brokerage, just comfort.
              </p>
            </div>

            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-2xl shadow-green-900/20 active:scale-95"
            >
              <MessageCircle className="w-6 h-6" />
              Chat on WhatsApp
            </Link>
          </div>
        )}

        <div className={`${compact ? '' : 'pt-12 border-t border-white/5'} flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black uppercase tracking-[0.2em] text-slate-500`}>
          <p>© {new Date().getFullYear()} UrbanLivingBangalore</p>
          <div className="flex items-center gap-6 md:gap-8">
            <span className="text-primary/60">No Brokerage</span>
            <span className="text-primary/60">Direct From Owner</span>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow UrbanLivingBangalore on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-white/10 text-primary transition-all hover:border-primary hover:bg-primary hover:text-white"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
