import { createClient } from 'next-sanity'

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'q6wo9gxa',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-01',
    useCdn: false, // En false para que veas los cambios al instante
})
