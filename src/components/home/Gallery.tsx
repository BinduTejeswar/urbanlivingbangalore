import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { SanityImage } from '@/types'

interface GalleryProps {
  images?: SanityImage[]
}

export default function Gallery({ images }: GalleryProps) {
  const galleryImages = images?.filter((image) => image.asset?._ref) || []

  if (galleryImages.length === 0) return null

  return (
    <section id="gallery" className="scroll-mt-24 bg-[#F6F8F4] px-4 py-14 text-[#1C1008] md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
            Gallery
          </p>
          <h2 className="text-3xl font-black tracking-tighter sm:text-4xl">
            A Look Inside
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {galleryImages.map((image, index) => (
            <div
              key={image._key || image.asset?._ref || index}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#DDE8DD] bg-white shadow-sm shadow-slate-900/5"
            >
              <Image
                src={urlForImage(image).width(900).height(675).url()}
                alt={`Gallery photo ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
