'use client'

import { Property, SiteSettings } from '@/types'
import PropertyCard from '@/components/home/PropertyCard'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface SimilarPropertiesProps {
  properties: Property[]
  settings?: SiteSettings | null
}

export default function SimilarProperties({ properties, settings }: SimilarPropertiesProps) {
  if (!properties || properties.length === 0) return null

  return (
    <section className="rounded-[2rem] border border-[#DDE8DD] bg-[#FFFFFF] p-5 shadow-xl shadow-slate-900/5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
          Keep exploring
        </p>
      </div>
      <h2 className="mb-6 text-2xl font-black tracking-tighter text-[#1C1008]">
        Similar flats nearby
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
        {properties.map((property, index) => (
          <motion.div
            key={property._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <PropertyCard property={property} settings={settings} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
