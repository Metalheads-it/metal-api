import { Static, Type } from '@sinclair/typebox'
import { Endpoint } from '@src/shared/types'

export const searchBandQuerySchema = Type.Object({
    query: Type.String({ minLength: 1 }),
    iDisplayStart: Type.Optional(Type.Number({ minimum: 0 })),
    field: Type.String({ minLength: 1 }),
    sEcho: Type.Optional(Type.Number({ minimum: 0 })),
    iColumns: Type.Optional(Type.Number({ minimum: 0 })),
    sColumns: Type.Optional(Type.String({ nullable: true })),
    iDisplayLength: Type.Optional(Type.Number({ minimum: 0 })),
    mDataProp_0: Type.Optional(Type.Number({ minimum: 0 })),
    mDataProp_1: Type.Optional(Type.Number({ minimum: 0 })),
    mDataProp_2: Type.Optional(Type.Number({ minimum: 0 }))
})
export type SearchBandQuery = Static<typeof searchBandQuerySchema>

export const searchBandEntrySchema = Type.Tuple([
    Type.String(),
    Type.String(),
    Type.String()
])
export type SearchBandEntry = Static<typeof searchBandEntrySchema>

export const searchBandResponseSchema = Type.Object({
    error: Type.Optional(Type.String()),
    iTotalRecords: Type.Number(),
    iTotalDisplayRecords: Type.Number(),
    sEcho: Type.Number(),
    aaData: Type.Array(searchBandEntrySchema)
})
export type SearchBandResponse = Static<typeof searchBandResponseSchema>

export const searchBandSchema = {
    querystring: searchBandQuerySchema,
    response: {
        200: searchBandResponseSchema
    }
} satisfies Endpoint
