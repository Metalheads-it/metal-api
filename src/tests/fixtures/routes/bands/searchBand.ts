import { SearchBandResponse } from '@src/routes/bands/schema/search'

export const searchBandResponseFixture = {
    search: 'immortal',
    offset: 0,
    countTotal: 4,
    countCurrent: 4,
    results: [
        {
            band: 'Immortal',
            genre: 'Death Metal',
            country: 'Denmark',
            link: 'https://www.metal-archives.com/bands/Immortal/25791',
            id: 25791
        },
        {
            band: 'Immortal',
            genre: 'Death Metal',
            country: 'Mexico',
            link: 'https://www.metal-archives.com/bands/Immortal/3540470418',
            id: 3540470418
        },
        {
            band: 'Immortal',
            genre: 'Black Metal',
            country: 'Norway',
            link: 'https://www.metal-archives.com/bands/Immortal/75',
            id: 75
        },
        {
            band: 'Immortal',
            genre: 'Speed/Thrash Metal',
            country: 'United States',
            link: 'https://www.metal-archives.com/bands/Immortal/32331',
            id: 32331
        }
    ]
} satisfies SearchBandResponse
