async function routes(fastify) {
    fastify.register(import('./bands/index.js'), {
        prefix: '/bands',
    });
}

export default routes;
