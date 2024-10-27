import he from 'he'

export const extractBandInfo = (
    htmlString: string
): { band: string; link: string; id: number } => {
    const regex =
        /<a href="(https:\/\/www\.metal-archives\.com\/bands\/[^"]+\/(\d+))">([^<]+)<\/a>/

    const [, link = '', id = '', band = ''] = regex.exec(htmlString) || []

    if (!link || !id || !band) {
        throw new Error('Failed to parse band information from HTML string')
    }

    return { band: he.decode(band).trim(), link, id: Number.parseInt(id, 10) }
}
