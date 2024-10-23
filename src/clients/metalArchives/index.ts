import { FastifyInstance } from 'fastify'
import { createEndpointClient } from '@src/lib/endpointSchemaClient'
import { searchBandAdvancedSchema } from './schema/searchBandAdvanced'
import { searchBandAdvanced } from './searchBandAdvanced'

const searchBandAdvancedClient = createEndpointClient(searchBandAdvancedSchema)

export const createMetalArchivesClient = (_fastify: FastifyInstance) => ({
    searchBand: async (band: string = '', offset: number = 0) => {
        return searchBandAdvanced(
            band,
            offset,
            true,
            {},
            searchBandAdvancedClient
        )
    }
})

export type MetalArchivesClient = ReturnType<typeof createMetalArchivesClient>
