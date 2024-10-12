import { Type } from '@sinclair/typebox'

export const bandSearchResultSchema = Type.Object({
    band: Type.String({ minLength: 1 }),
    genre: Type.String({ minLength: 1 }),
    country: Type.String({ minLength: 1 }),
    link: Type.String({ minLength: 1, format: 'uri' }),
    id: Type.Number({ minimum: 0 })
})

export const dataSchema = Type.Record(
    Type.String(), // Keys must be strings
    Type.Union([
        Type.String(),
        Type.Number(),
        Type.Boolean(),
        Type.Array(Type.Union([Type.String(), Type.Number(), Type.Boolean()]))
    ])
)

export const endpointSchema = Type.Object({
    querystring: Type.Optional(dataSchema),
    body: Type.Optional(dataSchema),
    response: dataSchema
})
