import { Type, Static } from "@sinclair/typebox";

export const searchBandParametersSchema = Type.Object({
    band: Type.String({ minLength: 1 }),
    offset: Type.Optional(Type.Number({ minimum: 0 })),
})

export type SearchBandParameter = Static<typeof searchBandParametersSchema>;

export const searchBandResponseSchema = Type.Object({
    search: Type.String({ minLength: 1 }),
    offset: Type.Number({ minimum: 0 }),
    countTotal: Type.Number({ minimum: 0 }),
    countCurrent: Type.Number({ minimum: 0 }),
    results: Type.Array(Type.Object({
        band: Type.String({ minLength: 1 }),
        genre: Type.String({ minLength: 1 }),
        country: Type.String({ minLength: 1 }),
    }))
})

export type SearchBandResponseSchema = Static<typeof searchBandResponseSchema>;

export const searchBandSchema = {
    params: searchBandParametersSchema,
    response: {
        200: searchBandResponseSchema,
    },
};
