interface ILoggingConfig {
    transport: {
        target: string
        options: {
            translateTime: string
            ignore: string
        }
    }
}

interface Config {
    logger: ILoggingConfig | boolean
}

const production: Config = {
    logger: true
}

const development: Config = {
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname'
            }
        }
    }
}

const options =
    process.env.ENVIRONMENT === 'production' ? production : development

const port = Number(process.env.PORT) || 3000

export { options, port }
