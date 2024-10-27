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
})
