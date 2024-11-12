import { Type, Static } from '@sinclair/typebox'
import { bandSearchResultSchema } from '@src/shared/schema'

export const searchBandQuerySchema = Type.Object({
    band: Type.String({
        minLength: 1,
        description: 'Band name you want to search'
    }),
    offset: Type.Optional(
        Type.Number({
            minimum: 0,
            description:
                'Offset of search. When paging use this to skip results by a certain amount'
        })
    ),
    exactBandMatch: Type.Optional(
        Type.Boolean({ description: 'If the name has to be an exact match' })
    )
})

export type SearchBandQuery = Static<typeof searchBandQuerySchema>

export const searchBandResponseSchema = Type.Object({
    search: Type.String({ minLength: 1, example: 'immortal' }),
    offset: Type.Number({ minimum: 0 }),
    countTotal: Type.Number({ minimum: 0 }),
    countCurrent: Type.Number({ minimum: 0 }),
    results: Type.Array(bandSearchResultSchema)
})

export type SearchBandResponse = Static<typeof searchBandResponseSchema>

export const searchBandSchema = {
    description: 'Search for bands',
    tags: ['bands'],
    querystring: searchBandQuerySchema,
    response: {
        200: searchBandResponseSchema
    }
}
