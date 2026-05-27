import { getCachedProperties, getCachedSiteSettings } from '@/sanity/lib/fetchers'
import ListingGrid from '@/components/home/ListingGrid'
import ComfortAmenities from '@/components/home/ComfortAmenities'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'No Brokerage Flats in Bangalore | We Live in Bangalore',
  description: 'Explore owner-listed flats in Bangalore with no agents and no brokerage.',
}

export default async function FlatsPage() {
  const [properties, settings] = await Promise.all([
    getCachedProperties(),
    getCachedSiteSettings(),
  ])

  return (
    <main className="min-h-screen flex flex-col bg-[#0F0D0C] text-white transition-colors duration-500">
      <Navbar variant="dark" settings={settings} />
      <ListingGrid properties={properties || []} settings={settings} />
      <ComfortAmenities />
      <Footer settings={settings} compact />
    </main>
  )
}
