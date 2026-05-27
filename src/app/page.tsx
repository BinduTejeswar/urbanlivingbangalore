import { getCachedSiteSettings } from '@/sanity/lib/fetchers'
import Hero from '@/components/home/Hero'
import ComfortAmenities from '@/components/home/ComfortAmenities'
import Gallery from '@/components/home/Gallery'
import Footer from '@/components/ui/Footer'
import Navbar from '@/components/ui/Navbar'

export const revalidate = 60

export default async function Home() {
  const settings = await getCachedSiteSettings()

  return (
    <main className="min-h-screen flex flex-col bg-[#0F0D0C] transition-colors duration-500">
      <Navbar variant="dark" settings={settings} showFloatingWhatsapp />
      <Hero />
      
      {/* Quick Stats Section inspired by reference */}
      <section className="py-12 md:py-20 bg-white border-y border-[#E8E2DC] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { label: "Locality", value: "Bangalore", card: "bg-[#EAF7F8] border-[#BFE7EA]" },
            { label: "Brokerage", value: "Zero", card: "bg-[#FFF4E8] border-[#FED7AA]" },
            { label: "Direct", value: "Owner", card: "bg-[#EEF8EF] border-[#CDEBD0]" },
            { label: "Support", value: "24/7", card: "bg-[#F3F0FF] border-[#DDD6FE]" },
          ].map((stat, i) => (
            <div key={i} className={`text-center p-4 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-slate-900/5 border group hover:border-[#1597A1]/40 transition-all ${stat.card}`}>
              <div className="text-lg sm:text-2xl md:text-4xl font-black text-[#1597A1] mb-1 group-hover:scale-110 transition-transform duration-500 truncate">
                {stat.value}
              </div>
              <div className="text-[8px] sm:text-[10px] md:text-xs text-slate-500 font-black uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured/Info Section */}
      <section id="about" className="scroll-mt-24 py-32 bg-[#0F0D0C] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Why We Live in Bangalore?
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl font-medium leading-relaxed">
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
