import { defineArrayMember, defineField, defineType } from 'sanity'

export const property = defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Property Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'propertyType',
      title: 'Property Type',
      type: 'string',
      options: {
        list: [
          { title: '1RK', value: '1RK' },
          { title: '1BHK', value: '1BHK' },
          { title: '2BHK', value: '2BHK' },
          { title: '3BHK', value: '3BHK' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Optional — paste a YouTube link or Instagram Reel/Post link. If added, the video is shown on the property page.',
    }),
    defineField({
      name: 'ownerContacts',
      title: 'Owner Contacts',
      type: 'array',
      description: 'Add one or more owner contact numbers. The property page will use these numbers for WhatsApp.',
      of: [
        defineArrayMember({
          name: 'ownerContact',
          title: 'Owner Contact',
          type: 'object',
          fields: [
            defineField({
              name: 'ownerName',
              title: 'Owner Name',
              type: 'string',
              description: 'Optional. Example: Ramesh',
            }),
            defineField({
              name: 'contactNumber',
              title: 'Contact Number',
              type: 'string',
              description: 'Include country code if available. For India, a 10 digit number will be treated as +91.',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'ownerName',
              subtitle: 'contactNumber',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Owner',
                subtitle,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({
          name: 'area',
          title: 'Primary Area',
          type: 'string',
          description: 'e.g. Koramangala, Indiranagar',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'nearbyAreas',
          title: 'Nearby Areas',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Add all nearby areas this flat can be discovered under. Example: Indiranagar, Domlur, Ulsoor',
          options: {
            layout: 'tags',
          },
        }),
        defineField({
          name: 'googleMapsUrl',
          title: 'Google Maps Embed URL',
          type: 'url',
          description: 'Go to Google Maps -> Share -> Embed a map -> Copy the "src" attribute from the iframe.',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'object',
      fields: [
        defineField({ name: 'monthlyRent', title: 'Monthly Rent', type: 'number', validation: (Rule) => Rule.required() }),
        defineField({
          name: 'depositType',
          title: 'Deposit Type',
          type: 'string',
          options: {
            list: [
              { title: 'Fixed Amount', value: 'Fixed Amount' },
              { title: 'Months of Rent', value: 'Months of Rent' },
            ],
          },
          initialValue: 'Fixed Amount',
        }),
        defineField({
          name: 'depositMonths',
          title: 'Deposit Months',
          type: 'number',
          description: 'Use when deposit is collected as months of rent. Example: 2',
          hidden: ({ parent }) => parent?.depositType !== 'Months of Rent',
        }),
        defineField({
          name: 'depositAmount',
          title: 'Deposit Amount',
          type: 'number',
          description: 'Exact refundable deposit amount shown on the property page.',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'monthlyMaintenance',
          title: 'Maintenance Amount',
          type: 'number',
          description: 'Enter the maintenance amount. Use Maintenance Billing below to say if it is monthly or one-time.',
        }),
        defineField({
          name: 'maintenanceBilling',
          title: 'Maintenance Billing',
          type: 'string',
          options: {
            list: [
              { title: 'Monthly', value: 'Monthly' },
              { title: 'One-time', value: 'One-time' },
              { title: 'Included in Rent', value: 'Included' },
              { title: 'No Maintenance', value: 'None' },
            ],
          },
          initialValue: 'Monthly',
        }),
        defineField({
          name: 'maintenanceNotes',
          title: 'Maintenance Notes',
          type: 'string',
          description: 'Optional. Example: Collected upfront, paid to association, refundable.',
        }),
        defineField({ name: 'squareFeet', title: 'Square Feet', type: 'number', validation: (Rule) => Rule.required() }),
      ],
    }),
    defineField({
      name: 'furnishingStatus',
      title: 'Furnishing Status',
      type: 'string',
      options: {
        list: [
          { title: 'Fully Furnished', value: 'Fully Furnished' },
          { title: 'Semi Furnished', value: 'Semi Furnished' },
          { title: 'Unfurnished', value: 'Unfurnished' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isRecommended',
      title: 'Recommended',
      type: 'boolean',
      description: 'Highlight this property with a Recommended badge on the flats listing page.',
      initialValue: false,
    }),
    defineField({
      name: 'facilities',
      title: 'Facilities',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'AC', value: 'AC' },
          { title: 'TV', value: 'TV' },
          { title: 'Washing Machine', value: 'Washing Machine' },
          { title: 'Refrigerator', value: 'Refrigerator' },
          { title: 'WiFi', value: 'WiFi' },
          { title: 'Geyser', value: 'Geyser' },
          { title: 'Microwave', value: 'Microwave' },
          { title: 'Sofa', value: 'Sofa' },
          { title: 'Dining Table', value: 'Dining Table' },
          { title: 'Wardrobe', value: 'Wardrobe' },
          { title: 'CCTV', value: 'CCTV' },
          { title: 'Power Backup', value: 'Power Backup' },
          { title: 'Lift', value: 'Lift' },
          { title: 'Bike Parking', value: 'Bike Parking' },
          { title: 'Car Parking', value: 'Car Parking' },
          { title: 'Security', value: 'Security' },
          { title: 'Mattress', value: 'Mattress' },
          { title: 'Kettle', value: 'Kettle' },
          { title: 'Water Purifier', value: 'Water Purifier' },
          { title: 'Gas Stove', value: 'Gas Stove' },
          { title: 'Induction Stove', value: 'Induction Stove' },
          { title: 'Curtains', value: 'Curtains' },
          { title: 'Study Table', value: 'Study Table' },
          { title: 'Chair', value: 'Chair' },
          { title: 'Kitchen Cabinets', value: 'Kitchen Cabinets' },
          { title: 'Exhaust Fan', value: 'Exhaust Fan' },
        ],
      },
    }),
    defineField({
      name: 'hasBalcony',
      title: 'Has Balcony',
      type: 'boolean',
    }),
    defineField({
      name: 'facing',
      title: 'Facing',
      type: 'string',
      options: {
        list: [
          { title: 'East', value: 'East' },
          { title: 'West', value: 'West' },
          { title: 'North', value: 'North' },
          { title: 'South', value: 'South' },
          { title: 'North-East', value: 'North-East' },
          { title: 'North-West', value: 'North-West' },
          { title: 'South-East', value: 'South-East' },
          { title: 'South-West', value: 'South-West' },
        ],
      },
    }),
    defineField({
      name: 'floorNumber',
      title: 'Floor Number',
      type: 'number',
    }),
    defineField({
      name: 'totalFloors',
      title: 'Total Floors',
      type: 'number',
    }),
    defineField({
      name: 'availableFrom',
      title: 'Available From',
      type: 'date',
    }),
    defineField({
      name: 'petsAllowed',
      title: 'Pets Allowed',
      type: 'boolean',
    }),
    defineField({
      name: 'nearbyPlaces',
      title: 'Nearby Places',
      type: 'array',
      description: 'Add nearby places with a category so the property page can group them.',
      of: [
        defineArrayMember({
          name: 'nearbyPlace',
          title: 'Nearby Place',
          type: 'object',
          fields: [
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: 'Shopping Malls', value: 'Shopping Malls' },
                  { title: 'Metro & Commute', value: 'Metro & Commute' },
                  { title: 'Healthcare', value: 'Healthcare' },
                  { title: 'Schools', value: 'Schools' },
                  { title: 'Restaurants', value: 'Restaurants' },
                  { title: 'IT Companies', value: 'IT Companies' },
                  { title: 'Other', value: 'Other' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Place Name',
              type: 'string',
              description: 'Example: Orion Mall, Indiranagar Metro Station, Apollo Clinic',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'distance',
              title: 'Distance / Note',
              type: 'string',
              description: 'Optional. Example: 500m, 1.2km, 10 min walk',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              category: 'category',
              distance: 'distance',
            },
            prepare({ title, category, distance }) {
              return {
                title: title || 'Nearby place',
                subtitle: [category, distance].filter(Boolean).join(' • '),
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'societyName',
      title: 'Society Name',
      type: 'string',
    }),
    defineField({
      name: 'preferredTenants',
      title: 'Preferred Tenants',
      type: 'string',
      options: {
        list: [
          { title: 'Family', value: 'Family' },
          { title: 'Bachelor', value: 'Bachelor' },
          { title: 'Any', value: 'Any' },
        ],
      },
    }),
    defineField({
      name: 'aboutProperty',
      title: 'About Property',
      type: 'text',
      rows: 5,
      description: 'A short description shown on the property detail page. Use this for what makes the flat special.',
    }),
    defineField({
      name: 'additionalNotes',
      title: 'Additional Notes',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
      rent: 'pricing.monthlyRent',
      area: 'location.area',
      isRecommended: 'isRecommended',
    },
    prepare({ title, media, rent, area, isRecommended }) {
      return {
        title: title,
        subtitle: `${isRecommended ? 'Recommended | ' : ''}₹${rent || 0} | ${area || 'N/A'}`,
        media: media,
      }
    },
  },
})
