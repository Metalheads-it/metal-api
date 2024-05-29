import { getJSON } from '../../../lib/fetch.js';

const prepareBandName = (name) => {
    return encodeURIComponent(name?.replace(' ', '+') ?? '');
};

const prepareOffset = (offset = 0) => {
    return Number(offset) < 0 ? 0 : Number(offset) || 0;
};

const archivesSearchBand = async (band = '', offset = 0, forceAll = false) => {
    if (!band && !forceAll) return { error: '', iTotalRecords: 0, iTotalDisplayRecords: 0, aaData: [] };
    try {
        return await getJSON(
            `https://www.metal-archives.com/search/ajax-band-search/?field=name&query=${prepareBandName(band)}&sEcho=1&iColumns=3&sColumns=&iDisplayStart=${prepareOffset(offset)}&iDisplayLength=200&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2`,
        );
    } catch (error) {
        console.error('archivesSearch', error);
        throw error;
    }
};
export { archivesSearchBand, prepareBandName, prepareOffset };
