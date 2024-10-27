import { HttpMethod } from '@src/shared/constants'
import { BandSearchResult } from '@src/shared/types'
import {
    BAND_STATUS,
    CountryCode,
    SearchBandAdvancedEntry,
    SearchBandAdvancedQuery,
    Status
} from './schema/searchBandAdvanced'
import { extractBandInfo } from './common'
import { config } from '@src/config'
import { createEndpointClient } from '@src/lib/endpointSchemaClient'
import { searchBandAdvancedSchema } from './schema/searchBandAdvanced'

export const searchBandAdvancedClient = createEndpointClient(
    searchBandAdvancedSchema
)

export const searchBandAdvanced = async (
    band: string = '',
    offset: number = 0,
    exactBandMatch: boolean = false,
    advancedSearchData: {
        genre?: string
        country?: CountryCode
        yearCreationFrom?: number
        yearCreationTo?: number
        bandNotes?: string
        status?: Status[]
        themes?: string
        location?: string
        bandLabelName?: string
    }
) => {
    const {
        status = Object.values(BAND_STATUS).filter(
            (value): value is BAND_STATUS => typeof value === 'number'
        ),
        themes = '*',
        location = '*',
        bandLabelName = '*'
    } = advancedSearchData

    const conditionalParameters = {
        ...(advancedSearchData.genre && { genre: advancedSearchData.genre }),
        ...(advancedSearchData.country && {
            country: advancedSearchData.country
        }),
        ...(advancedSearchData.yearCreationFrom && {
            yearCreationFrom: advancedSearchData.yearCreationFrom
        }),
        ...(advancedSearchData.yearCreationTo && {
            yearCreationTo: advancedSearchData.yearCreationTo
        }),
        ...(advancedSearchData.bandNotes && {
            bandNotes: advancedSearchData.bandNotes
        })
    }

    const bandData = await searchBandAdvancedClient({
        method: HttpMethod.GET,
        url: config.metalArchives.searchBandAdvancedUrl,
        params: {
            bandName: band,
            exactBandMatch,
            status,
            themes,
            location,
            bandLabelName,
            sEcho: 1,
            iColumns: 6,
            sColumns: '',
            iDisplayStart: offset,
            iDisplayLength: 200,
            mDataProp_0: 0,
            mDataProp_1: 1,
            mDataProp_2: 2,
            mDataProp_3: 3,
            mDataProp_4: 4,
            mDataProp_5: 5,
            ...conditionalParameters
        } satisfies SearchBandAdvancedQuery
    })

    return {
        countTotal: bandData.iTotalRecords ?? 0,
        countCurrent: bandData.aaData?.length ?? 0,
        results: transformSearchResults(bandData.aaData)
    }
}

const transformSearchResults = (
    entries: SearchBandAdvancedEntry[] | undefined
): BandSearchResult[] => {
    if (entries === undefined) return []
    return entries.map(
        ([htmlString, genre, country, location, themes, year, label]) => {
            const { band, link, id } = extractBandInfo(htmlString)

            return {
                band,
                link,
                id,
                genre,
                country,
                location,
                themes,
                year,
                label
            } satisfies BandSearchResult
        }
    )
}
