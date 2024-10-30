describe('Environment-based configuration', () => {
    const originalEnvironment = process.env.ENVIRONMENT
    const originalPort = process.env.PORT

    afterEach(() => {
        jest.resetModules()
        process.env.ENVIRONMENT = originalEnvironment
        process.env.PORT = originalPort
    })

    it('should set options to production config when ENVIRONMENT is "production"', async () => {
        process.env.ENVIRONMENT = 'production'

        const { config } = await import('@src/config')

        expect(config.logger).toEqual({
            logger: true
        })
    })

    it('should set options to development config when ENVIRONMENT is not "production"', async () => {
        process.env.ENVIRONMENT = 'development'

        const { config } = await import('@src/config')

        expect(config.logger).toEqual({
            logger: {
                transport: {
                    target: 'pino-pretty',
                    options: {
                        translateTime: 'HH:MM:ss Z',
                        ignore: 'pid,hostname'
                    }
                }
            }
        })
    })
})
