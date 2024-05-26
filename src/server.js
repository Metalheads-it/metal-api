import Fastify from 'fastify';
import { config } from './config.js';

const environment = process.env.ENVIRONMENT ?? 'development';

const fastify = Fastify({
    logger: config?.logging[environment] ?? true, // defaults to true if no entry matches in the map
});

fastify.log.info('Start init');
fastify.register(import('./routes/bands/index.js'));

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
