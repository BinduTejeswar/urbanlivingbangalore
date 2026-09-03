'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, Search, ShieldCheck } from 'lucide-react'
import Marquee from './Marquee'

const BUDGET_OPTIONS = [
  { label: 'Any budget', value: 'All' },
  { label: 'Under ₹15k', value: 'Under 15k' },
  { label: '₹15k – ₹30k', value: '15k-30k' },
  { label: '₹30k – ₹40k', value: '30k-40k' },
  { label: '₹40k+', value: '40k+' },
]

interface HeroProps {
  localities?: string[]
}

export default function Hero({ localities = [] }: HeroProps) {
  const router = useRouter()
  const [locality, setLocality] = useState('All')
  const [budget, setBudget] = useState('All')

  const handleSearch = () => {
    try {
      const saved = window.localStorage.getItem('propertyFilters')
      const existing = saved ? JSON.parse(saved) : {}
      window.localStorage.setItem('propertyFilters', JSON.stringify({
        ...existing,
        locality,
        budget,
      }))
    } catch {
      // localStorage unavailable (private browsing, etc.) — filters just won't be pre-applied.
    }
    router.push('/flats')
  }

  return (
    <section className="relative overflow-hidden bg-[#F3ECE3] pt-36 pb-28 md:pt-44 md:pb-36">
      {/* Illustrated house scene, hand-drawn to match the brand palette */}
      <img
        src="/hero-house-scene.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[320px] w-full object-cover object-bottom opacity-95 md:h-[420px]"
      />

      {/* Decorative warm glow, no stock photography */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-32 h-[560px] w-[560px] rounded-full opacity-70 blur-2xl"
        style={{ background: 'radial-gradient(circle, rgba(212,163,115,0.55), transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 h-[380px] w-[380px] rounded-full opacity-50 blur-2xl"
        style={{ background: 'radial-gradient(circle, rgba(21,151,161,0.18), transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Zero Brokerage, Always
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="font-serif text-5xl font-normal leading-[1.02] tracking-tight text-[#1C1008] sm:text-6xl md:text-7xl"
        >
          Bangalore living,
          <br />
          <span className="italic text-primary">minus the agent.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#6B5D4F] md:text-lg"
        >
          Handpicked flats listed directly by owners across Bangalore. Browse, compare and move in — no brokerage, no middlemen, no drama.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="mx-auto mt-10 flex max-w-xl flex-col gap-2 rounded-3xl border border-[#E6DDD0] bg-white p-2 shadow-xl shadow-black/5 sm:flex-row sm:items-stretch"
        >
          <div className="flex-1 rounded-2xl px-5 py-3 text-left sm:border-r sm:border-[#EDE6DB]">
            <label htmlFor="hero-locality" className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7A68]">
              Locality
            </label>
            <select
              id="hero-locality"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full appearance-none bg-transparent text-sm font-semibold text-[#1C1008] outline-none"
            >
              <option value="All">Anywhere in Bangalore</option>
              {localities.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 rounded-2xl px-5 py-3 text-left">
            <label htmlFor="hero-budget" className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A7A68]">
              Budget
            </label>
            <select
              id="hero-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full appearance-none bg-transparent text-sm font-semibold text-[#1C1008] outline-none"
            >
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="group flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 sm:py-0"
          >
            <Search className="h-4 w-4" />
            Search
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </div>

      <div className="relative z-10 mt-16 md:mt-20">
        <Marquee />
      </div>
    </section>
  )
}
