import { HttpMethod } from '@src/shared/constants';
import { SearchBandQuery, SearchBandEntry } from './schema/search-band';
import { BandSearchResult } from '@src/shared/types';

export const searchBand = async (band: string = '', offset: number = 0, searchBandClient: any) => {
    const bandData = await searchBandClient({
        method: HttpMethod.GET,
        url: 'https://www.metal-archives.com/search/ajax-band-search/',
        data: {
            query: band,
            iDisplayStart: offset,
            field: 'name',
            sEcho: 1,
            iColumns: 3,
            sColumns: '',
            iDisplayLength: 200,
            mDataProp_0: 0,
            mDataProp_1: 1,
            mDataProp_2: 2,
        } satisfies SearchBandQuery,
    });

    return {
        countTotal: bandData.iTotalRecords ?? 0,
        countCurrent: bandData.aaData?.length ?? 0,
        results: transformSearchResults(bandData.aaData),
    };
};

const extractBandInfo = (htmlString: string): { band: string; link: string; id: number } => {
    const regex = /<a href="https:\/\/www\.metal-archives\.com\/bands\/[^"]+\/(\d+)">([^<]+)<\/a>/;

    const match = regex.exec(htmlString);

    if (!match) {
        throw new Error('Failed to parse band information from HTML string.');
    }

    const [html, id, band] = match;

    if (!band || !id) {
        throw new Error('Invalid band name or ID.');
    }

    const link = html.match(/href="([^"]+)"/)?.[1] || '';

    return { band, link, id: parseInt(id, 10) };
};

const transformSearchResults = (entries: SearchBandEntry[]): BandSearchResult[] => {
    return entries.map(([htmlString, genre, country]) => {
        const { band, link, id } = extractBandInfo(htmlString);

        return {
            band,
            link,
            id,
            genre,
            country,
        } satisfies BandSearchResult;
    });
};
