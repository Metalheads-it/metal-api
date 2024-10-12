import { parse, HTMLElement } from 'node-html-parser';
import type { BandSearchResult } from '../../../types/band';

const getBandIdFromLink = (link: string | undefined): string | undefined => {
    return link?.split('/').at(-1) ?? undefined;
};
const getBandNameFromHTML = (html: HTMLElement | undefined): string | undefined => {
    return html?.rawText.trim() ?? undefined;
};
const getBandLinkFromHTML = (html: HTMLElement | undefined): string | undefined => {
    const firstChild = html?.firstChild as Element | undefined;
    return firstChild?.getAttribute('href') ?? undefined;
};

const prepareBandResults = (data: string[][] = []): BandSearchResult[] => {
    return data.reduce((result: BandSearchResult[], bandData: string[]) => {
        try {
            if (!bandData?.length || !bandData[0]?.length) throw new Error('Band data invalid');
            const linkData = parse(bandData[0]);

            const band = getBandNameFromHTML(linkData);
            const link = getBandLinkFromHTML(linkData);
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
