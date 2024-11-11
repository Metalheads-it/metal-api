import { FastifyInstance } from 'fastify'
import { searchBandAdvanced } from './searchBandAdvanced'

export const createMetalArchivesClient = (_fastify: FastifyInstance) => ({
    searchBand: async (
        band: string,
        exactBandMatch: boolean,
        offset: number = 0
    ) => {
        return searchBandAdvanced(band, offset, exactBandMatch, {})
    }
})

export type MetalArchivesClient = ReturnType<typeof createMetalArchivesClient>
