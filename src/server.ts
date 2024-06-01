import { build } from './app.js';
import { options, port } from './config.js';

const start = async () => {
    const fastify = build(options);
    try {
        await fastify.listen({ port: port });
    } catch (error) {
        fastify.log.error(error);
        throw error;
    }
};
start();
