import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import {
    createMetalArchivesClient,
    MetalArchivesClient
} from '../clients/metalArchives/index'

declare module 'fastify' {
    interface FastifyInstance {
        metalArchives: MetalArchivesClient
    }
}

const metalArchives: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.decorate('metalArchives', createMetalArchivesClient(fastify))
}

export default fp(metalArchives)
