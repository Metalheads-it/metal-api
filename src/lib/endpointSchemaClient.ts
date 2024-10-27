import { Static, TSchema } from '@sinclair/typebox'
import { Data } from '@src/shared/types'
import Ajv, { ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
import axios, { AxiosRequestConfig } from 'axios'

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH'
}

type ResponseSchema = { [httpStatusCode: string]: TSchema }

export interface EndpointSchema {
    headers?: TSchema
    params?: TSchema
    body?: TSchema
    response: ResponseSchema
}

export interface ClientOptions {
    method: HttpMethod
    url: string
    params?: Data
    body?: Data
}

interface CompiledSchema {
    headers?: ValidateFunction<unknown>
    params?: ValidateFunction<unknown>
    body?: ValidateFunction<unknown>
    response: { [httpStatusCode: string]: ValidateFunction<unknown> }
}

const successCodes = new Set([200, 201, 204])

const ajv = new Ajv()
addFormats(ajv)

export const validateRequestData = (
    data: { params?: Data; body?: Data } = {},
    compiledSchemas: CompiledSchema
) => {
    if (data.params && compiledSchemas.params) {
        const valid = compiledSchemas.params(data.params)
        if (!valid) {
            throw new Error(
                `Params validation failed: ${ajv.errorsText(compiledSchemas.params.errors)}`
            )
        }
    }

    if (data.body && compiledSchemas.body) {
        const valid = compiledSchemas.body(data.body)
        if (!valid) {
            throw new Error(
                `Body validation failed: ${ajv.errorsText(compiledSchemas.body.errors)}`
            )
        }
    }
}

export const compileResponseSchemas = (responseSchema: {
    [httpStatusCode: string]: TSchema
}): CompiledSchema['response'] => {
    return Object.fromEntries(
        Object.entries(responseSchema).map(([statusCode, schema]) => [
            statusCode,
            ajv.compile(schema)
        ])
    )
}

export const createEndpointClient = <T extends EndpointSchema>(schema: T) => {
    const compiledSchemas = {
        headers: schema.headers ? ajv.compile(schema.headers) : undefined,
        params: schema.params ? ajv.compile(schema.params) : undefined,
        body: schema.body ? ajv.compile(schema.body) : undefined,
        response: compileResponseSchemas(schema.response)
    }

    return async (
        options: ClientOptions
    ): Promise<Static<T['response'][keyof T['response']]>> => {
        const { method, url, params, body } = options

        validateRequestData({ params, body }, compiledSchemas)

        const axiosConfig: AxiosRequestConfig = {
            method: method.toLowerCase(),
            url: url,
            params: params,
            data: body
        }

        const response = await axios(axiosConfig)

        if (successCodes.has(response.status)) {
            // Success responses: validate only if the schema is defined
            const compiledResponse = compiledSchemas.response[response.status]
            if (compiledResponse && !compiledResponse(response.data)) {
                throw new Error(
                    `Response validation failed: ${ajv.errorsText(compiledResponse.errors)}`
                )
            }
            return response.data
        } else {
            // Handle error responses (404, 400, 500, etc.)
            throw new Error(`Error response: ${response.status}`)
        }
    }
}
