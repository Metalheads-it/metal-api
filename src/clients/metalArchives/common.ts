export const extractBandInfo = (
    htmlString: string
): { band: string; link: string; id: number } => {
    const regex =
        /<a href="(https:\/\/www\.metal-archives\.com\/bands\/[^"]+\/(\d+))">([^<]+)<\/a>/

    const match = regex.exec(htmlString)

    if (!match) {
        throw new Error('Failed to parse band information from HTML string')
    }

    const [_, link, id, band] = match

    if (!band) {
        throw new Error('Invalid band name')
    }

    if (!id) {
        throw new Error('Invalid band ID')
    }

    if (!link) {
        throw new Error('Failed to extract band link')
    }

    return { band, link, id: Number.parseInt(id, 10) }
}
