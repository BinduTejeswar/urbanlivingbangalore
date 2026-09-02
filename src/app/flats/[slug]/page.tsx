import { getCachedPropertyBySlug, getCachedSiteSettings } from '@/sanity/lib/fetchers'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import ImageGallery from '@/components/property/gallery/ImageGallery'
import NearbyPlacesSection from '@/components/property/NearbyPlacesSection'
import PropertyDetailsPanel from '@/components/property/PropertyDetailsPanel'
import PricingDetailsPanel, { type ContactLink } from '@/components/property/PricingDetailsPanel'
import PropertyAmenities from '@/components/property/PropertyAmenities'
import SharePopover from '@/components/property/SharePopover'
import UtilityBillsCard from '@/components/property/UtilityBillsCard'
import Footer from '@/components/ui/Footer'
import Navbar from '@/components/ui/Navbar'
import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import { Metadata } from 'next'
import { urlForImage } from '@/sanity/lib/image'

interface PropertyPageProps {
  params: Promise<{ slug: string }>
}

function normalizeWhatsappNumber(phoneNumber?: string) {
  const digits = phoneNumber?.replace(/\D/g, '') || ''

  if (digits.length === 10) {
    return `91${digits}`
  }

  return digits
}

function createWhatsappUrl(phoneNumber: string | undefined, message: string) {
  const whatsappNumber = normalizeWhatsappNumber(phoneNumber)

  if (!whatsappNumber) {
    return ''
  }

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}

const getDisplayAreas = (property: { location: { area: string; nearbyAreas?: string[] } }) => (
  Array.from(new Set([
    property.location.area,
    ...(property.location.nearbyAreas || []),
  ].map((area) => area?.trim()).filter(Boolean)))
)

const getNearbyAreas = (property: { location: { area: string; nearbyAreas?: string[] } }) => {
  const primaryArea = property.location.area?.trim().toLowerCase()

  return Array.from(new Set(
    (property.location.nearbyAreas || [])
      .map((area) => area?.trim())
      .filter((area): area is string => Boolean(area) && area.toLowerCase() !== primaryArea)
  ))
}

