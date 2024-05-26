import { parse } from 'node-html-parser';

const prepareBandResults = (data) => {
    return data.reduce((result, bandData) => {
        try {
            const linkData = parse(bandData);
            const band = linkData.firstChild.rawText;
            const link = linkData.firstChild.getAttribute('href');
            const id = link.split('/').at(-1);
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
            throw error;
        }
    }, []);
};

export default prepareBandResults;
