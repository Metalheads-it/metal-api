import { FastifyInstance } from 'fastify'
import { createEndpointClient } from '@src/lib/endpointSchemaClient'
import { searchBandSchema } from './schema/searchBand'
import { searchBand } from './searchBand'

const searchBandClient = createEndpointClient(searchBandSchema)

export const createMetalArchivesClient = (_fastify: FastifyInstance) => ({
    searchBand: async (band: string = '', offset: number = 0) => {
        return searchBand(band, offset, searchBandClient)
    }
})

export type MetalArchivesClient = ReturnType<typeof createMetalArchivesClient>
