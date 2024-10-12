import { FastifyInstance } from 'fastify';
import { getJSON } from '../../lib/fetch';

export const createMetalArchivesClient = (_fastify: FastifyInstance) => ({
    searchBand: async (band: string = '', offset: number = 0, forceAll: boolean = false) => {
        if (!band && !forceAll) return { error: '', iTotalRecords: 0, iTotalDisplayRecords: 0, aaData: [] };
        try {
            return await getJSON(
                `https://www.metal-archives.com/search/ajax-band-search/?field=name&query=${prepareBandName(band)}&sEcho=1&iColumns=3&sColumns=&iDisplayStart=${prepareOffset(offset)}&iDisplayLength=200&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2`,
            );
        } catch (error) {
            console.error('search band', error);
            throw error;
        }
    },
});

export type MetalArchivesClient = ReturnType<typeof createMetalArchivesClient>;

export const prepareBandName = (name: string | undefined = '') => {
    return encodeURIComponent(name?.replace(' ', '+') ?? '');
};

export const prepareOffset = (offset: number = 0) => {
    return Number(offset) < 0 ? 0 : Number(offset) || 0;
};
