import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'With country code, no + or spaces e.g. 919876543210',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'WhatsApp Message',
      type: 'text',
      description: 'Default pre-filled WhatsApp message',
      initialValue: "Hi, I'm interested in a property listed on We Live in Bangalore",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Email where contact form submissions land',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'adminName',
      title: 'Admin Name',
      type: 'string',
      description: 'Name shown on contact section',
      initialValue: 'We Live in Bangalore Team',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Photos',
      type: 'array',
      description: 'Photos shown in the home page gallery below amenities.',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
})
