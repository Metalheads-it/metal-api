async function routes(fastify: any) {
    fastify.register(import('./search.js'));
}

export default routes;
