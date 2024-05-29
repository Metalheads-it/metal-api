async function routes(fastify) {
    fastify.register(import('./search.js'));
}

export default routes;
