'use strict';

async function routes(fastify) {
    fastify.register(import('./search.js'), {
        prefix: '/bands',
    });
}

export default routes;
