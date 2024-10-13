import type { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { SearchBandQuery, searchBandSchema } from '../schema/search'
import { ServiceInfoRoutesOptions } from '../index'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

const searchBand = async (data: SearchBandQuery, fastify: FastifyInstance) => {
    const { band, offset = 0 } = data

    const { countTotal, countCurrent, results } =
        await fastify.metalArchives.searchBand(band, offset)

    return {
        search: band,
        offset,
        countTotal,
        countCurrent,
        results
    }
}

export const searchRoute: FastifyPluginAsync<
    ServiceInfoRoutesOptions
> = async fastify => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>()

    server.get('/bands/search/', {
        schema: searchBandSchema,
        handler: async (request, reply) => {
            const data = request.query

            const response = await searchBand(data, fastify)

            reply.code(200).send(response)
        }
    })
}

export default searchRoute