const getRequestOrigin = async () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }

  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || 'localhost:3000'
  const protocol = requestHeaders.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')

  return `${protocol}://${host}`
}

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`

const formatDeposit = (pricing: {
  monthlyRent: number
  depositAmount: number
  depositType?: 'Fixed Amount' | 'Months of Rent'
  depositMonths?: number
}) => {
  const isMonthsOfRent = pricing.depositType === 'Months of Rent' && Boolean(pricing.depositMonths)
  const depositAmount = pricing.depositAmount || (
    isMonthsOfRent ? pricing.monthlyRent * Number(pricing.depositMonths) : 0
  )

  return {
    value: formatCurrency(depositAmount),
    note: isMonthsOfRent ? `${pricing.depositMonths} months rent` : '',
  }
}

const formatMaintenance = (pricing: {
  monthlyMaintenance?: number
  maintenanceBilling?: 'Monthly' | 'One-time' | 'Included' | 'None'
  maintenanceNotes?: string
}) => {
  const billing = pricing.maintenanceBilling || (pricing.monthlyMaintenance ? 'Monthly' : 'None')
  const amount = pricing.monthlyMaintenance || 0

  if (billing === 'Included') {
    return { value: 'Included', note: pricing.maintenanceNotes || 'Included in rent' }
  }

  if (billing === 'None') {
    return { value: 'None', note: pricing.maintenanceNotes || 'No maintenance' }
  }

  return {
    value: formatCurrency(amount),
    note: pricing.maintenanceNotes || (billing === 'One-time' ? 'One-time payment' : 'Per month'),
  }
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params
  const property = await getCachedPropertyBySlug(slug)

  if (!property) return { title: 'Property Not Found' }

  const imageUrl = property.images?.[0] ? urlForImage(property.images[0]).url() : ''
  const displayArea = getDisplayAreas(property).join(', ')

  return {
    title: `${property.title} in ${displayArea} | UrbanLivingBangalore`,
    description: `Rent: ₹${property.pricing.monthlyRent}/mo. ${property.propertyType}, ${property.furnishingStatus} flat near ${displayArea}. Zero brokerage.`,
    openGraph: {
      title: `${property.title} | ${displayArea}`,
      description: `₹${property.pricing.monthlyRent}/mo • ${property.propertyType} • ${property.furnishingStatus}`,
      images: [imageUrl],
    },
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params
  const [property, settings] = await Promise.all([
    getCachedPropertyBySlug(slug),
    getCachedSiteSettings(),
  ])

  if (!property) notFound()

  const hasAboutProperty = Boolean(property.aboutProperty?.trim())
  const primaryArea = property.location.area?.trim() || 'Bangalore'
  const nearbyAreas = getNearbyAreas(property)
  const depositDisplay = formatDeposit(property.pricing)
  const maintenanceDisplay = formatMaintenance(property.pricing)
  const baseUrl = await getRequestOrigin()
  const propertyUrl = `${baseUrl}/flats/${property.slug.current}`
  const contactMessage = `${settings?.whatsappMessage || 'Hi, I am interested in this flat.'}\n\nProperty: ${property.title}\nLink: ${propertyUrl}`
  const ownerContactLinks = Array.from(
    new Map(
      (property.ownerContacts || [])
        .map((owner, index) => {
          const whatsappNumber = normalizeWhatsappNumber(owner.contactNumber)
          const ownerName = owner.ownerName?.trim() || `Owner ${index + 1}`

          return [
            whatsappNumber,
            {
              key: owner._key || `${whatsappNumber}-${index}`,
              label: ownerName,
              href: createWhatsappUrl(owner.contactNumber, contactMessage),
              isOwner: true,
            },
          ] as const
        })
        .filter(([whatsappNumber, contact]) => whatsappNumber && contact.href)
    ).values()
  )
  const fallbackWhatsappUrl = createWhatsappUrl(settings?.whatsappNumber, contactMessage)
  const contactLinks: ContactLink[] = ownerContactLinks.length > 0
    ? ownerContactLinks
    : fallbackWhatsappUrl
      ? [{ key: 'site-whatsapp', label: 'WhatsApp', href: fallbackWhatsappUrl, isOwner: false }]
      : []

  return (
    <div className="min-h-screen bg-[#F6F8F4] text-[#1C1008] transition-colors duration-500">
      <Navbar settings={settings} />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-14 md:pt-18">
        {/* Back Button */}
        <div className="mt-px mb-1">
          <Link 
            href="/flats"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold transition-colors group"
          >
            <div className="mt-px p-2 bg-[#FFFFFF] rounded-xl group-hover:scale-110 transition-transform border border-[#DDE8DD]">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </div>
            Back to Listings
          </Link>
        </div>

        <div className="space-y-8">
          <section className="grid grid-cols-1 gap-5 rounded-[1.5rem] border border-[#DDE8DD] bg-[#FFFFFF] p-4 shadow-xl shadow-slate-900/5 sm:p-5 lg:grid-cols-[minmax(320px,460px)_minmax(320px,420px)] lg:items-start lg:justify-center">
            <div className="space-y-6">
              <div className="relative">
                <ImageGallery images={property.images} videoUrl={property.videoUrl} />
                <div className="absolute top-4 right-4 z-20">
                  <SharePopover propertyName={property.title} variant="icon" />
                </div>
              </div>

              {/* Property Name and Location - Strictly Below Image */}
              <div className="px-2 space-y-2">
                <h1 className="text-xl font-black text-[#1C1008] tracking-tighter leading-tight sm:text-2xl">
                  {property.title}
                </h1>
                <div className="space-y-2 text-sm font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span>
                      Located in <span className="font-black text-[#1C1008]">{primaryArea}, Bangalore</span>
                    </span>
                  </div>
                  {nearbyAreas.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pl-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Nearby
                      </span>
                      {nearbyAreas.map((area) => (
                        <span
                          key={area}
                          className="rounded-full border border-[#DDE8DD] bg-[#F6F8F4] px-3 py-1 text-xs font-black text-slate-600"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="pl-6 text-xs font-black uppercase tracking-widest text-primary">
                    No brokerage
                  </div>
                </div>
              </div>

              <UtilityBillsCard
                utilityBillsIncluded={property.pricing.utilityBillsIncluded}
                className="hidden lg:block"
              />
            </div>

            <PricingDetailsPanel
              monthlyRent={property.pricing.monthlyRent}
              deposit={depositDisplay}
              maintenance={maintenanceDisplay}
              squareFeet={property.pricing.squareFeet}
              availableFrom={property.availableFrom}
              propertyType={property.propertyType}
              furnishingStatus={property.furnishingStatus}
              utilityBillsIncluded={property.pricing.utilityBillsIncluded}
              contactLinks={contactLinks}
            />
          </section>

          {hasAboutProperty && (
            <section className="rounded-[2rem] border border-[#DDE8DD] bg-[#FFFFFF] p-5 shadow-xl shadow-slate-900/5 md:p-6">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                About Property
              </p>
              <h2 className="mb-3 text-2xl font-black tracking-tighter text-[#1C1008]">
                A closer look
              </h2>
              <p className="whitespace-pre-line text-sm font-semibold leading-7 text-slate-600 md:text-base">
                {property.aboutProperty}
              </p>
            </section>
          )}

          {property.facilities && property.facilities.length > 0 && (
            <PropertyAmenities
              facilities={property.facilities}
              washingMachineAccess={property.washingMachineAccess}
            />
          )}

          <NearbyPlacesSection places={property.nearbyPlaces} />

          <PropertyDetailsPanel
            facing={property.facing}
            floorNumber={property.floorNumber}
            totalFloors={property.totalFloors}
            preferredTenants={property.preferredTenants}
            petsAllowed={property.petsAllowed}
            hasBalcony={property.hasBalcony}
            societyName={property.societyName}
          />

          {/* Location Map */}
          <section className="rounded-[2rem] border border-[#DDE8DD] bg-[#FFFFFF] p-5 shadow-xl shadow-slate-900/5 md:p-6">
            <h2 className="mb-5 text-2xl font-black tracking-tighter text-[#1C1008]">Location</h2>
            <div className="h-[320px] overflow-hidden rounded-[1.5rem] border border-[#DDE8DD] bg-[#EEF4EE] p-3">
              <iframe
                src={property.location.googleMapsUrl}
                className="w-full h-full rounded-[1.25rem] grayscale contrast-[1.05] opacity-90"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        </div>
      </main>

      <Footer settings={settings} compact />
    </div>
  )
}
