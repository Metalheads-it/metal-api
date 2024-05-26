import { getJSON } from '../../../lib/fetch.js';

const archivesSearchBand = async (band = '', offset = 0, forceAll = false) => {
    if (!band && !forceAll) return { iTotalRecords: 0, aaData: [] };
    try {
        return await getJSON(
            `https://www.metal-archives.com/search/ajax-band-search/?field=name&query=${band.replace(' ', '+')}&sEcho=1&iColumns=3&sColumns=&iDisplayStart=${offset}&iDisplayLength=200&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2`,
        );
    } catch (error) {
        console.error('archivesSearch', error);
        throw error;
    }
};
export default archivesSearchBand;
