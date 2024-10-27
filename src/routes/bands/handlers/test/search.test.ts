import nock from 'nock'
import { build } from '@src/app'
import { FastifyInstance } from 'fastify'
import { config } from '@src/config'
import { searchBandAdvancedResponseFixture } from '@src/tests/fixtures/clients/metalArchives/searchBandAdvanced'

describe('Search Band', () => {
    let server: FastifyInstance

    beforeAll(async () => {
        server = await build()
    })

    afterAll(async () => {
        await server.close()
    })

    afterEach(() => {
        nock.cleanAll()
    })

    it('Should return search results, supply bandname no offset', async () => {
        nock(config.metalArchives.searchBandAdvancedUrl)
            .get('/')
            .query(true)
            .reply(200, searchBandAdvancedResponseFixture)

        const response = await server.inject({
            method: 'GET',
            url: '/bands/search/?band=immortal'
        })

        expect(response.statusCode).toEqual(200)
        expect(nock.isDone()).toBe(true)
    })

    it('Should return search results, supply bandname and offset', async () => {
        nock(config.metalArchives.searchBandAdvancedUrl)
            .get('/')
            .query(true)
            .reply(200, searchBandAdvancedResponseFixture)

        const response = await server.inject({
            method: 'GET',
            url: '/bands/search/?band=immortal&offset=0'
        })

        expect(response.statusCode).toEqual(200)
        expect(nock.isDone()).toBe(true)
    })

    it('Should handle empty band name', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/bands/search/?band='
        })

        expect(response.statusCode).toEqual(400)
    })

    it('Should return validation error for invalid offset', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/bands/search/?band=immortal&offset=-1'
        })

        expect(response.statusCode).toEqual(400)
        expect(response.json().message).toContain('offset')
    })

    it('Should handle an unexpected API response', async () => {
        const malformedResponse = {
            iTotalRecords: undefined,
            results: undefined
        }
        nock(config.metalArchives.searchBandAdvancedUrl)
            .get('/')
            .query(true)
            .reply(200, malformedResponse)

        const response = await server.inject({
            method: 'GET',
            url: '/bands/search/?band=immortal&offset=0'
        })

        expect(response.statusCode).toEqual(500)
        expect(nock.isDone()).toBe(true)
    })

    it('Should handle a 500 error from the external API', async () => {
        nock(config.metalArchives.searchBandAdvancedUrl)
            .get('/')
            .query(true)
            .reply(500)

        const response = await server.inject({
            method: 'GET',
            url: '/bands/search/?band=immortal'
        })

        expect(response.statusCode).toEqual(500)
        expect(nock.isDone()).toBe(true)
    })
})
