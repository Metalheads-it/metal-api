async function routes(fastify: any) {
    fastify.register(import('./bands/index.js'), {
        prefix: '/bands',
    });
}

export default routes;
