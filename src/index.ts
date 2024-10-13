import { build } from '@src/app'
import { options, port } from './config'

const start = async () => {
    const fastify = await build(options)
    try {
        await fastify.listen({ port: port })
    } catch (error) {
        fastify.log.error(error)
        throw error
    }
}
start()
