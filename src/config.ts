import envSchema from 'env-schema'
import type { FromSchema } from 'json-schema-to-ts'

const schema = {
    type: 'object',
    properties: {
        ENVIRONMENT: {
            type: 'string',
            enum: ['development', 'production', 'test'],
            default: 'development'
        },
        PORT: {
            type: 'number',
            minimum: 1,
            maximum: 65535,
            default: 3000
        }
    },
    required: ['ENVIRONMENT']
} as const

const configuration: FromSchema<typeof schema> = envSchema({
    dotenv: true,
    schema
})

const isProduction = process.env.ENVIRONMENT === 'production' ? true : false

const productionLogging = {
    logger: true
}

const developmentLogging = {
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

export const config = {
    isProduction,
    server: {
        port: configuration.PORT
    },
    logger: isProduction ? productionLogging : developmentLogging,
    metalArchives: {
        searchBandUrl:
            'https://www.metal-archives.com/search/ajax-band-search/',
        searchBandAdvancedUrl:
            'https://www.metal-archives.com/search/ajax-advanced/searching/bands/'
    }
}
