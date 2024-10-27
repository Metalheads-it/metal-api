import { HttpMethod } from '@src/shared/constants'
import { SearchBandQuery, SearchBandEntry } from './schema/searchBand'
import { BandSearchResult } from '@src/shared/types'
import { ClientOptions } from '@src/lib/endpointSchemaClient'
import { SearchBandResponse } from './schema/searchBand'
import { extractBandInfo } from './common'
import { config } from '@src/config'

type SearchBandClient = (options: ClientOptions) => Promise<SearchBandResponse>

export const searchBand = async (
    band: string = '',
    offset: number = 0,
    searchBandClient: SearchBandClient
) => {
    const bandData = await searchBandClient({
        method: HttpMethod.GET,
        url: config.metalArchives.searchBandUrl,
        params: {
            query: band,
            iDisplayStart: offset,
            field: 'name',
            sEcho: 1,
            iColumns: 3,
            sColumns: '',
            iDisplayLength: 200,
            mDataProp_0: 0,
            mDataProp_1: 1,
            mDataProp_2: 2
        } satisfies SearchBandQuery
    })

    return {
        countTotal: bandData.iTotalRecords ?? 0,
        countCurrent: bandData.aaData?.length ?? 0,
        results: transformSearchResults(bandData.aaData)
    }
}

const transformSearchResults = (
    entries: SearchBandEntry[]
): BandSearchResult[] => {
    return entries.map(([htmlString, genre, country]) => {
        const { band, link, id } = extractBandInfo(htmlString)

        return {
            band,
            link,
            id,
            genre,
            country
        } satisfies BandSearchResult
    })
}
