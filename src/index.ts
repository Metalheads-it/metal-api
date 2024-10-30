import { build } from '@src/app'
import { config } from './config'

const start = async () => {
    const fastify = await build(config)
    try {
        await fastify.listen({ port: config.server.port })
    } catch (error) {
        fastify.log.error(error)
        throw error
    }
}
start()
