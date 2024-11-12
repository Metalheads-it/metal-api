import * as searchBandAdvancedModule from '../searchBandAdvanced'

import { HttpMethod } from '@src/shared/constants'
import { searchBandAdvancedQueryFixture } from '@src/tests/fixtures/clients/metalArchives/searchBandAdvanced'
import { config } from '@src/config'
import { SearchBandAdvancedEntry } from '../schema/searchBandAdvanced'
import { extractBandInfo } from '../common'

jest.mock('../common', () => ({
    extractBandInfo: jest.fn()
}))

jest.mock('@src/config', () => ({
    config: {
        metalArchives: { searchBandAdvancedUrl: 'https://mock-api.com/search' }
    }
}))

const returnFixture = {
    iTotalRecords: 50,
    iTotalDisplayRecords: 50,
    sEcho: 1,
    aaData: []
}

describe('searchBandAdvanced', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should call searchBandAdvancedClient with correct default parameters', async () => {
        // Mock the `searchBandAdvancedClient` function within the `searchBandAdvancedModule`
        jest.spyOn(
            searchBandAdvancedModule,
            'searchBandAdvancedClient'
        ).mockResolvedValueOnce(returnFixture)

        await searchBandAdvancedModule.searchBandAdvanced(
            undefined,
            // eslint-disable-next-line unicorn/no-useless-undefined
            undefined,
            undefined,
            {}
        )

        expect(
            searchBandAdvancedModule.searchBandAdvancedClient
        ).toHaveBeenCalledWith({
            method: HttpMethod.GET,
            url: 'https://mock-api.com/search',
            params: {
                ...searchBandAdvancedQueryFixture,
                bandName: ''
            }
        })
    })

    it('should include only relevant conditional parameters in the API call', async () => {
        jest.spyOn(
            searchBandAdvancedModule,
            'searchBandAdvancedClient'
        ).mockResolvedValueOnce(returnFixture)

        await searchBandAdvancedModule.searchBandAdvanced(
            'Test Band',
            10,
            true,
            {
                genre: 'rock',
                country: 'US',
                yearCreationFrom: 1990,
                bandNotes: 'Legendary band'
            }
        )

        expect(
            searchBandAdvancedModule.searchBandAdvancedClient
        ).toHaveBeenCalledWith({
            method: HttpMethod.GET,
            url: config.metalArchives.searchBandAdvancedUrl,
            params: {
                bandName: 'Test Band',
                exactBandMatch: true,
                status: [1, 2, 3, 4, 5, 6],
                sEcho: 1,
                iColumns: 6,
                sColumns: '',
                iDisplayStart: 10,
                iDisplayLength: 200,
                mDataProp_0: 0,
                mDataProp_1: 1,
                mDataProp_2: 2,
                mDataProp_3: 3,
                mDataProp_4: 4,
                mDataProp_5: 5,
                genre: 'rock',
                country: 'US',
                yearCreationFrom: 1990,
                bandNotes: 'Legendary band'
            }
        })
    })

    it('should return transformed search results', async () => {
        const mockEntry = [
            '<a href="https://link.com/id/123">Test Band</a>',
            'Metal',
            'US',
            'New York',
            'Dark Themes',
            '1999',
            'Famous Label'
        ] satisfies SearchBandAdvancedEntry

        const mockClientResponse = { ...returnFixture, aaData: [mockEntry] }

        jest.spyOn(
            searchBandAdvancedModule,
            'searchBandAdvancedClient'
        ).mockResolvedValueOnce(mockClientResponse)
        ;(extractBandInfo as jest.Mock).mockReturnValue({
            band: 'Test Band',
            link: 'https://link.com/id/123',
            id: '123'
        })

        const result = await searchBandAdvancedModule.searchBandAdvanced(
            'Test Band',
            // eslint-disable-next-line unicorn/no-useless-undefined
            undefined,
            undefined,
            {}
        )

        expect(result.countTotal).toBe(50)
        expect(result.countCurrent).toBe(1)
        expect(result.results).toEqual([
            {
                band: 'Test Band',
                link: 'https://link.com/id/123',
                id: '123',
                genre: 'Metal',
                country: 'US'
            }
        ])
    })

    it('should call searchBandAdvancedClient with conditional parameters', async () => {
        jest.spyOn(
            searchBandAdvancedModule,
            'searchBandAdvancedClient'
        ).mockResolvedValueOnce(returnFixture)

        await searchBandAdvancedModule.searchBandAdvanced(
            'Test Band',
            10,
            true,
            {
                genre: 'rock',
                country: 'US',
                yearCreationFrom: 1990,
                yearCreationTo: 2000,
                bandNotes: 'Legendary band'
            }
        )

        expect(
            searchBandAdvancedModule.searchBandAdvancedClient
        ).toHaveBeenCalledWith({
            method: HttpMethod.GET,
            url: config.metalArchives.searchBandAdvancedUrl,
            params: {
                bandName: 'Test Band',
                exactBandMatch: true,
                status: [1, 2, 3, 4, 5, 6],
                sEcho: 1,
                iColumns: 6,
                sColumns: '',
                iDisplayStart: 10,
                iDisplayLength: 200,
                mDataProp_0: 0,
                mDataProp_1: 1,
                mDataProp_2: 2,
                mDataProp_3: 3,
                mDataProp_4: 4,
                mDataProp_5: 5,
                genre: 'rock',
                country: 'US',
                yearCreationFrom: 1990,
                yearCreationTo: 2000,
                bandNotes: 'Legendary band'
            }
        })
    })

    it('should return 0 for countTotal and countCurrent if values are missing', async () => {
        const mockClientResponse = {
            ...returnFixture,
            iTotalRecords: undefined,
            aaData: undefined
        }

        jest.spyOn(
            searchBandAdvancedModule,
            'searchBandAdvancedClient'
            // @ts-expect-error expect error because iTotalRecords and aaData are undefined
        ).mockResolvedValueOnce(mockClientResponse)

        const result = await searchBandAdvancedModule.searchBandAdvanced(
            'Test Band',
            // eslint-disable-next-line unicorn/no-useless-undefined
            undefined,
            undefined,
            {}
        )

        expect(result.countTotal).toBe(0) // Fallback to 0 if iTotalRecords is undefined
        expect(result.countCurrent).toBe(0) // Fallback to 0 if aaData is undefined
        expect(result.results).toEqual([]) // Should be an empty array if aaData is undefined
    })
})
