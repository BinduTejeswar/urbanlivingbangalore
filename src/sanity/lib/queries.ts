import { groq } from 'next-sanity'

export const propertiesQuery = groq`*[_type == "property"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  propertyType,
  images,
  videoUrl,
  ownerContacts,
  location,
  pricing,
  furnishingStatus,
  isRecommended,
  facilities,
  hasBalcony,
  facing,
  floorNumber,
  totalFloors,
  availableFrom,
  petsAllowed,
  nearbyPlaces,
  societyName,
  preferredTenants,
  aboutProperty,
  additionalNotes
}`

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  whatsappNumber,
  whatsappMessage,
  contactEmail,
  adminName,
  galleryImages
}`

export const propertyBySlugQuery = groq`*[_type == "property" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  propertyType,
  images,
  videoUrl,
  ownerContacts,
  location,
  pricing,
  furnishingStatus,
  isRecommended,
  facilities,
  hasBalcony,
  facing,
  floorNumber,
  totalFloors,
  availableFrom,
  petsAllowed,
  nearbyPlaces,
  societyName,
  preferredTenants,
  aboutProperty,
  additionalNotes
}`
