import { FastifyInstance } from 'fastify';

async function routes(fastify: FastifyInstance) {
    fastify.register(import('./search.js'));
}

export default routes;
