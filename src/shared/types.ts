import { Static } from '@sinclair/typebox'
import { bandSearchResultSchema, dataSchema, endpointSchema } from './schema'

export type BandSearchResult = Static<typeof bandSearchResultSchema>

export type Data = Static<typeof dataSchema>
export type Endpoint = Static<typeof endpointSchema>
