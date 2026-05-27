import { createClient } from 'next-sanity'

import { adminUseCdn, apiVersion, dataset, projectId, publicUseCdn } from '../env'

export const publicClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: publicUseCdn,
})

export const adminClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: adminUseCdn,
})
