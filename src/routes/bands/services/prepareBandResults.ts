import { parse } from 'node-html-parser';

const getBandIdFromLink = (link: string | null): string | null => {
    return link?.split('/').at(-1) ?? null;
};
const getBandNameFromHTML = (html: any): string | null => {
    return html?.rawText ?? null;
};
const getBandLinkFromHTML = (html: any): string | null => {
    try {
        return html?.getAttribute('href') ?? null;
    } catch (error) {
        console.error('getBandIdFromLink', error);
        return null;
    }
};

const prepareBandResults = (data: string[][] = []): object[] => {
    return data.reduce((result: object[], bandData: string[]) => {
        try {
            if (!bandData || !bandData[0]) throw new Error('Band data invalid');
            const linkData: any = parse(bandData[0]);
            const band: string | null = getBandNameFromHTML(linkData.firstChild);
            const link: string | null = getBandLinkFromHTML(linkData.firstChild);
            const id: string | null = getBandIdFromLink(link);
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
