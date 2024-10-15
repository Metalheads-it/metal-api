import Fastify from 'fastify'
import metalArchives from './plugins/metalArchives'
import { bandRoutes } from './routes/bands'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

const build = async (options = {}) => {
    const fastify = Fastify(options)

    fastify.log.info('Start init')

    await fastify.register(metalArchives)

    await fastify.register(fastifySwagger)
    await fastify.register(fastifySwaggerUi, {
        routePrefix: '/documentation',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        }
    })

    await fastify.register(bandRoutes)

    return fastify
}

export { build }
