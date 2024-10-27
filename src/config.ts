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

export const options =
    process.env.ENVIRONMENT === 'production' ? production : development

export const port = Number(process.env.PORT) || 3000

export const config = {
    metalArchives: {
        searchBandUrl:
            'https://www.metal-archives.com/search/ajax-band-search/',
        searchBandAdvancedUrl:
            'https://www.metal-archives.com/search/ajax-advanced/searching/bands/'
    }
}
