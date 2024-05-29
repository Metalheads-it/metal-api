import { parse } from 'node-html-parser';

const getBandIdFromLink = (link) => {
    return link?.split('/').at(-1) ?? null;
};
const getBandNameFromHTML = (html) => {
    return html?.rawText ?? null;
};
const getBandLinkFromHTML = (html) => {
    try {
        return html?.getAttribute('href') ?? null;
    } catch (error) {
        console.error('getBandIdFromLink', error);
        return null;
    }
};

const prepareBandResults = (data) => {
    return data.reduce((result, bandData) => {
        try {
            if (!bandData || !bandData[0]) throw new Error('Band data invalid');
            const linkData = parse(bandData[0]);
            const band = getBandNameFromHTML(linkData.firstChild);
            const link = getBandLinkFromHTML(linkData.firstChild);
            const id = getBandIdFromLink(link);
            result.push({
                band,
                link,
                id,
                genre: bandData[1],
                country: bandData[2],
            });
            return result;
        } catch (error) {
            console.error('prepareBandResults', error);
            return result;
        }
    }, []);
};

export { getBandIdFromLink, getBandNameFromHTML, getBandLinkFromHTML, prepareBandResults };
