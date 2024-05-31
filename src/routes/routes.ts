import { FastifyInstance } from 'fastify';

async function routes(fastify: FastifyInstance) {
    fastify.register(import('./bands/index.js'), {
        prefix: '/bands',
    });
}

export default routes;
