import { Static, Type } from '@sinclair/typebox'
import { Endpoint } from '@src/shared/types'

export enum BAND_STATUS {
    ACTIVE = 1,
    ON_HOLD = 2,
    SPLIT_UP = 3,
    UNKNOWN = 4,
    CHANGED_NAME = 5,
    DISPUTED = 6
}

const statusSchema = Type.Union(
    Object.values(BAND_STATUS)
        .filter((value): value is BAND_STATUS => typeof value === 'number')
        .map(value => Type.Literal(value, { description: BAND_STATUS[value] }))
)

export type Status = Static<typeof statusSchema>

const countryCodeSchema = Type.String({
    description: 'Band country',
    examples: ['UK', 'IT', 'ES'],
    maxLength: 2
})

export type CountryCode = Static<typeof countryCodeSchema>

export const searchBandAdvancedQuerySchema = Type.Object({
    bandName: Type.Optional(
        Type.String({
            minLength: 1,
            description: 'Band name',
            examples: ['Immortal', 'Bathory', 'Mayhem']
        })
    ),
    exactBandMatch: Type.Optional(
        Type.Boolean({
            description: 'If the name search has to be exact',
            default: false
        })
    ),
    genre: Type.Optional(
        Type.String({
            description: 'Band genre',
            examples: ['black metal', 'Death Metal']
        })
    ),
    country: Type.Optional(countryCodeSchema),
    yearCreationFrom: Type.Optional(
        Type.Number({
            description: 'Year of creation from',
            examples: [2000, 2010],
            minimum: 1900,
            maximum: new Date().getFullYear()
        })
    ),
    yearCreationTo: Type.Optional(
        Type.Number({
            description: 'Year of creation to',
            examples: [2000, 2010],
            minimum: 1900,
            maximum: new Date().getFullYear()
        })
    ),
    bandNotes: Type.Optional(
        Type.String({ description: 'Search through Band notes' })
    ),
    status: Type.Optional(
        Type.Array(statusSchema, {
            description: 'Array of status codes with their meanings'
        })
    ),

    themes: Type.Optional(Type.String({ description: 'Search by themes' })),
    location: Type.Optional(Type.String({ description: 'Search by location' })),
    bandLabelName: Type.Optional(
        Type.String({ description: 'Search by label' })
    ),
    sEcho: Type.Number({ default: 1 }),
    iColumns: Type.Number({ default: 6 }),
    sColumns: Type.Optional(Type.String({ default: '' })),
    iDisplayStart: Type.Number({ default: 0 }),
    iDisplayLength: Type.Number({ default: 200 }),
    mDataProp_0: Type.Number({ default: 0 }),
    mDataProp_1: Type.Number({ default: 1 }),
    mDataProp_2: Type.Number({ default: 2 }),
    mDataProp_3: Type.Number({ default: 3 }),
    mDataProp_4: Type.Number({ default: 4 }),
    mDataProp_5: Type.Number({ default: 5 })
})

export type SearchBandAdvancedQuery = Static<
    typeof searchBandAdvancedQuerySchema
>

const completeBandLinkSchema = Type.String({
    description: 'Complete band link for MA, including name, link, id'
})

const genreSchema = Type.String({ description: 'Genre' })

const countrySchema = Type.String({ description: 'Country' })

export const searchBandAdvancedEntrySchema = Type.Union([
    Type.Tuple([completeBandLinkSchema, genreSchema, countrySchema]),
    Type.Tuple([
        completeBandLinkSchema,
        genreSchema,
        countrySchema,
        Type.String()
    ]),
    Type.Tuple([
        completeBandLinkSchema,
        genreSchema,
        countrySchema,
        Type.String(),
        Type.String()
    ]),
    Type.Tuple([
        completeBandLinkSchema,
        genreSchema,
        countrySchema,
        Type.String(),
        Type.String(),
        Type.String()
    ]),
    Type.Tuple([
        completeBandLinkSchema,
        genreSchema,
        countrySchema,
        Type.String(),
        Type.String(),
        Type.String(),
        Type.String()
    ])
])

export type SearchBandAdvancedEntry = Static<
    typeof searchBandAdvancedEntrySchema
>

export const searchBandAdvancedResponseSchema = Type.Object({
    error: Type.Optional(Type.String()),
    iTotalRecords: Type.Number(),
    iTotalDisplayRecords: Type.Number(),
    sEcho: Type.Number(),
    aaData: Type.Array(searchBandAdvancedEntrySchema)
})
export type SearchBandAdvancedResponse = Static<
    typeof searchBandAdvancedResponseSchema
>

export const searchBandAdvancedSchema = {
    querystring: searchBandAdvancedQuerySchema,
    response: {
        200: searchBandAdvancedResponseSchema
    }
} satisfies Endpoint
