import type { FastifyPluginAsync, RegisterOptions } from 'fastify'
import searchRoute from './handlers/search'

export type ServiceInfoRoutesOptions = RegisterOptions

export const bandRoutes: FastifyPluginAsync<ServiceInfoRoutesOptions> = async (
    fastify,
    options
) => {
    await fastify.register(searchRoute, options)
}
