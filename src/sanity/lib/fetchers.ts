import { unstable_cache } from 'next/cache'
import { Property, SiteSettings } from '@/types'
import { publicClient } from './client'
import { propertiesQuery, propertyBySlugQuery, siteSettingsQuery } from './queries'

const CONTENT_REVALIDATE_SECONDS = 60
const SETTINGS_REVALIDATE_SECONDS = 300

export const getCachedProperties = unstable_cache(
  async () => publicClient.fetch<Property[]>(propertiesQuery),
  ['sanity-properties'],
  {
    tags: ['sanity', 'properties'],
    revalidate: CONTENT_REVALIDATE_SECONDS,
  }
)

export const getCachedSiteSettings = unstable_cache(
  async () => publicClient.fetch<SiteSettings>(siteSettingsQuery),
  ['sanity-site-settings'],
  {
    tags: ['sanity', 'site-settings'],
    revalidate: SETTINGS_REVALIDATE_SECONDS,
  }
)

export const getCachedPropertyBySlug = (slug: string) => unstable_cache(
  async (s: string) => publicClient.fetch<Property>(propertyBySlugQuery, { slug: s }),
  ['sanity-property-by-slug', slug],
  {
    tags: ['sanity', 'property', slug],
    revalidate: CONTENT_REVALIDATE_SECONDS,
  }
)(slug)
