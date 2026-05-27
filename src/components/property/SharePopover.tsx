'use client'

import { useEffect, useRef, useState } from 'react'
import { Share2, Link as LinkIcon, MessageCircle, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SharePopoverProps {
  propertyName: string
  variant?: 'default' | 'icon'
}

export default function SharePopover({ propertyName, variant = 'default' }: SharePopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const url = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!popoverRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setIsOpen(false)
    }, 2000)
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this flat: ${propertyName} - ${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  return (
    <div ref={popoverRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          variant === 'icon'
            ? "flex items-center justify-center bg-white/90 backdrop-blur-md text-[#1C1008] p-3 rounded-xl font-black hover:bg-primary hover:text-white transition-all border border-[#DDE8DD] shadow-xl"
            : "flex items-center gap-3 bg-white text-[#1C1008] px-6 py-4 rounded-2xl font-black hover:bg-[#EEF4EE] transition-all border border-[#DDE8DD] shadow-xl"
        }
      >
        <Share2 className="w-4 h-4" />
        {variant === 'default' && <span>Share</span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(35,55,35,0.14)] border border-[#DDE8DD] overflow-hidden z-50 p-3"
          >
            <button
              onClick={copyLink}
              className="flex items-center justify-between w-full p-4 hover:bg-[#EEF4EE] rounded-2xl transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <LinkIcon className="w-5 h-5 text-slate-500 group-hover:text-primary" />
                <span className="text-sm font-black text-[#1C1008]">{copied ? 'COPIED!' : 'COPY LINK'}</span>
              </div>
              {copied && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            </button>
            <button
              onClick={shareWhatsApp}
              className="flex items-center gap-4 w-full p-4 hover:bg-[#EEF4EE] rounded-2xl transition-colors text-left group"
            >
              <MessageCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-black text-[#1C1008] uppercase">Share on WhatsApp</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
