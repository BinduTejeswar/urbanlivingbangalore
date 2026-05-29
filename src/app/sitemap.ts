import type { MetadataRoute } from 'next'
import { getCachedProperties } from '@/sanity/lib/fetchers'

const siteUrl = 'https://www.weliveinbangalore.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getCachedProperties()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/flats`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  const propertyRoutes: MetadataRoute.Sitemap = (properties || [])
    .map((property) => property.slug?.current)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({
      url: `${siteUrl}/flats/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }))

  return [...staticRoutes, ...propertyRoutes]
}
