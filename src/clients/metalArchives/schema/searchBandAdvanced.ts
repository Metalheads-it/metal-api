import { Static, Type } from '@sinclair/typebox'
import { Endpoint } from '@src/shared/types'

const statusSchema = Type.Union([
    Type.Literal(1, { description: 'active' }),
    Type.Literal(2, { description: 'on hold' }),
    Type.Literal(3, { description: 'split-up' }),
    Type.Literal(4, { description: 'Unknown' }),
    Type.Literal(5, { description: 'Changed name' }),
    Type.Literal(6, { description: 'Disputed' })
])

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
            examples: [2000, 2010]
        })
    ),
    yearCreationTo: Type.Optional(
        Type.Number({
            description: 'Year of creation to',
            examples: [2000, 2010]
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

    themes: Type.Optional(
        Type.String({ description: 'Search by themes', default: '*' })
    ),
    location: Type.Optional(
        Type.String({ description: 'Search by location', default: '*' })
    ),
    bandLabelName: Type.Optional(
        Type.String({ description: 'Search by label', default: '*' })
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

export const searchBandAdvancedEntrySchema = Type.Tuple([
    Type.String({
        description: 'Complete band link for MA, including name, link, id'
    }),
    Type.String({ description: 'Genre' }),
    Type.String({ description: 'Country' }),
    Type.String({ description: 'Location (city/region)' }),
    Type.String({ description: 'themes' }),
    Type.String({ description: 'Year of band founding' }),
    Type.String({ description: 'Label name' })
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