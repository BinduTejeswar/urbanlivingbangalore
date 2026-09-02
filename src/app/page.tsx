import { getCachedProperties, getCachedSiteSettings } from '@/sanity/lib/fetchers'
import Hero from '@/components/home/Hero'
import ComfortAmenities from '@/components/home/ComfortAmenities'
import Gallery from '@/components/home/Gallery'
import Footer from '@/components/ui/Footer'
import Navbar from '@/components/ui/Navbar'

export const revalidate = 60

export default async function Home() {
  const [settings, properties] = await Promise.all([
    getCachedSiteSettings(),
    getCachedProperties(),
  ])

  const localities = Array.from(new Set(
    (properties || [])
      .flatMap((property) => [property.location.area, ...(property.location.nearbyAreas || [])])
      .map((area) => area?.trim())
      .filter((area): area is string => Boolean(area))
  )).sort()

  const stats = [
    { label: 'Verified Flats', value: `${(properties || []).length}+`, card: 'bg-[#FCEDE3] border-[#F3D2B8]' },
    { label: 'Brokerage Fee', value: '₹0', card: 'bg-[#EAF5F5] border-[#BFE0E0]' },
    { label: 'Localities', value: `${localities.length || 0}+`, card: 'bg-[#FCEDE3] border-[#F3D2B8]' },
    { label: 'Owner Direct', value: '100%', card: 'bg-[#EAF5F5] border-[#BFE0E0]' },
  ]

  return (
    <main className="min-h-screen flex flex-col bg-[#F3ECE3] transition-colors duration-500">
      <Navbar settings={settings} showFloatingWhatsapp />
      <Hero localities={localities} />

      {/* Trust strip */}
      <section className="px-4 md:px-6 py-14 md:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 rounded-3xl overflow-hidden border border-[#E6DDD0] bg-[#E6DDD0] gap-px shadow-xl shadow-black/5">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-5 sm:p-6 md:p-8 bg-white">
              <div className="font-serif text-2xl sm:text-3xl md:text-4xl text-primary mb-1 truncate">
                {stat.value}
              </div>
              <div className="text-[9px] sm:text-[10px] md:text-xs text-[#8A7A68] font-bold uppercase tracking-[0.15em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured/Info Section */}
      <section id="about" className="scroll-mt-24 py-28 md:py-36 bg-[#1C1008] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary mb-5">Our promise</span>
          <h2 className="font-serif text-4xl md:text-6xl font-normal text-white mb-6 tracking-tight">
            Why <span className="italic text-[#D4A373]">UrbanLivingBangalore</span>?
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl font-normal leading-relaxed">
            Finding a home shouldn&apos;t be a nightmare. We provide handpicked, zero-brokerage
            flats directly from owners, ensuring a smooth and warm experience
            for everyone moving to the Silicon Valley of India.
          </p>
        </div>
      </section>

      <ComfortAmenities />

      <Gallery images={settings?.galleryImages} />

      <Footer settings={settings} />
    </main>
  )
}
