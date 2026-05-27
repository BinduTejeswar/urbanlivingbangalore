'use client'

import { motion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'

export default function Marquee() {
  const items = [
    'Better Location',
    'Better Value for Money',
    'Better Quality Flats',
    'Better Maintained & Managed',
    'No Brokerage',
    'Direct From Owner',
  ]

  const content = (
    <>
      {[...items, ...items].map((item, index) => (
        <span key={`${item}-${index}`} className="mx-5 inline-flex items-center gap-2">
          <BadgeCheck className="h-7 w-7 shrink-0 text-[#1C1008]" strokeWidth={2.5} />
          {item}
        </span>
      ))}
    </>
  )
  
  return (
    <div className="relative flex overflow-x-hidden bg-[#F4F0DE] dark:bg-[#F4F0DE] text-[#1C1008] py-4 border-y border-[#D9C4A8] font-black text-base md:text-xl">
      <motion.div
        animate={{ x: [-1000, 0] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
        className="whitespace-nowrap flex"
      >
        {content}
      </motion.div>
      <motion.div
        animate={{ x: [-1000, 0] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
        className="absolute top-4 whitespace-nowrap flex"
      >
        {content}
      </motion.div>
    </div>
  )
}
