import { HttpMethod } from '@src/shared/constants'
import { BandSearchResult } from '@src/shared/types'
import { ClientOptions } from '@src/lib/endpointSchemaClient'
import {
    CountryCode,
    SearchBandAdvancedEntry,
    SearchBandAdvancedQuery,
    SearchBandAdvancedResponse,
    Status
} from './schema/searchBandAdvanced'
import { extractBandInfo } from './common'

type SearchBandAdvancedClient = (
    options: ClientOptions
) => Promise<SearchBandAdvancedResponse>

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
    },
    searchBandAdvancedClient: SearchBandAdvancedClient
) => {
    const {
        status = [1, 2, 3, 4, 5, 6],
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
        url: 'https://www.metal-archives.com/search/ajax-advanced/searching/bands/',
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
    entries: SearchBandAdvancedEntry[]
): BandSearchResult[] => {
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
