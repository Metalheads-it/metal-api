import Fastify from 'fastify';

const build = (options = {}) => {
    const fastify = Fastify(options);

    fastify.log.info('Start init');
    fastify.register(import('./routes/routes.js'));
    return fastify;
};

export { build };
