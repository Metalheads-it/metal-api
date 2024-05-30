const config: any = {
    logging: {
        development: {
            transport: {
                target: 'pino-pretty',
                options: {
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                },
            },
        },
        production: true,
        test: false,
    },
    port: Number(process.env.PORT) || 3000,
};

const environment: string = process.env.ENVIRONMENT ?? 'development';

export { config };
