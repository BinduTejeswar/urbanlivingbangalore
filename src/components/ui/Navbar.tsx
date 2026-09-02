'use client'

import type { SiteSettings } from '@/types'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const WHATSAPP_MESSAGE = "Hi, I'm interested in booking a flat listed on UrbanLivingBangalore."

interface NavbarProps {
  variant?: 'default' | 'dark'
  settings?: SiteSettings | null
  showFloatingWhatsapp?: boolean
}

function normalizeWhatsappNumber(phoneNumber?: string) {
  const digits = phoneNumber?.replace(/\D/g, '') || ''

  if (digits.length === 10) {
    return `91${digits}`
  }

  return digits
}

export default function Navbar({ variant = 'default', settings, showFloatingWhatsapp = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileNavHidden, setIsMobileNavHidden] = useState(false)
  const lastScrollYRef = useRef(0)
  const pathname = usePathname()
  void variant
  const shouldAutoHideMobileNavbar = pathname === '/flats' || pathname.startsWith('/flats/')
  const whatsappNumber = normalizeWhatsappNumber(settings?.whatsappNumber)
  const whatsappMessage = settings?.whatsappMessage || WHATSAPP_MESSAGE
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : ''

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      setIsScrolled(currentScrollY > 20)

      if (!shouldAutoHideMobileNavbar || isMenuOpen) {
        setIsMobileNavHidden(false)
        lastScrollYRef.current = currentScrollY
        return
      }

      const isScrollingDown = currentScrollY > lastScrollYRef.current
      const hasMovedEnough = Math.abs(currentScrollY - lastScrollYRef.current) > 8

      if (currentScrollY < 80) {
        setIsMobileNavHidden(false)
      } else if (hasMovedEnough) {
        setIsMobileNavHidden(isScrollingDown)
      }

      lastScrollYRef.current = currentScrollY
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMenuOpen, shouldAutoHideMobileNavbar])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore Flats', href: '/flats' },
    { name: 'Amenities', href: '/#amenities' },
    { name: 'About', href: '/#about' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Contact', href: '/#contact' },
  ]

  const navClass = `fixed top-0 w-full z-[100] border-b border-[#E6DDD0] bg-[#F3ECE3]/92 backdrop-blur-xl transition-all duration-300 ${
    isScrolled || isMenuOpen ? 'py-3' : 'py-4'
  } ${
    shouldAutoHideMobileNavbar && isMobileNavHidden && !isMenuOpen ? '-translate-y-full md:translate-y-0' : 'translate-y-0'
  }`
  const getLinkClass = (href: string, mobile = false) => {
    const isActive = href === '/' ? pathname === href : pathname === href.split('#')[0]

    if (mobile) {
      return `text-base font-semibold ${isActive ? 'text-primary' : 'text-[#4A403A]'}`
    }

    return `text-sm font-semibold transition-colors ${isActive ? 'text-[#1C1008]' : 'text-[#6B5D4F] hover:text-[#1C1008]'}`
  }

  return (
    <>
      <nav className={navClass}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tighter text-[#2A1B13] md:text-xl">
            <div className="relative h-10 w-10 overflow-hidden rounded-sm shadow-lg shadow-black/10">
              <Image
                src="/logo-circle.png"
                alt="UrbanLivingBangalore logo"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:inline">
              Urban<span className="font-serif font-normal italic text-primary">Living</span>Bangalore
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={getLinkClass(link.href)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/10 transition-transform hover:scale-[1.03] active:scale-95"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_0_rgba(52,211,153,0.75)] animate-pulse" />
              Book Now
            </Link>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button 
              className="p-1.5 text-[#2A1B13]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed inset-0 z-[200] overflow-y-auto bg-white md:hidden"
          >
            <div className="flex min-h-screen flex-col">
              <div className="flex items-center justify-between border-b border-[#ECE7E1] px-4 py-4">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex min-w-0 items-center gap-2 text-2xl font-black tracking-tighter text-[#2A1B13]"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm shadow-lg shadow-black/10">
                    <Image
                      src="/logo-circle.png"
                      alt="UrbanLivingBangalore logo"
                      fill
                      sizes="56px"
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="min-w-0 truncate">
                    Urban<span className="font-serif font-normal italic text-primary">Living</span>Bangalore
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close navigation"
                  className="shrink-0 p-2 text-[#4A403A]"
                >
                  <X size={26} />
                </button>
              </div>

              <div className="flex flex-1 flex-col px-7 py-6">
                <div className="flex flex-col gap-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      onClick={() => setIsMenuOpen(false)}
                      className={getLinkClass(link.href, true)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <Link
                  href="/#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-10 flex h-12 items-center justify-center rounded-full bg-primary px-5 text-base font-bold text-white shadow-lg shadow-orange-950/10"
                >
                  Book a Visit
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showFloatingWhatsapp && whatsappUrl && (
        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact on WhatsApp"
          className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+6rem)] z-[95] flex h-12 w-12 items-center justify-center rounded-full bg-[#12A150] text-white shadow-2xl shadow-green-950/25 transition-transform hover:scale-105 active:scale-95 md:bottom-6"
        >
          <MessageCircle className="h-6 w-6" />
        </Link>
      )}
    </>
  )
}
