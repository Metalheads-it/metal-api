import { Type } from '@sinclair/typebox'

export const bandSearchResultSchema = Type.Object({
    band: Type.String({ minLength: 1, description: 'Band name' }),
    genre: Type.String({ minLength: 1, description: 'Band genre' }),
    country: Type.String({ minLength: 1, description: 'Band country' }),
    link: Type.String({
        minLength: 1,
        format: 'uri',
        description: 'Band link on MetalArchives'
    }),
    id: Type.Number({ minimum: 0, description: 'Metal Archives Band ID' }),
    location: Type.Optional(
        Type.String({ description: 'Band location (city/region)' })
    ),
    themes: Type.Optional(
        Type.String({ minLength: 1, description: 'Band theme' })
    ),
    label: Type.Optional(
        Type.String({ minLength: 1, description: 'Current label' })
    ),
    year: Type.Optional(
        Type.String({ length: 4, description: 'year of founding' })
    )
})

export const dataSchema = Type.Record(
    Type.String(),
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
    response: Type.Record(Type.Number(), dataSchema)
})
