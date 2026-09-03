"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface PropertyFAQProps {
  depositValue: string
  depositNote: string
  hasParking: boolean
  petsAllowed?: boolean | null
  availableFrom?: string
}

export default function PropertyFAQ({
  depositValue,
  depositNote,
  hasParking,
  petsAllowed,
  availableFrom,
}: PropertyFAQProps) {
  const faqs: FAQItem[] = [
    {
      question: 'Is there any brokerage?',
      answer: 'No — this flat is listed directly by the owner, and UrbanLivingBangalore never charges brokerage to tenants.',
    },
    {
      question: "What's the security deposit?",
      answer: `${depositValue}${depositNote ? ` (${depositNote.toLowerCase()})` : ''}, refundable at move-out subject to the owner's inspection.`,
    },
    {
      question: 'Is parking included?',
      answer: hasParking
        ? 'Yes, parking is included with this flat — see the Amenities tab above for details.'
        : "This flat doesn't include a dedicated parking spot. Ask the owner about nearby options.",
    },
    {
      question: 'Are pets allowed?',
      answer: petsAllowed ? 'Yes, pets are allowed in this flat.' : 'Pets are not allowed in this flat.',
    },
    {
      question: 'When can I move in?',
      answer: availableFrom
        ? `This flat is available from ${availableFrom}.`
        : 'This flat is available to move in immediately.',
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="rounded-[2rem] border border-[#DDE8DD] bg-[#FFFFFF] p-5 shadow-xl shadow-slate-900/5 md:p-6">
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">Questions</p>
      <h2 className="mb-5 text-2xl font-black tracking-tighter text-[#1C1008] sm:text-3xl">
        Frequently Asked
      </h2>

      <div className="divide-y divide-[#EDE6DB] overflow-hidden rounded-2xl border border-[#DDE8DD]">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index

          return (
            <div key={faq.question} className="bg-white">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-black text-[#1C1008]"
              >
                {faq.question}
                <Plus className={`h-4 w-4 shrink-0 text-primary transition-transform ${isOpen ? 'rotate-45' : ''}`} />
              </button>
              {isOpen && (
                <p className="px-4 pb-4 text-sm font-semibold leading-6 text-slate-600">
                  {faq.answer}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
