import { Type, Static } from '@sinclair/typebox'
import { bandSearchResultSchema } from '@src/shared/schema'

export const searchBandQuerySchema = Type.Object({
    band: Type.String({ minLength: 1 }),
    offset: Type.Optional(Type.Number({ minimum: 0 }))
})

export type SearchBandQuery = Static<typeof searchBandQuerySchema>

export const searchBandResponseSchema = Type.Object({
    search: Type.String({ minLength: 1, example: 'immortal' }),
    offset: Type.Number({ minimum: 0 }),
    countTotal: Type.Number({ minimum: 0 }),
    countCurrent: Type.Number({ minimum: 0 }),
    results: Type.Array(bandSearchResultSchema)
})

export type SearchBandResponseSchema = Static<typeof searchBandResponseSchema>

export const searchBandSchema = {
    description: 'Search for bands',
    tags: ['bands'],
    querystring: searchBandQuerySchema,
    response: {
        200: searchBandResponseSchema
    }
}
