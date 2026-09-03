export interface SanityImage {
  [key: string]: unknown
  _key?: string
  _type?: string
  asset?: {
    _ref: string
    _type: string
  }
}

export interface OwnerContact {
  _key?: string
  ownerName?: string
  contactNumber: string
}

export interface UtilityBillsIncluded {
  electricity?: boolean
  wifi?: boolean
  water?: boolean
}

export type WashingMachineAccess = 'Common' | 'Individual'

export type NearbyPlaceCategory =
  | 'Shopping Malls'
  | 'Metro & Commute'
  | 'Healthcare'
  | 'Schools'
  | 'Restaurants'
  | 'IT Companies'
  | 'Other'

export interface NearbyPlace {
  _key?: string
  _type?: string
  category?: NearbyPlaceCategory
  name?: string
  distance?: string
}

export interface Property {
  _id: string
  title: string
  slug: { current: string }
  propertyType: '1RK' | '1BHK' | '2BHK' | '3BHK'
  images: SanityImage[]
  videoUrl?: string
  ownerContacts?: OwnerContact[]
  location: {
    area: string
    nearbyAreas?: string[]
    googleMapsUrl: string
  }
  pricing: {
    monthlyRent: number
    depositType?: 'Fixed Amount' | 'Months of Rent'
    depositMonths?: number
    depositAmount: number
    monthlyMaintenance?: number
    maintenanceBilling?: 'Monthly' | 'One-time' | 'Included' | 'None'
    maintenanceNotes?: string
    utilityBillsIncluded?: UtilityBillsIncluded
    squareFeet: number
  }
  unitTypes?: Array<{
    _key: string
    type: '1RK' | '1BHK' | '2BHK' | '3BHK'
    monthlyRent: number
    depositAmount: number
  }>
  furnishingStatus: 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished'
  isRecommended?: boolean
  facilities?: string[]
  washingMachineAccess?: WashingMachineAccess
  hasBalcony?: boolean
  facing?: string
  floorNumber?: number
  totalFloors?: number
  availableFrom?: string
  petsAllowed?: boolean
  nearbyPlaces?: Array<string | NearbyPlace>
  societyName?: string
  preferredTenants?: 'Family' | 'Bachelor' | 'Any'
  aboutProperty?: string
  additionalNotes?: string
}

export interface SiteSettings {
  whatsappNumber: string
  whatsappMessage: string
  contactEmail: string
  adminName: string
  galleryImages?: SanityImage[]
}
