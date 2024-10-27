describe('Environment-based configuration', () => {
    const originalEnvironment = process.env.ENVIRONMENT

    afterEach(() => {
        jest.resetModules()
        process.env.ENVIRONMENT = originalEnvironment
    })

    it('should set options to production config when ENVIRONMENT is "production"', async () => {
        process.env.ENVIRONMENT = 'production'

        const { options } = await import('@src/config')

        expect(options).toEqual({
            logger: true
        })
    })

    it('should set options to development config when ENVIRONMENT is not "production"', async () => {
        process.env.ENVIRONMENT = 'development'

        const { options } = await import('@src/config')

        expect(options).toEqual({
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
