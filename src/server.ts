import { build } from './app.js';
import { config } from './config.js';

const environment: string = process.env.ENVIRONMENT ?? 'development';
const start = async () => {
    const fastify = build({ logger: config?.logging[environment] ?? true });
    try {
        fastify.listen({ port: config?.port });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
