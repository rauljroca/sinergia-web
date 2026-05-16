import { createClient } from 'next-sanity'

export const client = createClient({
    projectId: 'q6wo9gxa',
    dataset: 'production',
    apiVersion: '2026-01-01',
    useCdn: false, // En false para que veas los cambios al instante
})
