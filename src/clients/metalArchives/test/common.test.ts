import { extractBandInfo } from '../common'

describe('extractBandInfo', () => {
    it('should throw an error if the HTML string does not match the regex pattern', () => {
        const invalidHtmlString = '<p>No link here</p>'

        expect(() => extractBandInfo(invalidHtmlString)).toThrow(
            'Failed to parse band information from HTML string'
        )
    })

    it('should return band information correctly for a valid HTML string', () => {
        const validHtmlString =
            '<a href="https://www.metal-archives.com/bands/Immortal/12345">Immortal</a>'

        const result = extractBandInfo(validHtmlString)

        expect(result).toEqual({
            band: 'Immortal',
            link: 'https://www.metal-archives.com/bands/Immortal/12345',
            id: 12345
        })
    })

    it('should handle band names with special characters', () => {
        const htmlString =
            '<a href="https://www.metal-archives.com/bands/Mot%C3%B6rhead/987">Motörhead</a>'

        expect(extractBandInfo(htmlString)).toEqual({
            band: 'Motörhead',
            link: 'https://www.metal-archives.com/bands/Mot%C3%B6rhead/987',
            id: 987
        })
    })

    it('should handle band names with spaces and punctuation', () => {
        const htmlString =
            '<a href="https://www.metal-archives.com/bands/Black_Sabbath/1001">Black Sabbath</a>'

        expect(extractBandInfo(htmlString)).toEqual({
            band: 'Black Sabbath',
            link: 'https://www.metal-archives.com/bands/Black_Sabbath/1001',
            id: 1001
        })
    })

    it('should handle band names with leading/trailing whitespace', () => {
        const htmlString =
            '<a href="https://www.metal-archives.com/bands/ Iron Maiden /1002"> Iron Maiden </a>'

        expect(extractBandInfo(htmlString)).toEqual({
            band: 'Iron Maiden',
            link: 'https://www.metal-archives.com/bands/ Iron Maiden /1002',
            id: 1002
        })
    })

    it('should handle band names with HTML entities', () => {
        const htmlString =
            '<a href="https://www.metal-archives.com/bands/Megadeth/1003">Megadeth &amp; Co.</a>'

        expect(extractBandInfo(htmlString)).toEqual({
            band: 'Megadeth & Co.',
            link: 'https://www.metal-archives.com/bands/Megadeth/1003',
            id: 1003
        })
    })

    it('should handle very large band IDs', () => {
        const htmlString =
            '<a href="https://www.metal-archives.com/bands/Dream_Theater/9999999999">Dream Theater</a>'

        expect(extractBandInfo(htmlString)).toEqual({
            band: 'Dream Theater',
            link: 'https://www.metal-archives.com/bands/Dream_Theater/9999999999',
            id: 9999999999
        })
    })

    it('should handle band names with non-Latin characters', () => {
        const htmlString =
            '<a href="https://www.metal-archives.com/bands/Слот/1004">Слот</a>'

        expect(extractBandInfo(htmlString)).toEqual({
            band: 'Слот',
            link: 'https://www.metal-archives.com/bands/Слот/1004',
            id: 1004
        })
    })

    it('should handle band names with non-Latin characters', () => {
        const htmlString =
            '<a href="https://www.metal-archives.com/bands/Слот/1004">Слот</a>'

        expect(extractBandInfo(htmlString)).toEqual({
            band: 'Слот',
            link: 'https://www.metal-archives.com/bands/Слот/1004',
            id: 1004
        })
    })

    it('should throw an error for malformed HTML', () => {
        const htmlString =
            '<a href="https://www.metal-archives.com/bands/Opeth/1005">Opeth'

        expect(() => extractBandInfo(htmlString)).toThrow(
            'Failed to parse band information from HTML string'
        )
    })

    it('should throw an error for invalid URL format', () => {
        const htmlString = '<a href="not-a-valid-url">Invalid Band</a>'

        expect(() => extractBandInfo(htmlString)).toThrow(
            'Failed to parse band information from HTML string'
        )
    })

    it('should throw an error when href attribute is missing', () => {
        const htmlString = '<a>Band Without Link</a>'

        expect(() => extractBandInfo(htmlString)).toThrow(
            'Failed to parse band information from HTML string'
        )
    })
})
